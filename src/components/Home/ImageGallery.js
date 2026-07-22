import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchTenderListData} from '../../reducers/cardSlice';
import useRequireTenderLogin from '../../hooks/useRequireTenderLogin';
import {
  dedupeTendersByPk,
  tenderHasGalleryImage,
} from '../../utils/newspaperTenders';
import {resolveUriFastImageSource} from '../../utils/tenderImage';
import {DEFAULT_PAGE_SIZE} from '../../constants/pagination';
import {wp, spacing, deviceInfo, getGridColumns} from '../../utils/responsive';

const IMAGE_GALLERY_CACHE_KEY = 'image-gallery:tender:list:v2';

const ImageGallery = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useRequireTenderLogin(navigation, route);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [galleryTenders, setGalleryTenders] = useState([]);
  const [cachedTenders, setCachedTenders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isInitializedRef = useRef(false);

  const numColumns = getGridColumns();
  const imageSize =
    (deviceInfo.screenWidth - spacing.lg * 2 - (numColumns - 1) * spacing.sm) /
    numColumns;

  const persistGalleryCache = useCallback(items => {
    const cacheItems = (items || [])
      .filter(item => item?.source !== 'PPMO/EGP')
      .filter(tenderHasGalleryImage);
    AsyncStorage.setItem(
      IMAGE_GALLERY_CACHE_KEY,
      JSON.stringify(cacheItems),
    ).catch(() => {});
  }, []);

  const fetchGalleryPage = useCallback(
    async (pageNum = 1, {forceRefresh = false, append = false} = {}) => {
      const result = await dispatch(
        fetchTenderListData({
          page: pageNum,
          page_size: DEFAULT_PAGE_SIZE,
          exclude_source: 'PPMO/EGP',
          forceRefresh,
          storeInTabLists: false,
        }),
      ).unwrap();

      const incoming = result?.data || [];
      setGalleryTenders(prev => {
        const merged =
          append && pageNum > 1 ? dedupeTendersByPk([...prev, ...incoming]) : incoming;
        persistGalleryCache(merged);
        return merged;
      });
      setPage(pageNum);
      setTotalPages(result?.total_pages || 1);

      return result;
    },
    [dispatch, persistGalleryCache],
  );

  const fetchGalleryData = useCallback(
    async ({silent = false, showRefresh = false, append = false, pageNum = 1} = {}) => {
      try {
        if (showRefresh) {
          setIsRefreshing(true);
        } else if (append) {
          setIsLoadingMore(true);
        } else if (!silent) {
          setIsGalleryLoading(true);
        }

        await fetchGalleryPage(pageNum, {
          forceRefresh: !append,
          append,
        });
      } catch (error) {
      } finally {
        setIsRefreshing(false);
        setIsLoadingMore(false);
        setIsGalleryLoading(false);
      }
    },
    [fetchGalleryPage],
  );

  useEffect(() => {
    const initializeGalleryData = async () => {
      if (isInitializedRef.current) {
        return;
      }
      isInitializedRef.current = true;

      let hasSeedData = false;

      try {
        const galleryRaw = await AsyncStorage.getItem(IMAGE_GALLERY_CACHE_KEY);
        if (galleryRaw) {
          const galleryItems = JSON.parse(galleryRaw);
          if (Array.isArray(galleryItems) && galleryItems.length) {
            hasSeedData = true;
            setCachedTenders(galleryItems);
          }
        }
      } catch (error) {}

      fetchGalleryData({silent: hasSeedData});
    };

    initializeGalleryData();
  }, [fetchGalleryData]);

  useFocusEffect(
    useCallback(() => {
      if (!isInitializedRef.current) {
        return;
      }
      fetchGalleryData({silent: true});
    }, [fetchGalleryData]),
  );

  const tenderImages = useMemo(() => {
    const sourceTenders =
      galleryTenders.length > 0 ? galleryTenders : cachedTenders;

    if (!sourceTenders?.length) {
      return [];
    }

    const images = sourceTenders
      .filter(item => item?.source !== 'PPMO/EGP')
      .filter(tenderHasGalleryImage)
      .map((tender, tenderIndex) => ({
        id: `${tender.pk}-${tenderIndex}`,
        url: tender.image,
        tenderTitle: tender.title || 'Untitled Tender',
        tenderSource: tender.source || 'Unknown Source',
        publishedDate: tender.published_date,
      }));

    images.sort(
      (a, b) =>
        moment(b.publishedDate).valueOf() - moment(a.publishedDate).valueOf(),
    );

    return images;
  }, [galleryTenders, cachedTenders]);

  const handleImagePress = useCallback(index => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImageIndex(null);
  }, []);

  const handleImageChange = useCallback(index => {
    setSelectedImageIndex(index);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchGalleryData({silent: true, showRefresh: true, pageNum: 1});
  }, [fetchGalleryData]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || isRefreshing || isGalleryLoading || page >= totalPages) {
      return;
    }
    fetchGalleryData({
      silent: true,
      append: true,
      pageNum: page + 1,
    });
  }, [
    fetchGalleryData,
    isGalleryLoading,
    isLoadingMore,
    isRefreshing,
    page,
    totalPages,
  ]);

  const renderGridItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        style={[styles.gridItem, {width: imageSize, height: imageSize}]}
        onPress={() => handleImagePress(index)}
        activeOpacity={0.8}>
        <FastImage
          source={resolveUriFastImageSource(item.url, FastImage)}
          style={styles.gridImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    ),
    [imageSize, handleImagePress],
  );

  const modalImages = useMemo(
    () =>
      tenderImages.map(img => ({
        url: img.url,
        props: {
          source: {uri: img.url},
        },
      })),
    [tenderImages],
  );

  const showInitialLoader =
    (isGalleryLoading || isRefreshing) && tenderImages.length === 0;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tender Images</Text>
        <Text style={styles.headerSubtitle}>
          Newspaper tenders (excluding PPMO)
          {tenderImages.length > 0 ? ` · ${tenderImages.length} images` : ''}
        </Text>
      </View>

      {showInitialLoader ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0375B7" />
          <Text style={styles.loadingText}>Loading tender images...</Text>
        </View>
      ) : tenderImages.length > 0 ? (
        <FlatList
          data={tenderImages}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={7}
          initialNumToRender={10}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#0375B7" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#0375B7']}
              tintColor="#0375B7"
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="images-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No tender images available</Text>
          <Text style={styles.emptySubtext}>
            Scanned images from non-PPMO newspaper tenders will appear here
          </Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={handleModalClose}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>

          {selectedImageIndex !== null && (
            <ImageZoomViewer
              imageUrls={modalImages}
              index={selectedImageIndex}
              onChange={handleImageChange}
              enableSwipeDown={true}
              onSwipeDown={handleModalClose}
              renderIndicator={(currentIndex, allSize) => (
                <View style={styles.indicator}>
                  <Text style={styles.indicatorText}>
                    {currentIndex + 1} / {allSize}
                  </Text>
                </View>
              )}
              backgroundColor="black"
              renderImage={props => (
                <FastImage
                  {...props}
                  style={{width: '100%', height: '100%'}}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0375B7',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  gridItem: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: wp(2),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  footerLoader: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
    padding: 10,
  },
  indicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  indicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ImageGallery;
