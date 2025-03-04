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
import React, { useEffect, useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.card);
  const { dropdowndata, dropdownerror } = useSelector(state => state.dropdown);

  const [isModalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState({
    organization: '',
    category: '',
    location: '',
    projectType: '',
    procurementsType: '',
    search: '',
  });
  const [date, setDate] = useState(new Date());
  const [datepicker, setDatepicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(null);
  const { width } = useWindowDimensions();
  const [token, setToken] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('access_token');
          setToken(storedToken);
        } catch (error) {
          console.error(error);
        }
      };

      fetchToken();
    }, [])
  );

  useEffect(() => {
    dispatch(fetchTenderListData());
    dispatch(fetchDropdownData());

    if (dropdownerror) console.log(dropdownerror);
    if (error) console.log(error);
  }, [dispatch, token]);

  useEffect(() => {
    if (data?.data) {
      setAllData(prevData => {
        if (page === 1) return data.data;
        const newData = data.data.filter(
          newItem => !prevData.some(prevItem => prevItem.pk === newItem.pk)
        );
        return [...prevData, ...newData];
      });
    }
  }, [data, page]);

  const dropdownData = {
    organizationData: dropdowndata?.organization_sectors?.map(item => item.name),
    categoryData: dropdowndata?.categories?.map(item => item.name),
    locationData: dropdowndata?.districts?.map(item => item.name),
    projectTypeData: dropdowndata?.project_types?.map(item => item.name),
    procurementData: dropdowndata?.procurement_types?.map(item => item.name),
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleFilter = () => {
    closeModal();
    const formattedDate = moment(date).format('YYYY-MM-DD');
    dispatch(fetchTenderListData({ ...filters, published_date: formattedDate }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchTenderListData());
    setRefreshing(false);
  };

  const handleProfileNavi = () => {
    token
      ? navigation.navigate('MainScreen', {
          screen: 'BottomNav',
          params: { screen: 'More', params: { screen: 'ProfileScreen' } },
        })
      : navigation.navigate('Login');
  };

  const handleEndReached = () => {
    const nextPage = page + 1;
    if (nextPage <= data.total_pages) {
      dispatch(fetchTenderListData({ page: nextPage }));
      setPage (nextPage);
    }
  };

  const openImageModal = index => {
    token ? setIsImageVisible(index) : navigation.navigate('Login');
  };

  const closeImageModal = () => setIsImageVisible(null);

  const handleSaveBids = pk => {
    token ? dispatch(savebid({ id: pk, access_token: token })) : navigation.navigate('Login');
  };

  const handleDetailNavigation = pk => {
    token ? navigation.navigate('HomeDetails', { id: pk }) : navigation.navigate('Login');
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
                  <Text style={styles.input} placeholderTextColor={'#424242'}>
                    Search
                  </Text>
                </TouchableOpacity>
              </View>
              <Slider />
            </>
          }
          renderItem={({ item, index }) => (
            <View key={index} style={styles.Card}>
              <TouchableOpacity onPress={() => openImageModal(index)}>
                <Image source={{ uri: item.image }} style={styles.image} />
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
                  data={data}
                  onSelect={(selectedItem) => setFilters(prev => ({ ...prev, [key]: selectedItem }))}
                  defaultButtonText={`Select ${key.replace('Data', '')}`}
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
                onChangeText={text => setFilters(prev => ({ ...prev, search: text }))}
              />
              <Text style={styles.datepicker} onPress={() => setDatepicker(true)}>
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
                {moment(date).format('YYYY-MM-DD')}
              </Text>
              <Custombutton title="Apply Filter" onPress={handleFilter} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;