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
import {fetchTenderListData} from '../../reducers/cardSlice';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const [refreshing, setRefreshing] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(null);

  useEffect(() => {
    dispatch(fetchTenderListData());
    dispatch(fetchDropdownData());

    if (dropdownerror) {
      console.log(dropdownerror);
    }

    if (error) {
      console.log(error);
    }
  }, [dispatch]);

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
    setPage(1);
    dispatch(
      fetchTenderListData({
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
    dispatch(fetchTenderListData());
    setRefreshing(false);
  };

  const handleProfileNavi = () => {
    navigation.navigate('MainScreen', {
      screen: 'BottomNav',
      params: {
        screen: 'More',
        params: {screen: 'ProfileScreen'},
      },
    });
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
    setIsImageVisible(index);
  };

  const closeImageModal = () => {
    setIsImageVisible(null);
  };

  const handleSaveBids = pk => {
    dispatch(savebid({id: pk}));
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
                <View style={styles.iconsContainer}>
                  <Icon
                    name="person"
                    size={28}
                    color="black"
                    style={styles.icon}
                    onPress={() => handleProfileNavi()}
                  />
                </View>
              </View>
              <View style={styles.SearchContainer}>
                <Icon
                  name="menu"
                  size={35}
                  color="#0375B7"
                  style={{paddingLeft: 10, paddingRight: 10, top: 5}}
                  onPress={() => navigation.openDrawer()}
                />
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
              <View style={{padding: 0}}>
                <Slider />
              </View>
            </>
          }
          renderItem={({item, index}) => (
            <View key={index} style={styles.Card}>
              <View style={styles.CardHeading}>
                <Icon3 name="calendar-month" size={20} color="black" />
                <Text style={styles.CardText}>
                  Published Date : {item.published_date}
                </Text>
              </View>
              <Text
                style={{
                  color: '#0375B7',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
                onPress={() =>
                  navigation.navigate('HomeDetails', {id: item.pk})
                }>
                {item.title}
              </Text>
              <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
                {item.public_entry_name}
              </Text>
              <View style={styles.Cardbodytext}>
                {item.district?.map((location, index) => (
                  <Text
                    key={index}
                    style={{
                      color: '#185CAB',
                      backgroundColor: '#F0F7FF',
                      padding: 10,
                      marginTop: 20,
                      borderRadius: 8,
                      marginLeft: 15,
                      alignSelf: 'center',
                    }}>
                    {location.name}
                  </Text>
                ))}

                <Text
                  style={{
                    color: '#0F9E1D',
                    backgroundColor: '#E2FBE4',
                    padding: 10,
                    marginTop: 20,
                    borderRadius: 8,
                    marginLeft: 15,
                    alignSelf: 'center',
                  }}>
                  Source: {item.source}
                </Text>
                {item.project_type?.map((project, index) => (
                  <Text
                    key={index}
                    style={{
                      color: '#FF7A00',
                      backgroundColor: '#FFF2F0',
                      padding: 10,
                      marginTop: 20,
                      borderRadius: 8,
                      marginLeft: 15,
                      alignSelf: 'center',
                    }}>
                    {project.name}
                  </Text>
                ))}
              </View>
              <View style={styles.CardFooter}>
                <Icon3
                  name="file-multiple-outline"
                  size={30}
                  style={styles.Icons}
                  onPress={() => openImageModal(index)}
                />
                <Custombutton
                  title="Save Bids"
                  onPress={() => handleSaveBids(item.pk)}
                />
              </View>
              <Modal
                visible={isImageVisible === index}
                animationType="slide"
                transparent={true}>
                <View
                  style={{
                    backgroundColor: 'white',
                    height: '80%',
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
                  setProcurement(selectedItem);
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
