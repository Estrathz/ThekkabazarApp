import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useEffect, useState} from 'react';
import styles from './editProfileStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import Custombutton from '../../../../Containers/Button/button';
import SelectDropdown from 'react-native-select-dropdown';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {getProfile, updateProfile} from '../../../../reducers/profileSlice';
import useRequireAuth from '../../../../hooks/useRequireAuth';

const EditProfile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useRequireAuth(navigation, route);
  const {data, updateLoading, profileLoading} = useSelector(
    state => state.userprofile,
  );

  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gender, setGender] = useState('');

  const genderData = ['Male', 'Female'];

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setFullname(data.fullname || '');
    setPhone(data.phone_number || '');
    setCompanyName(data.company_name || '');
    setGender(data.gender || '');
  }, [data]);

  const handleProfileUpdate = async () => {
    try {
      await dispatch(
        updateProfile({
          fullname: fullname.trim(),
          company_name: companyName.trim(),
          phone_number: phone.trim(),
          gender,
        }),
      ).unwrap();
      navigation.goBack();
    } catch (error) {
      // Toast handled in profileSlice.
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (profileLoading && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0375B7" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back-ios-new" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          {[
            {
              label: 'Full Name',
              value: fullname,
              setter: setFullname,
              placeholder: 'Enter full name',
            },
            {
              label: 'Phone Number',
              value: phone,
              setter: setPhone,
              placeholder: 'Enter phone number',
            },
            {
              label: 'Company Name',
              value: companyName,
              setter: setCompanyName,
              placeholder: 'Enter company name',
            },
          ].map((item, index) => (
            <View key={index} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{item.label}:</Text>
              <TextInput
                style={styles.textInput}
                placeholder={item.placeholder}
                placeholderTextColor="#888"
                value={item.value}
                onChangeText={text => item.setter(text)}
                editable={!updateLoading}
              />
            </View>
          ))}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Gender:</Text>
            <SelectDropdown
              data={genderData}
              onSelect={selectedItem => setGender(selectedItem)}
              defaultButtonText={gender || 'Select Gender'}
              buttonTextAfterSelection={selectedItem => selectedItem}
              rowTextForSelection={item => item}
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
              renderDropdownIcon={isOpened => (
                <Icon2
                  name={isOpened ? 'chevron-up' : 'chevron-down'}
                  color="#444"
                  size={18}
                />
              )}
              dropdownIconPosition="right"
              dropdownStyle={styles.dropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              rowTextStyle={styles.dropdownRowText}
              disabled={updateLoading}
            />
          </View>

          {updateLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0375B7" />
              <Text style={styles.loadingText}>Updating profile...</Text>
            </View>
          ) : (
            <Custombutton
              title="Update Profile"
              onPress={handleProfileUpdate}
              style={styles.updateButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
