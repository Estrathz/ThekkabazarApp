import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback} from 'react';
import styles from './profileStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import Custombutton from '../../Containers/Button/button';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {getProfile} from '../../reducers/profileSlice';
import {logout} from '../../reducers/userSlice';
import {navigateToHomeAfterLogin} from '../../utils/navigationHelpers';
import {useFocusEffect} from '@react-navigation/native';
import {createRefreshThrottle} from '../../utils/refreshThrottle';

const profileRefreshRef = createRefreshThrottle(60 * 1000);

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, profileLoading} = useSelector(state => state.userprofile);
  const {isAuthenticated, loading} = useSelector(state => state.users);

  useFocusEffect(
    useCallback(() => {
      if (
        isAuthenticated &&
        profileRefreshRef.shouldRefresh('profile-hub')
      ) {
        dispatch(getProfile()).finally(() => {
          profileRefreshRef.markRefreshed('profile-hub');
        });
      }
    }, [dispatch, isAuthenticated]),
  );

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigateToHomeAfterLogin(navigation);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again',
        visibilityTime: 3000,
      });
    }
  };

  const authenticatedMenu = [
    {icon: 'person-outline', label: 'Profile', route: 'UserProfile'},
    {icon: 'bookmark-outline', label: 'Saved Bids', route: 'SavedBids'},
    {icon: 'lock-closed-outline', label: 'Change Password', route: 'ChangePassword'},
    {icon: 'information-circle-outline', label: 'About Us', route: 'Aboutus'},
  ];

  const guestMenu = [
    {icon: 'information-circle-outline', label: 'About Us', route: 'Aboutus'},
  ];

  const menuItems = isAuthenticated ? authenticatedMenu : guestMenu;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Icon name="person-circle-outline" size={85} color="#007AFF" />
          {profileLoading && isAuthenticated && !data?.fullname ? (
            <ActivityIndicator
              size="small"
              color="#0375B7"
              style={{marginTop: 8}}
            />
          ) : (
            <Text style={styles.profileName}>
              {isAuthenticated ? data?.fullname || 'User' : 'Guest User'}
            </Text>
          )}
          <Text style={styles.accountType}>
            {isAuthenticated ? 'Member Account' : 'Free Account'}
          </Text>
        </View>

        <Custombutton
          title={isAuthenticated ? 'View Plans' : 'Login'}
          onPress={() => {
            if (isAuthenticated) {
              navigation.navigate('PricingWebview', {
                url: 'https://thekkabazar.com/pricing/',
              });
            } else {
              navigation.navigate('Login');
            }
          }}
          style={styles.actionButton}
        />

        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={() => navigation.navigate(item.route)}>
              <Icon name={item.icon} size={28} color="#333" />
              <Text style={styles.optionText}>{item.label}</Text>
              <Icon2 name="arrow-forward-ios" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {isAuthenticated && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}>
            <Icon name="exit-outline" size={28} color="red" />
            <Text style={styles.logoutText}>
              {loading ? 'Logging out...' : 'Log Out'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <View style={styles.divider} />

          {[
            {
              icon: 'location-on',
              color: '#007AFF',
              text: 'Buddhanagar, Kathmandu, Nepal',
            },
            {
              icon: 'phone',
              color: '#28A745',
              text: '01-4794001',
              onPress: () => Linking.openURL('tel:01-4794001'),
            },
            {
              icon: 'email',
              color: '#007AFF',
              text: 'info@thekkabazar.com',
              onPress: () => Linking.openURL('mailto:info@thekkabazar.com'),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactItem}
              onPress={item.onPress}>
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
