import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './editProfileStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Custombutton from '../../../../Containers/Button/button';
import SelectDropdown from 'react-native-select-dropdown';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { updateProfile } from '../../../../reducers/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.userprofile);
  
  // State Variables
  const [fullname, setFullname] = useState(data?.fullname || '');
  const [phone, setPhone] = useState(data?.phone_number || '');
  const [companyName, setCompanyName] = useState(data?.company_name || '');
  const [gender, setGender] = useState(data?.gender || '');
  const [access_token, setAccessToken] = useState('');

  const genderData = ['Male', 'Female'];

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setAccessToken(token);
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const handleProfileUpdate = () => {
    dispatch(
      updateProfile({
        access_token,
        fullname,
        company_name: companyName,
        phone_number: phone,
        gender,
      })
    );

    if (!error) {
      navigation.navigate('UserProfile', { profileUpdated: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios-new" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          {/* Input Fields */}
          {[
            { label: 'Full Name', value: fullname, setter: setFullname, placeholder: 'Enter full name' },
            { label: 'Phone Number', value: phone, setter: setPhone, placeholder: 'Enter phone number' },
            { label: 'Company Name', value: companyName, setter: setCompanyName, placeholder: 'Enter company name' },
          ].map((item, index) => (
            <View key={index} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{item.label}:</Text>
              <TextInput
                style={styles.textInput}
                placeholder={item.placeholder}
                placeholderTextColor="#888"
                value={item.value}
                onChangeText={text => item.setter(text)}
              />
            </View>
          ))}

          {/* Gender Dropdown */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Gender:</Text>
            <SelectDropdown
              data={genderData}
              onSelect={(selectedItem) => setGender(selectedItem)}
              defaultButtonText={gender || 'Select Gender'}
              buttonTextAfterSelection={(selectedItem) => selectedItem}
              rowTextForSelection={(item) => item}
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
              renderDropdownIcon={isOpened => (
                <Icon2 name={isOpened ? 'chevron-up' : 'chevron-down'} color="#444" size={18} />
              )}
              dropdownIconPosition="right"
              dropdownStyle={styles.dropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              rowTextStyle={styles.dropdownRowText}
            />
          </View>

          {/* Update Button */}
          <Custombutton title="Update Profile" onPress={handleProfileUpdate} style={styles.updateButton} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;
