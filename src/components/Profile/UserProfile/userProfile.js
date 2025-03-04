import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './userProfileStyle';
import Custombutton from '../../../Containers/Button/button';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../../reducers/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, CommonActions, useRoute } from '@react-navigation/native';

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.userprofile);
  const [token, setToken] = useState('');
  const route = useRoute();

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
        dispatch(getProfile({ access_token: storedToken }));
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getToken();
      if (error) {
        console.log(error);
      }
    }, [error])
  );

  useEffect(() => {
    if (route.params?.profileUpdated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UserProfile' }],
        })
      );
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon2 name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Profile Details Card */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Details</Text>
            <Custombutton title="Edit" onPress={() => navigation.navigate('EditProfile')} />
          </View>

          {/* Profile Information */}
          <View style={styles.profileInfo}>
            {[
              { label: 'Full Name', value: data?.fullname },
              { label: 'Phone Number', value: data?.phone_number },
              { label: 'Email', value: data?.email },
              { label: 'Company Name', value: data?.company_name },
              { label: 'Username', value: data?.username },
            ].map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}:</Text>
                <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                  {item.value || 'Not Available'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfile;
