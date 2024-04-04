import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  FlatList,
  ScrollView,
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

  useEffect(() => {
    dispatch(fetchDropdownData());
    dispatch(fetchresultData());

    if (error) {
      console.log(error);
    }

    if (dropdownerror) {
      console.log(dropdownerror);
    }
  }, [dispatch, error, dropdownerror]);

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

  return (
    <View style={styles.ResultContainer}>
      <FlatList
        data={allData}
        ListHeaderComponent={
          <>
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
          </>
        }
        renderItem={({item, index}) => (
          <View key={index} style={styles.Card}>
            <View style={styles.CardHeading}>
              <Icon2 name="calendar-month" size={24} color="black" />
              <Text style={styles.CardText}>
                Published Date : {item?.published_date}
              </Text>
            </View>
            <Text
              style={{
                color: '#0375B7',
                fontSize: 22,
                fontWeight: 'bold',
                marginTop: 10,
              }}
              onPress={() =>
                navigation.navigate('ResultDetails', {id: item?.pk})
              }>
              {item?.title}
            </Text>
            <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
              {item?.public_entry_name}
            </Text>
            <View style={styles.Cardbodytext}>
              {item?.district?.map((location, index) => (
                <Text
                  key={index}
                  style={{
                    color: '#185CAB',
                    backgroundColor: '#F0F7FF',
                    padding: 10,
                    marginTop: 20,
                    borderRadius: 8,
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
                Source: {item?.source}
              </Text>
              {item?.project_type?.map((project, index) => (
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
              <Icon name="medal" size={35} color="#0375B7" />
              <View style={{padding: 15}}>
                <Text
                  style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                  {' '}
                  Awarded To:
                </Text>
                <Text style={{color: 'black', fontSize: 16}}>
                  {item?.awarded_to}
                </Text>
              </View>
            </View>
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
