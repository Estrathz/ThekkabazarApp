import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  RefreshControl,
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

  useEffect(() => {
    dispatch(fetchTenderListData({page: page}));
    dispatch(fetchDropdownData());

    if (dropdownerror) {
      console.log(dropdownerror);
    }

    if (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (data && data.length > 0) {
      setAllData(data);
    }
  }, [data]);

  useEffect(() => {
    console.log('page in component ', page);
    if (page > 1) {
      setLoading(true);

      dispatch(fetchTenderListData({page: page}))
        .then(() => {
          setLoading(false);
          setAllData(prevData => [...data, ...prevData]);
        })
        .catch(err => {
          console.log('Error in fetching data:', err);
        });
    }
  }, [page]);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      setPage(page + 1);
    }
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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleFilter = () => {
    closeModal();
    // Reset page to show the first
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
    dispatch(fetchTenderListData({page: 1}));
    setRefreshing(false);
  };

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.HomeContainer}>
      <View style={styles.navcontainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.iconsContainer}>
          <Icon
            name="notifications-outline"
            size={28}
            color="black"
            style={styles.icon}
          />
          <Icon name="person" size={28} color="black" style={styles.icon} />
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
        <TouchableOpacity onPress={openModal} style={styles.searchSection}>
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

      <View style={{flex: 1, padding: 10}}>
        <Card title={'All Bids'} data={allData} navigation={navigation} />
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
    </ScrollView>
  );
};

export default Home;
