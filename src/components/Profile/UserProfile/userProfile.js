import {View, Text, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback} from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './userProfileStyle';
import Custombutton from '../../../Containers/Button/button';
import {useDispatch, useSelector} from 'react-redux';
import {getProfile} from '../../../reducers/profileSlice';
import {useFocusEffect} from '@react-navigation/native';
import {createRefreshThrottle} from '../../../utils/refreshThrottle';
import useRequireAuth from '../../../hooks/useRequireAuth';

const profileRefreshRef = createRefreshThrottle(60 * 1000);

const UserProfile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useRequireAuth(navigation, route);
  const {data, error, profileLoading} = useSelector(state => state.userprofile);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        return;
      }

      if (profileRefreshRef.shouldRefresh('user-profile')) {
        dispatch(getProfile()).finally(() => {
          profileRefreshRef.markRefreshed('user-profile');
        });
      }
    }, [dispatch, isLoggedIn]),
  );

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon2 name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Details</Text>
            <Custombutton
              title="Edit"
              onPress={() => navigation.navigate('EditProfile')}
            />
          </View>

          {profileLoading && !data ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0375B7" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : error && !data ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>
                Could not load profile. Pull to refresh by leaving and returning.
              </Text>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              {[
                {label: 'Full Name', value: data?.fullname},
                {label: 'Phone Number', value: data?.phone_number},
                {label: 'Email', value: data?.email},
                {label: 'Company Name', value: data?.company_name},
                {label: 'Username', value: data?.username},
              ].map((item, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}:</Text>
                  <Text
                    style={styles.infoValue}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.value || 'Not Available'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
