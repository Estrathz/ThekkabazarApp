import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import styles from './resultStyle'; // Import styles from resultStyle.js
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import { fetchDropdownData } from '../../reducers/dropdownSlice';
import { fetchresultData, fetchOneResultData } from '../../reducers/resultSlice';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import { useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import debounce from 'lodash/debounce';

// Constants
const INITIAL_FILTERS = {
  organization: null,
  category: null,
  location: null,
  projectType: null,
  procurementsType: null,
  search: '',
};

const Result = ({ navigation }) => {
  // State management
  const [isModalVisible, setModalVisible] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState('');
  const [isImageVisible, setIsImageVisible] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();
  const { data, error: apiError, loading } = useSelector(state => state.result);
  const { dropdowndata } = useSelector(state => state.dropdown);

  // Memoized data
  const organizationData = useMemo(() => dropdowndata?.organization_sectors || [], [dropdowndata]);
  const categoryData = useMemo(() => dropdowndata?.categories || [], [dropdowndata]);
  const locationData = useMemo(() => dropdowndata?.districts || [], [dropdowndata]);
  const projectTypeData = useMemo(() => dropdowndata?.project_types || [], [dropdowndata]);
  const procurementData = useMemo(() => dropdowndata?.procurement_types || [], [dropdowndata]);

  // Data validation
  const validateData = useCallback((data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.filter(item => item && typeof item === 'object');
  }, []);

  // Initial data loading
  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('access_token');
          setToken(storedToken);
          
          await Promise.all([
            dispatch(fetchDropdownData()),
            dispatch(fetchresultData({ page: 1 }))
          ]);
        } catch (error) {
          setError('Failed to load initial data');
        }
      };

      loadInitialData();
    }, [dispatch])
  );

  // Data fetching
  const fetchData = useCallback(async (pageNum = 1, shouldClearData = false) => {
    try {
      setIsLoadingMore(true);
      setError(null);
      setHasError(false);
      
      if (shouldClearData) {
        setAllData([]);
      }
      
      const params = {
        page: pageNum,
        organization_sector: filters.organization?.name,
        district: filters.location?.name,
        project_type: filters.projectType?.name,
        procurement_type: filters.procurementsType?.name,
        category: filters.category?.name,
        search: filters.search,
      };

      // Remove null/undefined/empty values
      Object.keys(params).forEach(key => {
        if (params[key] == null || params[key] === '') {
          delete params[key];
        }
      });
      
      const result = await dispatch(fetchresultData(params));
      
      if (!result.payload) {
        throw new Error('No data received from API');
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.payload?.data) {
        const validatedData = validateData(result.payload.data);
        setAllData(prevData => {
          if (validatedData.length === 0) {
            setError('No results found for the selected filters');
            return prevData;
          }
          setError(null);
          return pageNum === 1 
            ? validatedData 
            : [...prevData, ...validatedData.filter(newItem => 
                !prevData.some(prevItem => prevItem.pk === newItem.pk)
              )];
        });
      } else {
        setAllData([]);
        setError('No results found for the selected filters');
      }
    } catch (err) {
      console.error('Fetch Data Error:', err);
      setError(err.message || 'Failed to fetch data');
      setHasError(true);
      setAllData([]);
    } finally {
      setIsLoadingMore(false);
    }
  }, [dispatch, filters, validateData]);

  // Event handlers
  const handleEndReached = useCallback(() => {
    if (isLoadingMore || !data || page >= data.total_pages) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    
    fetchData(nextPage).finally(() => {
      setIsLoadingMore(false);
    });
  }, [page, data?.total_pages, fetchData, isLoadingMore]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      setPage(1);
      await fetchData(1, true);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const handleSearchChange = useCallback((text) => {
    setFilters(prev => ({ ...prev, search: text }));
    setPage(1);
    setIsFiltering(true);
    fetchData(1, true).finally(() => {
      setIsFiltering(false);
    });
  }, [fetchData]);

  const handleFilter = useCallback(async () => {
    if (isFiltering) return; // Prevent multiple simultaneous filter operations
    
    try {
      setIsFiltering(true);
      setPage(1);
      setError(null);
      setHasError(false);
      
      // Clear data immediately
      setAllData([]);
      
      // Build filter params
      const params = {
        page: 1,
        organization_sector: filters.organization?.name,
        district: filters.location?.name,
        project_type: filters.projectType?.name,
        procurement_type: filters.procurementsType?.name,
        category: filters.category?.name,
        search: filters.search,
      };

      // Remove null/undefined/empty values
      Object.keys(params).forEach(key => {
        if (params[key] == null || params[key] === '') {
          delete params[key];
        }
      });
      
      // Fetch filtered data
      const result = await dispatch(fetchresultData(params));
      
      if (result.payload?.data) {
        const validatedData = validateData(result.payload.data);
        setAllData(validatedData);
        if (validatedData.length === 0) {
          setError('No results found for the selected filters');
        }
      }
      
      setModalVisible(false);
    } catch (err) {
      setError('Failed to apply filters');
      setHasError(true);
      setAllData([]);
    } finally {
      setIsFiltering(false);
    }
  }, [dispatch, filters, validateData, isFiltering]);

  const clearFilters = useCallback(async () => {
    if (isFiltering) return; // Prevent multiple simultaneous clear operations
    
    try {
      setIsFiltering(true);
      setFilters(INITIAL_FILTERS);
      setPage(1);
      setError(null);
      setHasError(false);
      
      // Clear the data immediately
      setAllData([]);
      
      // Fetch initial data without any filters
      const result = await dispatch(fetchresultData({ page: 1 }));
      
      if (result.payload?.data) {
        const validatedData = validateData(result.payload.data);
        setAllData(validatedData);
      }
      
      setModalVisible(false);
    } catch (err) {
      setError('Failed to clear filters');
      setHasError(true);
    } finally {
      setIsFiltering(false);
    }
  }, [dispatch, validateData, isFiltering]);

  const handleDetailNavigation = useCallback(async (pk) => {
    if (!pk) {
      Alert.alert('Error', 'Invalid tender ID');
      return;
    }

    try {
      // Find the tender in existing data
      const tenderData = allData.find(item => item.pk === pk);
      
      if (tenderData) {
        // If we have the data, navigate directly
        navigation.navigate('ResultDetails', { 
          id: pk,
          tenderData // Pass the existing data
        });
        return;
      }

      // Only fetch from API if we don't have the data
      const result = await dispatch(fetchOneResultData({ tenderId: pk })).unwrap();
      
      if (!result) {
        Alert.alert('Error', 'No data received from the server');
        return;
      }

      navigation.navigate('ResultDetails', { 
        id: pk,
        tenderData: result // Pass the fetched data
      });
    } catch (error) {
      console.error('Error fetching tender details:', error);
      Alert.alert(
        'Error',
        error.status === 404 
          ? 'This tender result could not be found.'
          : error.message || 'Failed to load tender details'
      );
    }
  }, [dispatch, navigation, allData]);

  // Render functions
  const renderItem = useCallback(({ item }) => {
    if (!item) return null;
    
    return (
      <View key={item.pk} style={styles.Card}>
        <TouchableOpacity 
          onPress={() => {
            if (token) {
              setSelectedImage(item.image);
              setIsImageVisible(item.pk);
            } else {
              navigation.navigate('Login');
            }
          }}
          accessibilityLabel="View tender image"
        >
          <View style={styles.imageContainer}>
            <FastImage
              source={require('../../assets/dummy-image.png')}
              style={styles.thumbnail}
              resizeMode={FastImage.resizeMode.contain}
              placeholder={<ActivityIndicator size="small" color="#0375B7" />}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text
            numberOfLines={2}
            style={styles.cardTitle}
            onPress={() => handleDetailNavigation(item.pk)}
            accessibilityLabel={`Tender title: ${item.title || 'Untitled'}`}
          >
            {item.title || 'Untitled'}
          </Text>
          <Text 
            numberOfLines={2} 
            style={styles.cardText}
            accessibilityLabel={`Public entry name: ${item.public_entry_name || 'N/A'}`}
          >
            {item.public_entry_name || 'N/A'}
          </Text>
          <View style={styles.cardRow}>
            <Icon name="bag-handle" size={18} color="#000" />
            <Text style={styles.cardLabel}>Service:</Text>
            {Array.isArray(item.project_type) && item.project_type.map((project, index) => (
              <Text 
                key={index} 
                numberOfLines={2} 
                style={styles.cardText}
                accessibilityLabel={`Project type ${index + 1}: ${project?.name || 'N/A'}`}
              >
                {project?.name || 'N/A'}
              </Text>
            ))}
          </View>
          <View style={styles.cardRow}>
            <Icon2 name="update" size={18} color="#000" />
            <Text style={styles.cardLabel}>Published:</Text>
            <Text style={styles.cardText}>{item.published_date || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Icon name="newspaper" size={18} color="#000" />
            <Text style={styles.cardLabel}>Source:</Text>
            <Text style={styles.cardText}>{item.source || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Icon name="location" size={18} color="#000" />
            <Text style={styles.cardLabel}>Location:</Text>
            {Array.isArray(item.district) && item.district.map((loc, index) => (
              <Text 
                key={index} 
                numberOfLines={2} 
                style={styles.cardText}
                accessibilityLabel={`Location ${index + 1}: ${loc?.name || 'N/A'}`}
              >
                {loc?.name || 'N/A'}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }, [token, navigation, handleDetailNavigation]);

  // FlatList props
  const flatListProps = useMemo(() => ({
    data: allData,
    renderItem,
    keyExtractor: item => item.pk.toString(),
    onEndReached: handleEndReached,
    onEndReachedThreshold: 0.5,
    refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
    removeClippedSubviews: true,
    maxToRenderPerBatch: 5,
    windowSize: 3,
    initialNumToRender: 10,
    updateCellsBatchingPeriod: 50,
    getItemLayout: (data, index) => ({
      length: 200,
      offset: 200 * index,
      index,
    }),
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
      autoscrollToTopThreshold: 10,
    },
  }), [allData, refreshing, onRefresh, handleEndReached, renderItem]);

  // Dropdown components
  const dropdownComponents = useMemo(() => [
    { 
      data: organizationData, 
      placeholder: 'Select Organization', 
      setState: (value) => setFilters(prev => ({ ...prev, organization: value })),
      value: filters.organization,
      key: 'organization'
    },
    { 
      data: categoryData, 
      placeholder: 'Select Category', 
      setState: (value) => setFilters(prev => ({ ...prev, category: value })),
      value: filters.category,
      key: 'category'
    },
    { 
      data: locationData, 
      placeholder: 'Select Location', 
      setState: (value) => setFilters(prev => ({ ...prev, location: value })),
      value: filters.location,
      key: 'location'
    },
    { 
      data: projectTypeData, 
      placeholder: 'Select Project Types', 
      setState: (value) => setFilters(prev => ({ ...prev, projectType: value })),
      value: filters.projectType,
      key: 'projectType'
    },
    { 
      data: procurementData, 
      placeholder: 'Select Procurements Types', 
      setState: (value) => setFilters(prev => ({ ...prev, procurementsType: value })),
      value: filters.procurementsType,
      key: 'procurementsType'
    },
  ], [organizationData, categoryData, locationData, projectTypeData, procurementData, filters]);

  // Render component
  return (
    <View style={styles.ResultContainer}>
      {/* Header */}
      <View style={styles.navcontainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          accessibilityLabel="App logo"
        />
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Open filters"
        >
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
            <Text style={styles.input}>Search</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Error state */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={() => fetchData(1, true)}
            style={styles.retryButton}
            accessibilityLabel="Retry loading data"
          >
            <Icon name="refresh" size={20} color="#fff" style={styles.retryIcon} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading state */}
      {loading && !allData.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0375B7" />
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      ) : (
        <FlatList
          {...flatListProps}
          ListEmptyComponent={!refreshing && allData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyContent}>
                <View style={styles.emptyIconWrapper}>
                  <View style={styles.emptyIconContainer}>
                    <Icon name="search-outline" size={70} color="#0375B7" />
                  </View>
                </View>
                <View style={styles.emptyTextWrapper}>
                  <Text style={styles.emptyTitle}>No Results Found</Text>
                  <Text style={styles.emptyDescription}>
                    {error || "We couldn't find any results matching your search criteria."}
                  </Text>
                  <TouchableOpacity 
                    onPress={clearFilters}
                    style={styles.retryButton}
                    accessibilityLabel="Clear filters and try again"
                  >
                    <Icon name="refresh" size={20} color="#fff" style={styles.retryIcon} />
                    <Text style={styles.retryButtonText}>Clear Filters & Try Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
          ListFooterComponent={isLoadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#0375B7" />
            </View>
          ) : null}
        />
      )}

      {/* Filter Modal */}
      <Modal 
        visible={isModalVisible} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        accessibilityLabel="Filter modal"
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.closeButton}
              accessibilityLabel="Close filter modal"
            >
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Filter Categories</Text>
            <Text style={styles.filterDescription}>Choose a filter category from the provided list.</Text>
            <View style={{ padding: 5 }}>
              {dropdownComponents.map(({ data, placeholder, setState, value, key }) => (
                <SelectDropdown
                  key={key}
                  data={data || []}
                  onSelect={setState}
                  defaultButtonText={placeholder}
                  buttonStyle={styles.dropdown1BtnStyle}
                  buttonTextStyle={styles.dropdown1BtnTxtStyle}
                  renderDropdownIcon={isOpened => (
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#424242'} size={20} />
                  )}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown1DropdownStyle}
                  rowStyle={styles.dropdown1RowStyle}
                  rowTextStyle={styles.dropdown1RowTxtStyle}
                  selectedRowStyle={styles.dropdown1SelectedRowStyle}
                  search
                  searchInputStyle={styles.dropdown1searchInputStyleStyle}
                  searchPlaceHolder={'Search here'}
                  searchPlaceHolderColor={'#424242'}
                  renderSearchInputLeftIcon={() => <Icon name="search" color={'#424242'} size={20} />}
                  renderCustomizedRowChild={(item) => (
                    <Text style={styles.dropdown1RowTxtStyle}>{item.name}</Text>
                  )}
                  buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                  rowTextForSelection={(item) => item.name}
                  showsVerticalScrollIndicator={false}
                  dropdownOverlayColor={'rgba(0,0,0,0.1)'}
                  searchTextInputProps={{
                    placeholderTextColor: '#424242',
                    style: {
                      color: '#424242',
                      fontSize: 16,
                    }
                  }}
                  defaultValue={value}
                  value={value}
                />
              ))}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  onPress={clearFilters} 
                  style={styles.clearFilterButton}
                  accessibilityLabel="Clear all filters"
                >
                  <Text style={styles.clearFilterText}>Clear Filters</Text>
                </TouchableOpacity>
                <Custombutton 
                  title="Apply Filter" 
                  onPress={handleFilter}
                  disabled={isFiltering}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/* Image Modal */}
      <Modal
        visible={isImageVisible !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsImageVisible(null);
          setSelectedImage(null);
        }}
        accessibilityLabel="Image viewer modal"
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <TouchableOpacity 
            onPress={() => {
              setIsImageVisible(null);
              setSelectedImage(null);
            }} 
            style={styles.closeButton}
            accessibilityLabel="Close image viewer"
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <FastImage
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: '100%' }}
                resizeMode={FastImage.resizeMode.contain}
                placeholder={<ActivityIndicator size="large" color="#0375B7" />}
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(Result);