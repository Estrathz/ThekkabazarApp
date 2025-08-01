import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from './DetailStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Octicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproductListData } from '../../../reducers/bazarSlice';
import Custombutton from '../../../Containers/Button/button';
import { colors, fonts } from '../../../theme';
import { wp, hp, normalize, spacing, deviceInfo } from '../../../utils/responsive';

const Detail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const { productList, error, status } = useSelector(state => state.bazar);
  const { isAuthenticated, access_token } = useSelector(state => state.users);

  // Route parameters
  const pathname = route.params?.pathname;
  const mainCategory = route.params?.name;

  // Component state
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [relatedCategory, setRelatedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ensure page is always a valid positive integer
  const validPage = useMemo(() => Math.max(1, page), [page]);

  // Validate route parameters
  useEffect(() => {
    if (!pathname || !mainCategory) {
      Alert.alert('Error', 'Invalid navigation parameters', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [pathname, mainCategory, navigation]);

  // Authentication check and data fetch
  useEffect(() => {
    console.log('Detail component - Auth state:', { isAuthenticated, hasToken: !!access_token });
    
    if (!isAuthenticated || !access_token || access_token.trim() === '') {
      console.log('User not authenticated, redirecting to login');
      Alert.alert(
        'Login Required',
        'Please login to view product details.',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    getProductData();
  }, [dispatch, route, validPage, isAuthenticated, access_token]);

  // Update allProducts when productList changes
  useEffect(() => {
    if (productList && productList.data) {
      setAllProducts(prevData => {
        return { ...prevData, ...productList.data };
      });
    }
  }, [productList]);

  // Error handling
  useEffect(() => {
    if (error) {
      console.error('Product list error:', error);
      Alert.alert(
        'Error',
        'Failed to load products. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [error]);

  // Fetch product data with error handling
  const getProductData = useCallback(async () => {
    console.log('getProductData called - Auth state:', { isAuthenticated, hasToken: !!access_token });
    
    if (!isAuthenticated || !access_token || access_token.trim() === '') {
      console.log('User not authenticated in getProductData, redirecting to login');
      navigation.navigate('Login');
      return;
    }

    if (!pathname || !mainCategory) {
      console.log('Missing required parameters');
      return;
    }

    try {
      console.log('Fetching product data for:', pathname, mainCategory);
      
      const params = {
        page: validPage,
      };

      if (pathname === 'mainProduct') {
        params.mainCategory = mainCategory;
      } else if (pathname === 'subProduct') {
        params.subcategory = mainCategory;
      }

      await dispatch(fetchproductListData(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch product data:', error);
      Alert.alert(
        'Error',
        'Failed to load products. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  }, [isAuthenticated, access_token, navigation, pathname, mainCategory, validPage, dispatch]);

  // Modal handlers
  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearch('');
    setPage(1);
    setAllProducts([]);
    
    try {
      await getProductData();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [getProductData]);

  // Filter handler
  const handleFilter = useCallback(async () => {
    if (!isAuthenticated || !access_token || access_token.trim() === '') {
      console.log('User not authenticated for filter, redirecting to login');
      navigation.navigate('Login');
      return;
    }

    try {
      const params = {};
      
      if (relatedCategory && relatedCategory.trim() !== '') {
        params.mainCategory = relatedCategory.trim();
      }
      if (location && location.trim() !== '') {
        params.location = location.trim();
      }
      if (businessType && businessType.trim() !== '') {
        params.businessType = businessType.trim();
      }

      await dispatch(fetchproductListData(params)).unwrap();
      closeModal();
    } catch (error) {
      console.error('Filter failed:', error);
      Alert.alert('Error', 'Failed to apply filter. Please try again.');
    }
  }, [isAuthenticated, access_token, navigation, relatedCategory, location, businessType, dispatch, closeModal]);

  // Pagination handler
  const handleEndReached = useCallback(async () => {
    console.log('End reached, page:', page);
    
    if (!isAuthenticated || !access_token || access_token.trim() === '') {
      console.log('User not authenticated for pagination, redirecting to login');
      navigation.navigate('Login');
      return;
    }

    if (isLoadingMore || !productList?.total_pages || page >= productList.total_pages) {
      return;
    }

    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
    setIsLoadingMore(false);
  }, [isAuthenticated, access_token, navigation, page, productList?.total_pages, isLoadingMore]);

  // Search handler
  const handleSearch = useCallback((text) => {
    setSearch(text);
    
    if (!allProducts?.products) {
      console.log('No products available for search.');
      return;
    }

    if (!text || text.trim() === '') {
      // Reset to original data
      setAllProducts(prevData => ({
        ...prevData,
        products: productList?.data?.products || []
      }));
      return;
    }

    const filteredProducts = allProducts.products.filter(product =>
      product.name?.toLowerCase().includes(text.toLowerCase()) ||
      product.brand?.toLowerCase().includes(text.toLowerCase())
    );
    
    setAllProducts(prevData => ({
      ...prevData,
      products: filteredProducts
    }));
  }, [allProducts, productList]);

  // Render empty list message
  const EmptyListMessage = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No products available</Text>
      <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
    </View>
  ), []);

  // Render loading footer
  const LoadingFooter = useCallback(() => (
    isLoadingMore ? (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingFooterText}>Loading more products...</Text>
      </View>
    ) : null
  ), [isLoadingMore]);

  // Render product item
  const renderProductItem = useCallback(({ item, index }) => (
    <View key={`product-${index}`} style={styles.productCardList}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={styles.ProductImage}
          source={{ uri: item.image }}
          defaultSource={require('../../../assets/dummy-image.png')}
          onError={(error) => console.log('Product image load error:', error.nativeEvent.error)}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {item.name || 'Unnamed Product'}
          </Text>
          <Text style={styles.productBrand}>
            Brand: {item.brand || 'Unknown'}
          </Text>
          <Text style={styles.productPrice}>
            Price: {item.price || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.supplierInfo}>
        <Text style={styles.supplierTitle}>Supplier Information</Text>
        <View style={styles.supplierDivider}>
          <View style={styles.supplierDividerAccent} />
        </View>

        <Text style={styles.supplierName}>
          {item.suppliername || 'Unknown Supplier'}
        </Text>

        <View style={styles.supplierDetail}>
          <Icon name="location-on" size={20} color={colors.primary} />
          <Text style={styles.supplierDetailText}>
            {item.city || 'Unknown'}, {item.district || 'Unknown'}
          </Text>
        </View>

        <View style={styles.supplierDetail}>
          <Icon name="phone" size={20} color={colors.primary} />
          <Text style={styles.supplierDetailText}>
            {item.mobile_number || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  ), []);

  // Render header component
  const renderHeader = useCallback(() => (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Products</Text>
      </View>

      <View style={styles.SearchContainer}>
        <Icon
          name="filter-alt"
          size={35}
          color={colors.primary}
          style={styles.filterIcon}
          onPress={openModal}
        />
        <View style={styles.searchSection}>
          <Icon
            style={styles.searchIcon}
            name="search"
            size={20}
            color="#000"
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Search Products"
            placeholderTextColor={'#424242'}
            autoCapitalize="none"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <Text style={styles.categoryTitle}>{mainCategory}</Text>

      <View style={styles.relatedProductsHeader}>
        <Icon style={styles.checklistIcon} name="checklist" size={20} color="#000" />
        <Text style={styles.relatedProductsText}>Related Products</Text>
      </View>
    </View>
  ), [navigation, openModal, search, handleSearch, mainCategory]);

  // Render filter modal
  const renderFilterModal = useCallback(() => (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Category</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Choose a filter category from the provided list.
          </Text>

          {/* Related Category Filter */}
          {allProducts?.related_categories && allProducts.related_categories.length > 0 && (
            <View style={styles.relatedCategory}>
              <View style={styles.filterSectionHeader}>
                <Icon name="format-align-justify" size={20} color="black" />
                <Text style={styles.filterSectionTitle}>Related Category</Text>
              </View>
              {allProducts.related_categories.map((items, index) => (
                <TouchableOpacity
                  key={`related-${index}`}
                  style={styles.filterOption}
                  onPress={() => setRelatedCategory(items.name)}
                >
                  <Icon2
                    name="dot-fill"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[
                    styles.filterOptionText,
                    { color: relatedCategory === items.name ? 'red' : colors.primary }
                  ]}>
                    {items.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Location Filter */}
          {allProducts?.location && allProducts.location.length > 0 && (
            <View style={styles.relatedCategory}>
              <View style={styles.filterSectionHeader}>
                <Icon name="location-on" size={20} color="black" />
                <Text style={styles.filterSectionTitle}>Location</Text>
              </View>
              {allProducts.location.map((items, index) => (
                <TouchableOpacity
                  key={`location-${index}`}
                  style={styles.filterOption}
                  onPress={() => setLocation(items.name)}
                >
                  <Icon2 name="dot-fill" size={20} color={colors.primary} />
                  <Text style={[
                    styles.filterOptionText,
                    { color: location === items.name ? 'red' : colors.primary }
                  ]}>
                    {items.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Business Type Filter */}
          {allProducts?.businesstype && allProducts.businesstype.length > 0 && (
            <View style={styles.relatedCategory}>
              <View style={styles.filterSectionHeader}>
                <Icon name="format-align-justify" size={20} color="black" />
                <Text style={styles.filterSectionTitle}>Business Type</Text>
              </View>
              {allProducts.businesstype.map((items, index) => (
                <TouchableOpacity
                  key={`business-${index}`}
                  style={styles.filterOption}
                  onPress={() => setBusinessType(items.name)}
                >
                  <Icon2 name="dot-fill" size={20} color={colors.primary} />
                  <Text style={[
                    styles.filterOptionText,
                    { color: businessType === items.name ? 'red' : colors.primary }
                  ]}>
                    {items.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Custombutton title="Apply Filter" onPress={handleFilter} />
        </View>
      </ScrollView>
    </Modal>
  ), [isModalVisible, closeModal, allProducts, relatedCategory, location, businessType, handleFilter]);

  // Show loading state if initial load
  if (status === 'loading' && !allProducts.products) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={renderHeader}
        data={allProducts.products || []}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => `product-${item.id || index}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={EmptyListMessage}
        ListFooterComponent={LoadingFooter}
      />
      {renderFilterModal()}
    </>
  );
};

export default Detail;
