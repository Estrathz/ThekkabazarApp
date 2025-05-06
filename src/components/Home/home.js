import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import debounce from 'lodash/debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Icons
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import Slider from '../../Containers/Slider/slider';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import DatePicker from 'react-native-date-picker';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

// Redux Actions
import { fetchDropdownData } from '../../reducers/dropdownSlice';
import { fetchTenderListData, savebid } from '../../reducers/cardSlice';

// Styles
import styles from './homeStyles';

// Constants
const INITIAL_FILTERS = {
  organization_sector: '',
  category: '',
  district: '',
  project_type: '',
  procurement_type: '',
  source: '',
  search: '',
};

const PARAM_MAPPING = {
  organizationData: 'organization_sector',
  categoryData: 'category',
  locationData: 'district',
  projectTypeData: 'project_type',
  procurementData: 'procurement_type',
  sourceData: 'source',
};

// Add AdSpace component
const AdSpace = () => {
  return (
    <View style={styles.adContainer}>
      <ImageBackground
        source={require('../../assets/dummy-ads.jpg')}
        style={styles.adImage}
        resizeMode="cover"
      >
        
      </ImageBackground>
    </View>
  );
};

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.card);
  const { dropdowndata, dropdownerror } = useSelector(state => state.dropdown);
  const { width } = useWindowDimensions();

  // State management
  const [isModalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [date, setDate] = useState(new Date());
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [datepicker, setDatepicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Dummy image path
  const dummyImage = require('../../assets/dummy-image.png');

  // Initial data loading
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('access_token');
        if (isMounted) {
          setToken(storedToken);
        }
        await Promise.all([
          dispatch(fetchTenderListData({ page: 1 })),
          dispatch(fetchDropdownData())
        ]);
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Data updates handling
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prevData => {
          const newData = data.data.filter(newItem => 
            !prevData.some(prevItem => prevItem.pk === newItem.pk)
          );
          return [...prevData, ...newData];
        });
      }
    }
  }, [data, error, dropdownerror, page]);

  // API parameters builder
  const buildApiParams = useCallback((pageNum = 1) => {
    const apiParams = { 
      page: pageNum,
      page_size: 50  // Set page size to 50
    };

    // Add filters only if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        apiParams[key] = value.trim();
      }
    });
    
    if (useCustomDate && moment(date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
      apiParams.published_date = moment(date).format('YYYY-MM-DD');
    }

    return apiParams;
  }, [filters, date, useCustomDate]);

  // Memoized values
  const apiParams = useMemo(() => buildApiParams(page), [filters, date, useCustomDate, page]);
  
  // Optimized data fetching with better caching and error handling
  const fetchData = useCallback(async (pageNum = 1, shouldClearData = false) => {
    if (isSearching) return;
    
    try {
      setIsSearching(true);
      setRefreshing(true);
      
      // Clear data immediately for better UX
      if (shouldClearData) {
        setAllData([]);
      }
      
      // Build params once
      const params = buildApiParams(pageNum);
      
      // Dispatch action and get result
      const result = await dispatch(fetchTenderListData(params));
      
      // Update data immediately if available
      if (result.payload?.data) {
        setAllData(prevData => {
          if (pageNum === 1) return result.payload.data;
          
          // Create a Set of existing IDs for faster lookup
          const existingIds = new Set(prevData.map(item => item.pk));
          
          // Filter out duplicates and add new items
          const newItems = result.payload.data.filter(item => !existingIds.has(item.pk));
          return [...prevData, ...newItems];
        });
      }
    } catch (err) {
      // Error handling without console.log
    } finally {
      setRefreshing(false);
      setIsSearching(false);
    }
  }, [buildApiParams, dispatch, isSearching]);

  // Optimized search handler with better debounce
  const debouncedSearch = useMemo(
    () => debounce(async (text) => {
      if (isSearching) return;
      
      try {
        setIsSearching(true);
        setRefreshing(true);
        setPage(1);
        setAllData([]); // Clear data immediately
        
        const params = buildApiParams(1);
        const result = await dispatch(fetchTenderListData(params));
        
        if (result.payload?.data) {
          setAllData(result.payload.data);
        }
      } catch (err) {
        // Error handling without console.log
      } finally {
        setRefreshing(false);
        setIsSearching(false);
      }
    }, 300), // Reduced debounce time for faster response
    [buildApiParams, dispatch, isSearching]
  );

  // Search text change handler
  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
    setFilters(prev => ({ ...prev, search: text }));
    debouncedSearch(text);
  }, [debouncedSearch]);

  // Optimized filter handler
  const handleFilter = useCallback(async () => {
    if (isSearching) return;
    
    try {
      setIsSearching(true);
      setRefreshing(true);
      closeModal();
      setPage(1);
      setAllData([]); // Clear data immediately

      const params = buildApiParams(1);
      const result = await dispatch(fetchTenderListData(params));
      
      if (result.payload?.data) {
        setAllData(result.payload.data);
      }
    } catch (err) {
      // Error handling without console.log
    } finally {
      setRefreshing(false);
      setIsSearching(false);
    }
  }, [buildApiParams, dispatch, isSearching]);

  // Optimized clear filters handler
  const clearFilters = useCallback(async () => {
    if (isSearching) return;
    
    try {
      setIsSearching(true);
      setRefreshing(true);
      
      // Reset all filters to initial state
      setFilters(INITIAL_FILTERS);
      setSearchText('');
      setDate(new Date());
      setUseCustomDate(false);
      setPage(1);
      
      // Clear the data immediately
      setAllData([]);
      
      // Fetch initial data without any filters
      const result = await dispatch(fetchTenderListData({ page: 1 }));
      
      if (result.payload?.data) {
        setAllData(result.payload.data);
      }
      
      // Close the modal
      setModalVisible(false);
    } catch (err) {
      // Error handling without console.log
    } finally {
      setRefreshing(false);
      setIsSearching(false);
    }
  }, [dispatch, isSearching]);

  // Optimized end reached handler
  const handleEndReached = useCallback(() => {
    if (isSearching || isLoadingMore) return;
    
    // Check if we have more pages to load
    if (data?.total_pages && page < data.total_pages) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      
      fetchData(nextPage).finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [page, data?.total_pages, fetchData, isSearching, isLoadingMore]);

  // Optimized refresh handler
  const onRefresh = useCallback(async () => {
    if (isSearching) return;
    
    try {
      setIsSearching(true);
      setRefreshing(true);
      setPage(1);
      setAllData([]);
      
      const params = buildApiParams(1);
      const result = await dispatch(fetchTenderListData(params));
      
      if (result.payload?.data) {
        setAllData(result.payload.data);
      }
    } catch (err) {
      // Error handling without console.log
    } finally {
      setRefreshing(false);
      setIsSearching(false);
    }
  }, [buildApiParams, dispatch, isSearching]);

  // Modal handlers
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openImageModal = (imageUrl) => setSelectedImage(imageUrl);
  const closeImageModal = () => setSelectedImage(null);

  // Navigation handlers
  const handleSaveBids = useCallback(pk => {
    token ? dispatch(savebid({ id: pk, access_token: token })) : navigation.navigate('Login');
  }, [token, dispatch, navigation]);

  const handleDetailNavigation = useCallback(pk => {
    token ? navigation.navigate('HomeDetails', { id: pk }) : navigation.navigate('Login');
  }, [token, navigation]);

  // Date handlers
  const handleDateConfirm = useCallback((selectedDate) => {
    setDatepicker(false);
    setDate(selectedDate);
    setUseCustomDate(true);
  }, []);

  // Dropdown data processing
  const dropdownData = useMemo(() => {
    if (!dropdowndata) {
      return {
        organizationData: [],
        categoryData: [],
        locationData: [],
        projectTypeData: [],
        procurementData: [],
        sourceData: [],
      };
    }

    const processDropdownArray = (array) => 
      Array.isArray(array) ? array.map(item => ({
        label: item.name,
        value: item.name
      })) : [];

    return {
      organizationData: processDropdownArray(dropdowndata.organization_sectors),
      categoryData: processDropdownArray(dropdowndata.categories),
      locationData: processDropdownArray(dropdowndata.districts),
      projectTypeData: processDropdownArray(dropdowndata.project_types),
      procurementData: processDropdownArray(dropdowndata.procurement_types),
      sourceData: processDropdownArray(dropdowndata.sources),
    };
  }, [dropdowndata]);

  // Dropdown rendering
  const renderDropdown = useCallback((data, placeholder, onSelect, value) => {
    const selectedItem = data.find(item => item.value === value);
    
    return (
      <SelectDropdown
        data={data}
        onSelect={onSelect}
        defaultButtonText={selectedItem ? selectedItem.label : placeholder}
        defaultValue={value}
        buttonStyle={styles.dropdown1BtnStyle}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        renderDropdownIcon={isOpened => (
          <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />
        )}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdown1DropdownStyle}
        rowStyle={styles.dropdown1RowStyle}
        rowTextStyle={styles.dropdown1RowTxtStyle}
        selectedRowStyle={styles.dropdown1SelectedRowStyle}
        search
        searchInputStyle={styles.dropdown1searchInputStyleStyle}
        searchPlaceHolder={'Search here'}
        searchPlaceHolderColor={'darkgrey'}
        renderSearchInputLeftIcon={() => <Icon name="search" color={'#444'} size={18} />}
        renderCustomizedRowChild={(item) => (
          <Text>{item.label}</Text>
        )}
        buttonTextAfterSelection={(selectedItem) => selectedItem.label}
        rowTextForSelection={(item) => item.label}
      />
    );
  }, []);

  // Modal content rendering
  const renderModalContent = useCallback(() => (
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={closeModal} style={{ alignSelf: 'flex-end', margin: 10 }}>
        <Icon name="close" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.modalText}>Filter Categories</Text>
      <Text style={{ color: 'black', fontSize: 16, marginBottom: 10 }}>
        Choose a filter category from the provided list.
      </Text>
      <View style={{ padding: 5 }}>
        {renderDropdown(
          dropdownData.organizationData,
          "Select Organization",
          (selectedItem) => setFilters(prev => ({ ...prev, organization_sector: selectedItem.value })),
          filters.organization_sector
        )}

        {renderDropdown(
          dropdownData.categoryData,
          "Select Category",
          (selectedItem) => setFilters(prev => ({ ...prev, category: selectedItem.value })),
          filters.category
        )}

        {renderDropdown(
          dropdownData.locationData,
          "Select Location",
          (selectedItem) => setFilters(prev => ({ ...prev, district: selectedItem.value })),
          filters.district
        )}

        {renderDropdown(
          dropdownData.projectTypeData,
          "Select Project Type",
          (selectedItem) => setFilters(prev => ({ ...prev, project_type: selectedItem.value })),
          filters.project_type
        )}

        {renderDropdown(
          dropdownData.procurementData,
          "Select Procurement Type",
          (selectedItem) => setFilters(prev => ({ ...prev, procurement_type: selectedItem.value })),
          filters.procurement_type
        )}

        {renderDropdown(
          dropdownData.sourceData,
          "Select Source",
          (selectedItem) => setFilters(prev => ({ ...prev, source: selectedItem.value })),
          filters.source
        )}

        <TextInput
          placeholder="Enter Keywords"
          placeholderTextColor={'#424242'}
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearchChange}
          editable={!isSearching}
        />

        <View style={styles.dateContainer}>
          <Text style={styles.datepicker} onPress={() => setDatepicker(true)}>
            {useCustomDate ? moment(date).format('YYYY-MM-DD') : 'Select Date'}
          </Text>
          <DatePicker
            modal
            mode="date"
            open={datepicker}
            date={date}
            onConfirm={handleDateConfirm}
            onCancel={() => setDatepicker(false)}
          />
          {useCustomDate && (
            <TouchableOpacity 
              onPress={() => setUseCustomDate(false)}
              style={styles.clearDateButton}
            >
              <Icon name="close-circle" size={20} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={clearFilters} 
            style={styles.clearFilterButton}
            disabled={isSearching}
          >
            <Icon name="refresh" size={20} style={styles.clearFilterIcon} />
            <Text style={styles.clearFilterText}>Clear Filters</Text>
          </TouchableOpacity>
          <Custombutton 
            title="Apply Filter" 
            onPress={handleFilter}
            disabled={isSearching}
          />
        </View>
      </View>
    </View>
  ), [dropdownData, filters, date, useCustomDate, handleDateConfirm, clearFilters, handleFilter, renderDropdown, isSearching]);

  // Image modal rendering
  const renderImageModal = useCallback(() => (
    <Modal
      visible={selectedImage !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={closeImageModal}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        <ImageZoomViewer
          imageUrls={[{ url: selectedImage }]}
          enableSwipeDown={true}
          onSwipeDown={closeImageModal}
          renderIndicator={() => null}
          backgroundColor="black"
        />
      </View>
    </Modal>
  ), [selectedImage, closeImageModal]);

  // Modify the renderItem function to include ads
  const renderItem = useCallback(({ item, index }) => {
    // Show ad after every 12 items
    if (index > 0 && index % 12 === 0) {
      return (
        <>
          <AdSpace />
          <View style={styles.Card}>
            <TouchableOpacity onPress={() => openImageModal(item.image)}>
              <Image source={dummyImage} style={styles.image} />
            </TouchableOpacity>
            <View style={{ padding: 8, flex: 1 }}>
              <Text
                numberOfLines={2}
                style={{ color: '#0375B7', fontSize: 16, fontWeight: 'bold', marginTop: 8 }}
                onPress={() => handleDetailNavigation(item.pk)}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={{ color: 'black', fontSize: 15 }}>
                {item.public_entry_name}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon2 name="bag-handle" size={18} color="black" />
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Service:</Text>
                </View>
                {item.project_type?.map((project, index) => (
                  <Text key={index} numberOfLines={2} style={{ color: '#000', flex: 1 }}>
                    {project.name}
                  </Text>
                ))}
              </View>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon3 name="update" size={18} color="black" />
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Published:</Text>
                </View>
                <Text style={styles.CardText}>{item.published_date}</Text>
                <Text style={{ color: '#FF0000', marginRight: 10, fontSize: 12 }}>
                  {item.days_left}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon2 name="newspaper" size={18} color="black" />
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Source:</Text>
                </View>
                <Text style={styles.CardText}>{item.source}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon2 name="location" size={18} color="black" />
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Location:</Text>
                </View>
                {item.district?.map((loc, index) => (
                  <Text key={index} numberOfLines={2} style={{ color: '#000', flex: 1, marginLeft: 5 }}>
                    {loc.name}
                  </Text>
                ))}
              </View>
              <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleSaveBids(item.pk)} style={styles.cusBottom}>
                  <Icon2 name="save-outline" size={20} color="#000" />
                  <Text style={{ color: '#000', fontSize: 15 }}>Save Bids</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      );
    }

    return (
      <View style={styles.Card}>
        <TouchableOpacity onPress={() => openImageModal(item.image)}>
          <Image source={dummyImage} style={styles.image} />
        </TouchableOpacity>
        <View style={{ padding: 8, flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{ color: '#0375B7', fontSize: 16, fontWeight: 'bold', marginTop: 8 }}
            onPress={() => handleDetailNavigation(item.pk)}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={{ color: 'black', fontSize: 15 }}>
            {item.public_entry_name}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon2 name="bag-handle" size={18} color="black" />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Service:</Text>
            </View>
            {item.project_type?.map((project, index) => (
              <Text key={index} numberOfLines={2} style={{ color: '#000', flex: 1 }}>
                {project.name}
              </Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon3 name="update" size={18} color="black" />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Published:</Text>
            </View>
            <Text style={styles.CardText}>{item.published_date}</Text>
            <Text style={{ color: '#FF0000', marginRight: 10, fontSize: 12 }}>
              {item.days_left}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon2 name="newspaper" size={18} color="black" />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Source:</Text>
            </View>
            <Text style={styles.CardText}>{item.source}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon2 name="location" size={18} color="black" />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Location:</Text>
            </View>
            {item.district?.map((loc, index) => (
              <Text key={index} numberOfLines={2} style={{ color: '#000', flex: 1, marginLeft: 5 }}>
                {loc.name}
              </Text>
            ))}
          </View>
          <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => handleSaveBids(item.pk)} style={styles.cusBottom}>
              <Icon2 name="save-outline" size={20} color="#000" />
              <Text style={{ color: '#000', fontSize: 15 }}>Save Bids</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [handleDetailNavigation, handleSaveBids, openImageModal]);

  // Optimized FlatList props for better performance
  const flatListProps = useMemo(() => ({
    data: allData,
    renderItem,
    keyExtractor: item => item.pk.toString(),
    onEndReached: handleEndReached,
    onEndReachedThreshold: 0.5,
    refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
    removeClippedSubviews: true,
    maxToRenderPerBatch: 50,  // Increased to match page size
    windowSize: 5,
    initialNumToRender: 50,   // Increased to match page size
    updateCellsBatchingPeriod: 100,
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
      autoscrollToTopThreshold: 10,
    },
    ListEmptyComponent: !refreshing && allData.length === 0 ? (
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
              We couldn't find any results matching your search criteria.
            </Text>
          </View>
        </View>
      </View>
    ) : null,
    ListFooterComponent: isLoadingMore ? (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#0375B7" />
      </View>
    ) : null,
  }), [allData, refreshing, onRefresh, handleEndReached, isLoadingMore]);

  // Optimized ListHeaderComponent
  const ListHeaderComponent = useMemo(() => (
    <>
      <View style={styles.navcontainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity 
          onPress={openModal} 
          style={[styles.searchSection, { justifyContent: 'center' }]}
        >
          <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
          <Text style={styles.searchButtonText}>Search & Filter</Text>
        </TouchableOpacity>
      </View>
      <Slider />
    </>
  ), [openModal]);

  // Add a useEffect to monitor dropdown data changes
  useEffect(() => {
    if (dropdownerror) {
      // Error handling without console.log
    }
  }, [dropdowndata, dropdownerror]);

  return (
    <View style={styles.HomeContainer}>
      <View style={{ flex: 1 }}>
        <FlatList
          {...flatListProps}
          ListHeaderComponent={ListHeaderComponent}
        />
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>

      {renderImageModal()}
    </View>
  );
};

// Single export default
export default React.memo(Home);