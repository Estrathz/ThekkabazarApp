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
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import styles from './resultStyle'; // Import styles from resultStyle.js
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
import FastImage from 'react-native-fast-image';

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
  const [selectedImage, setSelectedImage] = useState(null); // Added selectedImage state
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
    if (error) {
      console.log(error);
      // Optionally, show an error message to the user
    }
    if (dropdownerror) {
      console.log(dropdownerror);
      // Optionally, show an error message to the user
    }
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
  }, [data, page]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleFilter = useCallback(() => {
    closeModal();
    setPage(1); // Reset to the first page when applying filters
    dispatch(fetchresultData({ organization_sector: organization, location, project_type: projectType, procurement_type: procurementsType, category, search }));
  }, [organization, location, projectType, procurementsType, category, search, dispatch, closeModal]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchresultData({ page: 1 }));
    setRefreshing(false);
  }, [dispatch]);

  const handleEndReached = useCallback(() => {
    const nextPage = page + 1;
    if (nextPage <= data.total_pages) {
      setPage(nextPage); // Update the page state
    }
  }, [page, data]);

  const handleDetailNavigation = useCallback(pk => {
    if (token) {
      navigation.navigate('ResultDetails', { id: pk });
    } else {
      navigation.navigate('MainScreen', {
        screen: 'BottomNav',
        params: { screen: 'Home', params: { screen: 'Login' } },
      });
    }
  }, [token, navigation]);

  const openImageModal = useCallback((index, imageUrl) => {
    if (token) {
      setSelectedImage(imageUrl); // Set the selected image URL
      setIsImageVisible(index);
    } else {
      navigation.navigate('Login');
    }
  }, [token, navigation]);

  const closeImageModal = useCallback(() => {
    setIsImageVisible(null);
    setSelectedImage(null); // Reset the selected image URL
  }, []);

  const organizationData = useMemo(() => dropdowndata?.organization_sectors?.map(item => item.name), [dropdowndata]);
  const categoryData = useMemo(() => dropdowndata?.categories?.map(item => item.name), [dropdowndata]);
  const LocationData = useMemo(() => dropdowndata?.districts?.map(item => item.name), [dropdowndata]);
  const projectTypeData = useMemo(() => dropdowndata?.project_types?.map(item => item.name), [dropdowndata]);
  const procurementData = useMemo(() => dropdowndata?.procurement_types?.map(item => item.name), [dropdowndata]);

  const renderItem = useCallback(({ item }) => (
    <View key={item.pk} style={styles.Card}>
      <TouchableOpacity onPress={() => openImageModal(item.pk, item.image)}>
        <FastImage source={require('../../assets/dummy-image.png')} style={styles.image} />
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
          <TouchableOpacity onPress={closeImageModal} style={styles.closeButton} accessibilityLabel="Close Image Modal">
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <ImageZoomViewer
              imageUrls={[{ url: selectedImage }]} // Only load the selected image
              index={0}
              enableSwipeDown={true}
              onSwipeDown={closeImageModal}
              renderIndicator={() => null}
              backgroundColor="black"
            />
          )}
        </View>
      </Modal>
    </View>
  ), [openImageModal, handleDetailNavigation, isImageVisible, closeImageModal, selectedImage]);

  return (
    <View style={styles.ResultContainer}>
      <View style={styles.navcontainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor={'#424242'}
            value={search}
            onChangeText={setSearch}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={allData}
        renderItem={renderItem}
        keyExtractor={item => item.pk.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={50}
        getItemLayout={(data, index) => (
          { length: 200, offset: 200 * index, index }
        )}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton} accessibilityLabel="Close Filter Modal">
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
              <TouchableOpacity onPress={() => setDatepicker(true)} style={styles.datepicker}>
                <Text>Select Date</Text>
              </TouchableOpacity>
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
              <Custombutton title="Apply Filter" onPress={handleFilter} />
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Result;