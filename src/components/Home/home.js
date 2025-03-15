import {
  View,
  Text,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from './homeStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '../../Containers/Slider/slider';
import { fetchDropdownData } from '../../reducers/dropdownSlice';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import { fetchTenderListData, savebid } from '../../reducers/cardSlice';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import debounce from 'lodash/debounce';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.card);
  const { dropdowndata, dropdownerror } = useSelector(state => state.dropdown);

  const [isModalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState({
    organization_sector: '',
    category: '',
    district: '',
    project_type: '',
    procurement_type: '',
    source: '',
    search: '',
  });
  const [date, setDate] = useState(new Date());
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [datepicker, setDatepicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { width } = useWindowDimensions();
  const [token, setToken] = useState('');

  // Dummy image path
  const dummyImage = require('../../assets/dummy-image.png');

  // Consolidated useEffect for initial data loading and token
  useEffect(() => {
    const fetchInitialData = async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      setToken(storedToken);
      dispatch(fetchTenderListData({ page: 1 }));
      dispatch(fetchDropdownData());
    };

    fetchInitialData();
  }, [dispatch]); // Only run once on mount

  // Single useEffect for data updates
  useEffect(() => {
    if (data?.data) {
      setAllData(prevData => {
        if (page === 1) return data.data; // Reset data on first page
        return [...prevData, ...data.data.filter(newItem => 
          !prevData.some(prevItem => prevItem.pk === newItem.pk)
        )];
      });
    }

    if (error) console.log('API Error:', error);
    if (dropdownerror) console.log('Dropdown Error:', dropdownerror);
  }, [data, error, dropdownerror, page]); // Depend on data, error, and page

  // Build API parameters
  const buildApiParams = useCallback((pageNum = 1) => {
    const apiParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        apiParams[key] = encodeURIComponent(value.trim());
      }
    });
    
    if (useCustomDate && moment(date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
      apiParams.published_date = moment(date).format('YYYY-MM-DD');
    }
    
    apiParams.page = pageNum;
    return apiParams;
  }, [filters, date, useCustomDate]);

  // Optimized refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1); // Reset to first page
    dispatch(fetchTenderListData(buildApiParams(1)))
      .then(() => {
        setRefreshing(false); // Stop refreshing after data is fetched
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setRefreshing(false); // Stop refreshing on error
      });
  }, [filters, date, useCustomDate, dispatch]);

  // Optimized pagination handler
  const handleEndReached = useCallback(() => {
    if (data && page < data.total_pages) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchTenderListData(buildApiParams(nextPage)));
    }
  }, [page, data?.total_pages, filters, dispatch]);

  // Optimized dropdown data processing
  const dropdownData = useMemo(() => ({
    organizationData: dropdowndata?.organization_sectors?.map(item => item.name) || [],
    categoryData: dropdowndata?.categories?.map(item => item.name) || [],
    locationData: dropdowndata?.districts?.map(item => item.name) || [],
    projectTypeData: dropdowndata?.project_types?.map(item => item.name) || [],
    procurementData: dropdowndata?.procurement_types?.map(item => item.name) || [],
    sourceData: dropdowndata?.sources?.map(item => item.name) || [],
  }), [dropdowndata]);

  // Optimized filter handling
  const handleFilter = useCallback(() => {
    closeModal();
    setPage(1);
    setAllData([]); // Clear existing data before applying new filters

    const apiParams = buildApiParams(1);
    dispatch(fetchTenderListData(apiParams))
      .then(() => console.log('Filter applied successfully'))
      .catch(err => console.error('Error applying filter:', err));
  }, [filters, date, useCustomDate, buildApiParams, dispatch]);

  // Optimized filter clearing
  const clearFilters = useCallback(() => {
    const emptyFilters = {
      organization_sector: '',
      category: '',
      district: '',
      project_type: '',
      procurement_type: '',
      source: '',
      search: '',
    };
    
    setFilters(emptyFilters);
    setDate(new Date());
    setUseCustomDate(false);
    setPage(1);
    setAllData([]); // Clear existing data
    
    dispatch(fetchTenderListData({ page: 1 }))
      .then(() => console.log('Filters cleared successfully'))
      .catch(err => console.error('Error clearing filters:', err));
  }, [dispatch]);

  // Optimized search handler with debounce
  const handleSearchChange = useCallback(
    debounce((text) => {
      setFilters(prev => ({ ...prev, search: text }));
    }, 300),
    []
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => setSelectedImage(null);

  const handleSaveBids = pk => {
    token ? dispatch(savebid({ id: pk, access_token: token })) : navigation.navigate('Login');
  };

  const handleDetailNavigation = pk => {
    token ? navigation.navigate('HomeDetails', { id: pk }) : navigation.navigate('Login');
  };

  // Date selection handler
  const handleDateConfirm = (selectedDate) => {
    setDatepicker(false);
    setDate(selectedDate);
    setUseCustomDate(true);
  };

  // Correct parameter mapping
  const paramMapping = {
    organizationData: 'organization_sector',
    categoryData: 'category',
    locationData: 'district',
    projectTypeData: 'project_type',
    procurementData: 'procurement_type',
    sourceData: 'source',
  };

  return (
    <View style={styles.HomeContainer}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={allData}
          ListHeaderComponent={
            <>
              <View style={styles.navcontainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={openModal} style={styles.searchSection}>
                  <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
                  <TextInput
                    style={styles.input}
                    placeholder="Search"
                    placeholderTextColor={'#424242'}
                    value={filters.search}
                    onChangeText={handleSearchChange}
                  />
                </TouchableOpacity>
              </View>
              <Slider />
            </>
          }
          renderItem={({ item, index }) => (
            <View key={index} style={styles.Card}>
              <TouchableOpacity onPress={() => openImageModal(item.image)}>
                <Image 
                  source={dummyImage}
                  style={styles.image} 
                />
              </TouchableOpacity>
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
          )}
          keyExtractor={item => item.pk.toString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={{ alignSelf: 'flex-end', margin: 10 }}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Filter Categories</Text>
            <Text style={{ color: 'black', fontSize: 16, marginBottom: 10 }}>
              Choose a filter category from the provided list.
            </Text>
            <View style={{ padding: 5 }}>
              {Object.entries(dropdownData).map(([key, data]) => (
                <SelectDropdown
                  key={key}
                  data={data || []}
                  onSelect={(selectedItem) => {
                    const apiParam = paramMapping[key];
                    if (apiParam) {
                      setFilters(prev => ({
                        ...prev,
                        [apiParam]: selectedItem,
                      }));
                    }
                  }}
                  defaultButtonText={`Select ${key.replace('Data', '')}`}
                  defaultValue={filters[paramMapping[key]] || ''}
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
                />
              ))}
              <TextInput
                placeholder="Enter Keywords"
                placeholderTextColor={'#424242'}
                style={styles.searchInput}
                value={filters.search}
                onChangeText={text => setFilters(prev => ({ ...prev, search: text }))}
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
                <TouchableOpacity onPress={clearFilters} style={styles.clearFilterButton}>
                  <Text style={styles.clearFilterText}>Clear Filters</Text>
                </TouchableOpacity>
                <Custombutton title="Apply Filter" onPress={handleFilter} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(Home);