import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { fetchTenderListData } from '../../reducers/cardSlice';
import { wp, hp, normalize, spacing, deviceInfo, getGridColumns } from '../../utils/responsive';

const ImageGallery = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.card);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allTenderData, setAllTenderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Responsive grid configuration
  const numColumns = getGridColumns();
  const imageSize = (deviceInfo.screenWidth - (spacing.lg * 2) - ((numColumns - 1) * spacing.sm)) / numColumns;

  // Pagination constants
  const ITEMS_PER_PAGE = 50;
  const INITIAL_LOAD_SIZE = 100;

  // Fetch tender data with pagination
  const fetchTenderData = useCallback(async (page = 1, shouldClearData = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const result = await dispatch(fetchTenderListData({ 
        page: page, 
        page_size: ITEMS_PER_PAGE 
      }));
      
      if (result.payload?.data && result.payload.data.length > 0) {
        if (shouldClearData || page === 1) {
          setAllTenderData(result.payload.data);
        } else {
          setAllTenderData(prevData => [...prevData, ...result.payload.data]);
        }
        
        // Check if we've reached the end
        if (result.payload.data.length < ITEMS_PER_PAGE) {
          setHasMoreData(false);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [dispatch]);

  // Load initial data
  useEffect(() => {
    fetchTenderData(1, true);
  }, [fetchTenderData]);

  // Handle end reached for pagination
  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTenderData(nextPage);
    }
  }, [isLoadingMore, hasMoreData, currentPage, fetchTenderData]);

  // Extract tender images from last 7 days (extended for more images)
  const tenderImages = useMemo(() => {
    if (!allTenderData || allTenderData.length === 0) return [];
    
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');
    const images = [];
    let totalTenders = 0;
    let tendersWithImages = 0;
    let tendersExcludedBySource = 0;
    let tendersExcludedByDate = 0;
    
    allTenderData.forEach((tender, tenderIndex) => {
      totalTenders++;
      
      // Check if tender has an image and it's a valid URL
      if (!tender.image || tender.image.trim() === '' || tender.image === 'null') {
        return;
      }
      
      // Check if tender source is not PPMO/EGP
      if (tender.source === 'PPMO/EGP') {
        tendersExcludedBySource++;
        return;
      }
      
      // Check if tender is from last 7 days (more flexible)
      if (tender.published_date) {
        const tenderDate = moment(tender.published_date);
        if (tenderDate.isAfter(sevenDaysAgo)) {
          tendersWithImages++;
          images.push({
            id: `${tender.pk}-${tenderIndex}`,
            url: tender.image,
            tenderTitle: tender.title || 'Untitled Tender',
            tenderSource: tender.source || 'Unknown Source',
            publishedDate: tender.published_date,
          });
        } else {
          tendersExcludedByDate++;
        }
      } else {
        // If no published_date, include it anyway (for more images)
        tendersWithImages++;
        images.push({
          id: `${tender.pk}-${tenderIndex}`,
          url: tender.image,
          tenderTitle: tender.title || 'Untitled Tender',
          tenderSource: tender.source || 'Unknown Source',
          publishedDate: tender.published_date || 'Unknown Date',
        });
      }
    });
    
    
    // Sort by published date (newest first), but put items without date at the end
    images.sort((a, b) => {
      if (!a.publishedDate || a.publishedDate === 'Unknown Date') return 1;
      if (!b.publishedDate || b.publishedDate === 'Unknown Date') return -1;
      return moment(b.publishedDate).valueOf() - moment(a.publishedDate).valueOf();
    });
    
    return images;
  }, [allTenderData]);

  // Handle image press
  const handleImagePress = useCallback((index) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImageIndex(null);
  }, []);

  // Handle image change in modal
  const handleImageChange = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  // Responsive grid item render
  const renderGridItem = useCallback(({ item, index }) => (
    <TouchableOpacity
      style={[styles.gridItem, { width: imageSize, height: imageSize }]}
      onPress={() => handleImagePress(index)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.gridImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ), [imageSize, handleImagePress]);

  // Prepare images for modal viewer
  const modalImages = useMemo(() => {
    return tenderImages.map(img => ({
      url: img.url,
      props: {
        source: { uri: img.url },
      }
    }));
  }, [tenderImages]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Tender Images</Text>
      </View>

      {/* Image Grid */}
      {isLoading ? (
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
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          windowSize={10}
          initialNumToRender={15}
          ListHeaderComponent={
            <Text style={styles.imageCount}>
            </Text>
          }
          ListFooterComponent={isLoadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#0375B7" />
              <Text style={styles.loadingMoreText}>Loading more images...</Text>
            </View>
          ) : null}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="images-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No recent tender images available</Text>
          <Text style={styles.emptySubtext}>Images from the last 7 days will appear here</Text>
        </View>
      )}

      {/* Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={handleModalClose}
          >
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
                  style={{ width: '100%', height: '100%' }}
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
    flexDirection: 'row',
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
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  imageCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  gridItem: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: wp(2),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 10,
    fontSize: 14,
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