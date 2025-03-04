import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import styles from './resultStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import { fetchDropdownData } from '../../reducers/dropdownSlice';
import { fetchresultData } from '../../reducers/resultSlice';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import { useWindowDimensions } from 'react-native';

const Result = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [allData, setAllData] = useState([]);
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState('');
  const [procurementsType, setProcurementsType] = useState('');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [datepicker, setDatepicker] = useState(false);
  const [token, setToken] = useState('');
  const [isImageVisible, setIsImageVisible] = useState(null);
  const [page, setPage] = useState(1); // Added page state
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.result);
  const { dropdowndata, dropdownerror } = useSelector(state => state.dropdown);

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, [])
  );

  useEffect(() => {
    dispatch(fetchDropdownData());
    dispatch(fetchresultData({ page })); // Fetch results with the current page
    if (error) console.log(error);
    if (dropdownerror) console.log(dropdownerror);
  }, [dispatch, error, dropdownerror, page]); // Added page to dependencies

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setToken(token);
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (data?.data) {
      setAllData(prevData => {
        if (data.data.length > 0) {
          return page === 1 ? data.data : [...prevData, ...data.data.filter(newItem => !prevData.some(prevItem => prevItem.pk === newItem.pk))];
        }
        return prevData;
      });
    }
  }, [data]);

  const handleFilter = () => {
    closeModal();
    setPage(1); // Reset to the first page when applying filters
    dispatch(fetchresultData({ organization_sector: organization, location, project_type: projectType, procurement_type: procurementsType, category, search }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchresultData({ page: 1 }));
    setRefreshing(false);
  };

  const handleEndReached = () => {
    const nextPage = page + 1;
    if (nextPage <= data.total_pages) {
      setPage(nextPage); // Update the page state
    }
  };

  const handleDetailNavigation = pk => {
    if (token) {
      navigation.navigate('ResultDetails', { id: pk });
    } else {
      navigation.navigate('MainScreen', {
        screen: 'BottomNav',
        params: { screen: 'Home', params: { screen: 'Login' } },
      });
    }
  };

  const openImageModal = index => {
    if (token) {
      setIsImageVisible(index);
    } else {
      navigation.navigate('Login');
    }
  };

  const closeImageModal = () => setIsImageVisible(null);

  const organizationData = dropdowndata?.organization_sectors?.map(item => item.name);
  const categoryData = dropdowndata?.categories?.map(item => item.name);
  const LocationData = dropdowndata?.districts?.map(item => item.name);
  const projectTypeData = dropdowndata?.project_types?.map(item => item.name);
  const procurementData = dropdowndata?.procurement_types?.map(item => item.name);

  return (
    <View style={styles.ResultContainer}>
      <FlatList
        data={allData}
        ListHeaderComponent={
          <View style={styles.SearchContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
              <Text style={styles.input} placeholderTextColor={'#424242'}>Search</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => (
          <View key={index} style={styles.Card}>
            <TouchableOpacity onPress={() => openImageModal(index)}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </TouchableOpacity>
            <View style={{ padding: 8, flex: 1 }}>
              <Text
                numberOfLines={2}
                style={styles.cardTitle}
                onPress={() => handleDetailNavigation(item.pk)}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.cardText}>{item.public_entry_name}</Text>
              <View style={styles.row}>
                <Icon name="bag-handle" size={18} color="black" />
                <Text style={styles.label}>Service:</Text>
                {item.project_type?.map((project, index) => (
                  <Text key={index} numberOfLines={2} style={styles.cardText}>{project.name}</Text>
                ))}
              </View>
              <View style={styles.row}>
                <Icon2 name="update" size={18} color="black" />
                <Text style={styles.label}>Published:</Text>
                <Text style={styles.cardText}>{item.published_date}</Text>
                <Text style={styles.daysLeft}>{item.days_left}</Text>
              </View>
              <View style={styles.row}>
                <Icon name="newspaper" size={18} color="black" />
                <Text style={styles.label}>Source:</Text>
                <Text style={styles.cardText}>{item.source}</Text>
              </View>
              <View style={styles.row}>
                <Icon name="location" size={18} color="black" />
                <Text style={styles.label}>Location:</Text>
                {item.district?.map((loc, index) => (
                  <Text key={index} numberOfLines={2} style={styles.cardText}>{loc.name}</Text>
                ))}
              </View>
            </View>
            <Modal
              visible={isImageVisible !== null}
              animationType="slide"
              transparent={true}
              onRequestClose={closeImageModal}>
              <View style={styles.modalContainer}>
                <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                  <Icon name="close" size={30} color="white" />
                </TouchableOpacity>
                <ImageZoomViewer
                  imageUrls={allData.map(item => ({ url: item.image }))}
                  index={isImageVisible}
                  enableSwipeDown={true}
                  onSwipeDown={closeImageModal}
                  renderIndicator={() => null}
                  backgroundColor="black"
                />
              </View>
            </Modal>
          </View>
        )}
        keyExtractor={item => item.pk}
        onMomentumScrollEnd={handleEndReached}
        onEndReachedThreshold={0.8}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Filter Categories</Text>
            <Text style={styles.filterDescription}>Choose a filter category from the provided list.</Text>
            <View style={{ padding: 5 }}>
              {[
                { data: organizationData, placeholder: 'Select Organization', setState: setOrganization },
                { data: categoryData, placeholder: 'Select Category', setState: setCategory },
                { data: LocationData, placeholder: 'Select Location', setState: setLocation },
                { data: projectTypeData, placeholder: 'Select Project Types', setState: setProjectType },
                { data: procurementData, placeholder: 'Select Procurements Types', setState: setProcurementsType },
              ].map(({ data, placeholder, setState }, index) => (
                <SelectDropdown
                  key={index}
                  data={data}
                  defaultButtonText={placeholder}
                  onSelect={(selectedItem) => setState(selectedItem)}
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
              <Text style={styles.datepicker} onPress={() => setDatepicker(true)}>
                Select Date
                <DatePicker
                  modal
                  mode="date"
                  open={datepicker}
                  date={date}
                  onConfirm={date => {
                    setDatepicker(false);
                    setDate(date);
                  }}
                  onCancel={() => setDatepicker(false)}
                />
              </Text>
              <Custombutton title="Apply Filter" onPress={handleFilter} />
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Result;