import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './homeStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '../../Containers/Slider/slider';
import Card from '../../Containers/Card/card';
import {fetchDropdownData} from '../../reducers/dropdownSlice';
import {useDispatch, useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import {fetchTenderListData, savebid} from '../../reducers/cardSlice';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import HTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.card);
  const {dropdowndata, dropdownerror} = useSelector(state => state.dropdown);

  const [isModalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState('');
  const [procurementsType, setProcurementsType] = useState('');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date());
  const [datepicker, setDatepicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(null);
  const {width} = useWindowDimensions();
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken();
    if (token) {
      console.log(token);
    }
  }, [token]);

  useEffect(() => {
    dispatch(fetchTenderListData());
    dispatch(fetchDropdownData());

    if (dropdownerror) {
      console.log(dropdownerror);
    }

    if (error) {
      console.log(error);
    }
  }, [dispatch, token]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setToken(token);
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      if (page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prevData => {
          const newData = data.data.filter(
            newItem => !prevData.some(prevItem => prevItem.pk === newItem.pk),
          );
          return [...prevData, ...newData];
        });
      }
    }
  }, [data, page]);

  const organizationData = dropdowndata?.organization_sectors?.map(
    item => item.name,
  );
  const categoryData = dropdowndata?.categories?.map(item => item.name);
  const LocationData = dropdowndata?.districts?.map(item => item.name);
  const projectTypeData = dropdowndata?.project_types?.map(item => item.name);
  const procurementData = dropdowndata?.procurement_types?.map(
    item => item.name,
  );

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleFilter = () => {
    closeModal();
    console.log('handleFilter', date);
    setPage(1);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    dispatch(
      fetchTenderListData({
        organization_sector: organization,
        location: location,
        project_type: projectType,
        procurement_type: procurementsType,
        category: category,
        search: search,
        published_date: formattedDate,
      }),
    );
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
          params: {
            screen: 'More',
            params: {screen: 'ProfileScreen'},
          },
        })
      : navigation.navigate('Login');
  };

  const handleEndReached = () => {
    const nextPage = page + 1;
    console.log('handleEndReached', nextPage, data.total_pages);
    if (nextPage <= data.total_pages) {
      dispatch(fetchTenderListData({page: nextPage}));
      setPage(nextPage); // Update the page state
    }
  };

  const openImageModal = index => {
    if (token) {
      setIsImageVisible(index);
    } else if (token === null || token === '') {
      navigation.navigate('Login');
    }

    // setIsImageVisible(index);
  };

  const closeImageModal = () => {
    setIsImageVisible(null);
  };

  const handleSaveBids = pk => {
    dispatch(savebid({id: pk, access_token: token}));
  };

  const handleDetailNavigation = pk => {
    if (token) {
      navigation.navigate('HomeDetails', {id: pk});
    } else if (token === null || token === '') {
      navigation.navigate('Login');
    }
  };

  const handleImageOpen = index => {
    // token ?
    // openImageModal(index) : navigation.navigate("Login")
    console.log('ajhvdfjsd', index);
    openImageModal(index);
  };

  return (
    <View style={styles.HomeContainer}>
      <View style={{flex: 1}}>
        <FlatList
          data={allData}
          ListHeaderComponent={
            <>
              <View style={styles.navcontainer}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                />
                <View>
                  <TouchableOpacity
                    onPress={openModal}
                    style={styles.searchSection}>
                    <Icon
                      style={styles.searchIcon}
                      name="search"
                      size={20}
                      color="#000"
                    />

                    <Text
                      style={styles.input}
                      // onChangeText={searchString => this.setState({searchString})}
                      underlineColorAndroid="transparent"
                      placeholderTextColor={'#424242'}>
                      Search
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View style={styles.SearchContainer}>
                <TouchableOpacity
                  onPress={openModal}
                  style={styles.searchSection}>
                  <Icon
                    style={styles.searchIcon}
                    name="search"
                    size={20}
                    color="#000"
                  />

                  <Text
                    style={styles.input}
                    // onChangeText={searchString => this.setState({searchString})}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={'#424242'}>
                    Search
                  </Text>
                </TouchableOpacity>
              </View> */}
              <View>
                <Slider />
              </View>
            </>
          }
          renderItem={({item, index}) => (
            <View key={index} style={styles.Card}>
              <View>
                <Image
                  source={{uri: item.image}}
                  style={styles.image}
                  onPress={() => openImageModal(index)}
                />
              </View>
              <View style={{padding: 8, flex: 1, flexDirection: 'column'}}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#0375B7',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 8,
                    width: '100%',
                  }}
                  onPress={() => handleDetailNavigation(item.pk)}>
                  {item.title}
                </Text>
                <Text numberOfLines={2} style={{color: 'black', fontSize: 15}}>
                  {item.public_entry_name}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon2 name="bag-handle" size={18} color="black" />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Service:
                    </Text>
                  </View>
                  {item.project_type?.map((project, index) => (
                    <Text
                      key={index}
                      numberOfLines={2}
                      style={{
                        color: '#000',
                        width: '100%',
                        flex: 1,
                      }}>
                      {project.name}
                    </Text>
                  ))}
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon3 name="update" size={18} color="black" />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Published:
                    </Text>
                  </View>
                  <Text style={styles.CardText}>{item.published_date}</Text>
                  <Text style={{color: '#fcc40d', marginLeft: 10}}>
                    {item.days_left}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon2 name="newspaper" size={18} color="black" />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Source:
                    </Text>
                  </View>
                  <Text style={styles.CardText}>{item.source}</Text>
                </View>

                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon2 name="location" size={18} color="black" />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Location:
                    </Text>
                  </View>
                  {item.district?.map((loc, index) => (
                    <Text
                      key={index}
                      numberOfLines={2}
                      style={{
                        color: '#000',
                        width: '100%',
                        flex: 1,
                        marginLeft: 5,
                      }}>
                      {loc.name}
                    </Text>
                  ))}
                </View>

                <View
                  style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => handleSaveBids(item.pk)}
                    style={styles.cusBottom}>
                    <Icon2 name="save-outline" size={25} color="#000" />
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 15,
                        alignSelf: 'center',
                      }}>
                      Save Bids
                    </Text>
                  </TouchableOpacity>
                  {/* <Custombutton
                    title="Save Bids"
                    onPress={() => handleSaveBids(item.pk)}
                  /> */}
                </View>
              </View>
              <Modal
                visible={isImageVisible === index}
                animationType="slide"
                transparent={true}>
                <View
                  style={{
                    backgroundColor: 'white',
                    height: '100%',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    position: 'absolute',
                  }}>
                  <TouchableOpacity
                    onPress={closeImageModal}
                    style={{alignSelf: 'flex-end', margin: 10}}>
                    <Icon2 name="close" size={30} color="black" />
                  </TouchableOpacity>
                  <Image
                    source={{uri: item.image}}
                    alt="tenderpicture"
                    style={{height: '80%', width: '80%', alignSelf: 'center'}}
                    resizeMode="contain"
                  />
                </View>
              </Modal>
            </View>
          )}
          keyExtractor={item => item.pk}
          onMomentumScrollEnd={handleEndReached}
          onEndReachedThreshold={0.8}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={closeModal}
              style={{alignSelf: 'flex-end', margin: 10}}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Filter Categories</Text>
            <Text style={{color: 'black', fontSize: 16, marginBottom: 10}}>
              Choose a filter category from the provided list.
            </Text>
            <View style={{padding: 5}}>
              <SelectDropdown
                data={organizationData}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setOrganization(selectedItem);
                }}
                defaultButtonText={'Select Organization'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                search
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Search here'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name="search" color={'#444'} size={18} />;
                }}
              />
              <TextInput
                placeholder="Enter Keywords"
                placeholderTextColor={'#424242'}
                style={styles.searchInput}
                onChangeText={text => setSearch(text)}
              />
              <SelectDropdown
                data={categoryData}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setCategory(selectedItem);
                }}
                defaultButtonText={'Select Category'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                search
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Search here'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name="search" color={'#444'} size={18} />;
                }}
              />
              <SelectDropdown
                data={LocationData}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setLocation(selectedItem);
                }}
                defaultButtonText={'Select Location'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                search
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Search here'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name="search" color={'#444'} size={18} />;
                }}
              />
              <Text
                style={styles.datepicker}
                onPress={() => setDatepicker(true)}>
                <DatePicker
                  modal
                  mode="date"
                  open={datepicker}
                  date={date}
                  onConfirm={date => {
                    setDatepicker(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setDatepicker(false);
                  }}
                />
                {date.length > 0 ? date : 'Select date'}
              </Text>
              <SelectDropdown
                data={projectTypeData}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setProjectType(selectedItem);
                }}
                defaultButtonText={'Select Project Types'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                search
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Search here'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name="search" color={'#444'} size={18} />;
                }}
              />
              <SelectDropdown
                data={procurementData}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setProcurementsType(selectedItem);
                }}
                defaultButtonText={'Select Procurements Types'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                search
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Search here'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return <Icon name="search" color={'#444'} size={18} />;
                }}
              />
              <Custombutton
                title="Apply Filter"
                onPress={() => handleFilter()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
