import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchNewspaperTenderList} from '../../reducers/cardSlice';
import {
  GALLERY_DAYS_WINDOW,
  NEWSPAPER_CACHE_KEY,
  tenderHasGalleryImage,
} from '../../utils/newspaperTenders';
import {wp, spacing, deviceInfo, getGridColumns} from '../../utils/responsive';

const IMAGE_GALLERY_CACHE_KEY = 'image-gallery:tender:list:v1';

const ImageGallery = () => {
  const dispatch = useDispatch();
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [galleryTenders, setGalleryTenders] = useState([]);
  const [cachedTenders, setCachedTenders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isInitializedRef = useRef(false);

  const numColumns = getGridColumns();
  const imageSize =
    (deviceInfo.screenWidth - spacing.lg * 2 - (numColumns - 1) * spacing.sm) /
    numColumns;

  const persistGalleryCache = useCallback(items => {
    // newspaperData is already server-filtered to the window + PPMO-excluded;
    // for the gallery we only keep entries that actually have an image.
    const cacheItems = (items || [])
      .filter(item => item?.source !== 'PPMO/EGP')
      .filter(tenderHasGalleryImage);
    AsyncStorage.setItem(
      IMAGE_GALLERY_CACHE_KEY,
      JSON.stringify(cacheItems),
    ).catch(() => {});
  }, []);

  const fetchGalleryData = useCallback(
    async ({silent = false, showRefresh = false} = {}) => {
      try {
        if (showRefresh) {
          setIsRefreshing(true);
        } else if (!silent) {
          setIsGalleryLoading(true);
        }

        const result = await dispatch(
          fetchNewspaperTenderList({
            days: GALLERY_DAYS_WINDOW,
            forceRefresh: !silent,
          }),
        );

        if (result.payload?.data?.length) {
          setGalleryTenders(result.payload.data);
          persistGalleryCache(result.payload.data);
        }
      } catch (error) {
      } finally {
        setIsRefreshing(false);
        setIsGalleryLoading(false);
      }
    },
    [dispatch, persistGalleryCache],
  );

  useEffect(() => {
    const initializeGalleryData = async () => {
      if (isInitializedRef.current) {
        return;
      }
      isInitializedRef.current = true;

      let hasSeedData = false;

      try {
        const [newspaperRaw, galleryRaw] = await Promise.all([
          AsyncStorage.getItem(NEWSPAPER_CACHE_KEY),
          AsyncStorage.getItem(IMAGE_GALLERY_CACHE_KEY),
        ]);

        if (newspaperRaw) {
          const newspaperItems = JSON.parse(newspaperRaw);
          if (Array.isArray(newspaperItems) && newspaperItems.length) {
            hasSeedData = true;
            setCachedTenders(newspaperItems);
          }
        }

        if (galleryRaw) {
          const galleryItems = JSON.parse(galleryRaw);
          if (Array.isArray(galleryItems) && galleryItems.length) {
            hasSeedData = true;
            setCachedTenders(prev => (prev.length ? prev : galleryItems));
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
    fetchGalleryData({silent: true, showRefresh: true});
  }, [fetchGalleryData]);

  const renderGridItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        style={[styles.gridItem, {width: imageSize, height: imageSize}]}
        onPress={() => handleImagePress(index)}
        activeOpacity={0.8}>
        <Image
          source={{uri: item.url}}
          style={styles.gridImage}
          resizeMode="cover"
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Tender Images</Text>
        <Text style={styles.headerSubtitle}>
          Last 5 days
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
          <Text style={styles.emptyText}>
            No recent tender images available
          </Text>
          <Text style={styles.emptySubtext}>
            Images from newspaper tenders in the last 5 days will appear here
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
                <Image
                  {...props}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
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
