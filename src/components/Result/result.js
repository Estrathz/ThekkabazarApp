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
import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import styles from './resultStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import {fetchDropdownData} from '../../reducers/dropdownSlice';
import {fetchresultData} from '../../reducers/resultSlice';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import HTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import Icon3 from 'react-native-vector-icons/Ionicons';

const Result = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.result);
  const {dropdowndata, dropdownerror} = useSelector(state => state.dropdown);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const {width} = useWindowDimensions();
  const [isImageVisible, setIsImageVisible] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getToken();
      if (token) {
        console.log(token);
      }
    }, [token]),
  );

  useEffect(() => {
    dispatch(fetchDropdownData());
    dispatch(fetchresultData());
    // getToken();
    // if (token) {
    //   console.log(token);
    // }
    if (error) {
      console.log(error);
    }

    if (dropdownerror) {
      console.log(dropdownerror);
    }
  }, [dispatch, error, dropdownerror, token]);

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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const organizationData = dropdowndata?.organization_sectors?.map(
    item => item.name,
  );
  const categoryData = dropdowndata?.categories?.map(item => item.name);
  const LocationData = dropdowndata?.districts?.map(item => item.name);
  const projectTypeData = dropdowndata?.project_types?.map(item => item.name);
  const procurementData = dropdowndata?.procurement_types?.map(
    item => item.name,
  );

  const handleFilter = () => {
    closeModal();
    setPage(1);
    dispatch(
      fetchresultData({
        organization_sector: organization,
        location: location,
        project_type: projectType,
        procurement_type: procurementsType,
        category: category,
        search: search,
      }),
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchresultData({page: 1}));
    setRefreshing(false);
  };

  const handleEndReached = () => {
    const nextPage = page + 1;
    console.log('handleEndReached', nextPage, data.total_pages);
    if (nextPage <= data.total_pages) {
      dispatch(fetchresultData({page: nextPage}));
      setPage(nextPage); // Update the page state
    }
  };

  const handleDetailNavigation = pk => {
    // token
    //   ? navigation.navigate('ResultDetails', {id: pk})
    //   : navigation.navigate('MainScreen', {
    //       screen: 'BottomNav',
    //       params: {
    //         screen: 'Home',
    //         params: {screen: 'Login'},
    //       },
    //   });
    if (token) {
      navigation.navigate('ResultDetails', {id: pk});
    } else if (token === null || token === '') {
      navigation.navigate('MainScreen', {
        screen: 'BottomNav',
        params: {
          screen: 'Home',
          params: {screen: 'Login'},
        },
      });
    }
  };

  const openImageModal = index => {
    setIsImageVisible(index);
  };

  const closeImageModal = () => {
    setIsImageVisible(null);
  };

  const removeHtmlTags = htmlString => {
    return htmlString.replace(/<[^>]+>/g, '');
  };

  return (
    <View style={styles.ResultContainer}>
      <FlatList
        data={allData}
        ListHeaderComponent={
          <>
            <View style={styles.SearchContainer}>
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
                  <Icon3 name="bag-handle" size={18} color="black" />
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
                  <Icon2 name="update" size={18} color="black" />
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
                  <Icon3 name="newspaper" size={18} color="black" />
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
                  <Icon3 name="location" size={18} color="black" />
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

              <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => handleSaveBids(item.pk)}
                  style={styles.cusBottom}>
                  <Icon3 name="save-outline" size={25} color="#000" />
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

      {/* 
      // modal   */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ScrollView style={styles.modalContainer}>
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
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
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
              />
              <SelectDropdown
                data={categoryData}
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
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
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
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
                Select Date
              </Text>
              <SelectDropdown
                data={projectTypeData}
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
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
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
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
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Result;
