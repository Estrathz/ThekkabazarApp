import { View, Text, Linking, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './profileStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import Custombutton from '../../Containers/Button/button';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, resetUserProfile } from '../../reducers/profileSlice';
import { useFocusEffect } from '@react-navigation/native';


const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.userprofile);
  const [token, setToken] = useState('');

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
        dispatch(getProfile({ access_token: storedToken }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchToken();
    }, [dispatch])
  );

  const handleLogout = () => {
    dispatch(resetUserProfile());
    Toast.show({ type: 'success', text1: 'Logout Successful', visibilityTime: 3000 });
    navigation.navigate('MainScreen', {
      screen: 'BottomNav',
      params: { screen: 'Home', params: { screen: 'HomeScreen' } },
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Icon name="person-circle-outline" size={85} color="#007AFF" />
          <Text style={styles.profileName}>{data?.fullname || 'Guest User'}</Text>
          <Text style={styles.accountType}>Free Account</Text>
        </View>

        {/* Upgrade or Login Button */}
        <Custombutton
  title={token ? 'View Plans' : 'Login'}
  onPress={() => {
    if (token) {
      navigation.navigate('PricingWebview', { url: 'https://thekkabazar.com/pricing/' });
    } else {
      navigation.navigate('MainScreen', {
        screen: 'BottomNav',
        params: { screen: 'Home', params: { screen: 'Login' } },
      });
    }
  }}
  style={styles.actionButton}
/>

        {/* Profile Actions */}
        <View style={styles.section}>
          {[
            { icon: 'person-outline', label: 'Profile', route: 'UserProfile' },
            { icon: 'bookmark-outline', label: 'Saved Bids', route: 'SavedBids' },
            { icon: 'information-circle-outline', label: 'About Us', route: 'Aboutus' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.optionItem} onPress={() => navigation.navigate(item.route)}>
              <Icon name={item.icon} size={28} color="#333" />
              <Text style={styles.optionText}>{item.label}</Text>
              <Icon2 name="arrow-forward-ios" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="exit-outline" size={28} color="red" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Get In Touch */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <View style={styles.divider} />

          {[
            { icon: 'location-on', color: '#007AFF', text: 'Buddhanagar, Kathmandu, Nepal' },
            { icon: 'phone', color: '#28A745', text: '01-4794001', onPress: () => Linking.openURL('tel:01-4794001') },
            { icon: 'email', color: '#007AFF', text: 'info@thekkabazar.com', onPress: () => Linking.openURL('mailto:info@thekkabazar.com') },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.contactItem} onPress={item.onPress}>
              <Icon2 name={item.icon} size={30} color={item.color} />
              <Text style={styles.contactText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
