import {View, Text, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './editProfileStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import Custombutton from '../../../../Containers/Button/button';
import SelectDropdown from 'react-native-select-dropdown';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {updateProfile} from '../../../../reducers/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error, updateSuccess} = useSelector(state => state.userprofile);
  const [fullname, setFullname] = useState(data?.fullname || '');
  const [phone, setPhone] = useState(data?.phone_number || '');
  const [companyName, setCompanyName] = useState(data?.company_name || '');
  const [officeName, setOfficeName] = useState(data?.office_name || '');
  const [officeContact, setOfficeContact] = useState(
    data?.office_contact_number || '',
  );
  const [website_url, setWebSiteUrl] = useState(data?.website_url || '');
  const [district, setDistrict] = useState(
    data?.district ? data.district.toString() : '',
  );
  const [municipality, setMunicipality] = useState(data?.municipality || '');
  const [gender, setGender] = useState(data?.gender || '');
  const [access_token, setAccessToken] = useState('');

  const genderData = ['male', 'female'];

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setAccessToken(token);
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  const handleProfileUpdate = () => {
    console.log('Profile', access_token, fullname, phone, gender, companyName);
    dispatch(
      updateProfile({
        access_token: access_token,
        fullname: fullname,
        company_name: companyName,
        office_name: officeName,
        office_contact_number: officeContact,
        website_url: website_url,
        district: district,
        municipality: municipality,
        phone_number: phone,
        gender: gender,
      }),
    );
    if (error) {
      console.log(error);
      return;
    }
    navigation.navigate('UserProfile', {profileUpdated: true});
  };

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', padding: 15}}>
        <Icon
          name="arrow-back-ios-new"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{fontSize: 24, marginLeft: 10, color: 'black'}}>
          Edit Profile
        </Text>
      </View>

      <View style={styles.Cardcontainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Full Name:
          </Text>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={fullname}
            onChangeText={text => setFullname(text)}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Phone Number:
          </Text>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={phone}
            onChangeText={text => setPhone(text)}
          />
        </View>

        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Gender:
          </Text>
          <SelectDropdown
            data={genderData}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              setGender(selectedItem);
            }}
            defaultButtonText={data ? data.gender : 'Select Gender'}
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
                <Icon2
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
          />
        </View> */}

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Company Name:
          </Text>
          <TextInput
            placeholder="Company Name"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={companyName}
            onChangeText={text => setCompanyName(text)}
          />
        </View>

        

        
        <View style={{marginTop: 15}}>
          <Custombutton
            title="Update Profile"
            onPress={() => handleProfileUpdate()}
          />
        </View>
      </View>
    </View>
  );
};

export default EditProfile;
