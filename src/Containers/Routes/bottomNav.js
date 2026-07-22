import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../../components/Home/home';
import Bazar from '../../components/Bazar/bazar';
import PrivateWork from '../../components/PrivateWorks/privateWork';

import Profile from '../../components/Profile/profile';
import Icon from 'react-native-vector-icons/Ionicons';
import Detail from '../../components/Home/Detail/detail';
import ResultDetails from '../../components/Result/ResultDetail/resultDetail';
import {createStackNavigator} from '@react-navigation/stack';
import UserProfile from '../../components/Profile/UserProfile/userProfile';
import Login from '../../components/Login/login';
import EditProfile from '../../components/Profile/UserProfile/EditProfile/editProfile';
import ChangePassword from '../../components/Profile/UserProfile/ChangePassword/changePassword';
import BazarDetail from '../../components/Bazar/Detail/Detail';
import SavedBids from '../../components/BidsSaved/Index';
import AboutUs from '../../components/AboutUs/About';
import Register from '../../components/Register/Register';
import ImageGallery from '../../components/Home/ImageGallery';
import {deviceInfo, normalize} from '../../utils/responsive';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const AboutUsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Bazarstack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={Home}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="HomeDetails"
        component={Detail}
        options={{headerShown: false, unmountOnBlur: true}}
      />
      <HomeStack.Screen
        name="ResultDetails"
        component={ResultDetails}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="ImageGallery"
        component={ImageGallery}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

const AboutUsStackScreen = () => {
  return (
    <AboutUsStack.Navigator>
      <AboutUsStack.Screen
        name="AboutUsScreen"
        component={AboutUs}
        options={{headerShown: false}}
      />
      <AboutUsStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <AboutUsStack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </AboutUsStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="SavedBids"
        component={SavedBids}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Aboutus"
        component={AboutUs}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </ProfileStack.Navigator>
  );
};

const BazarStackScreen = () => {
  return (
    <Bazarstack.Navigator>
      <Bazarstack.Screen
        name="BazarScreen"
        component={Bazar}
        options={{headerShown: false}}
      />
      <Bazarstack.Screen
        name="BazarDetail"
        component={BazarDetail}
        options={{headerShown: false}}
      />
      <Bazarstack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Bazarstack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Bazarstack.Navigator>
  );
};

const BottomNav = () => {
  return (
    <Tab.Navigator detachInactiveScreens={false}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={28}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: normalize(14),
            marginTop: deviceInfo.isTablet ? 4 : 3,
            fontWeight: '600',
          }, // Increased from 12 and added fontWeight
          tabBarIconStyle: {marginTop: deviceInfo.isTablet ? 4 : 3}, // Increased from 2:1
          tabBarStyle: {
            height: deviceInfo.isTablet ? 85 : 75, // Increased from 65:55
            paddingBottom: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            paddingTop: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            backgroundColor: '#FFFFFF',
            borderTopWidth: 2,
            borderTopColor: '#E0E0E0',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -3},
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          },
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="BizTax"
        component={AboutUsStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'document-text' : 'document-text-outline'}
                size={28}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: normalize(14),
            marginTop: deviceInfo.isTablet ? 4 : 3,
            fontWeight: '600',
          }, // Increased from 12 and added fontWeight
          tabBarIconStyle: {marginTop: deviceInfo.isTablet ? 4 : 3}, // Increased from 2:1
          tabBarStyle: {
            height: deviceInfo.isTablet ? 85 : 75, // Increased from 65:55
            paddingBottom: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            paddingTop: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            backgroundColor: '#FFFFFF',
            borderTopWidth: 2,
            borderTopColor: '#E0E0E0',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -3},
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          },
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="Bazar"
        component={BazarStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'business' : 'business-outline'}
                size={28}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: normalize(14),
            marginTop: deviceInfo.isTablet ? 4 : 3,
            fontWeight: '600',
          }, // Increased from 12 and added fontWeight
          tabBarIconStyle: {marginTop: deviceInfo.isTablet ? 4 : 3}, // Increased from 2:1
          tabBarStyle: {
            height: deviceInfo.isTablet ? 85 : 75, // Increased from 65:55
            paddingBottom: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            paddingTop: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            backgroundColor: '#FFFFFF',
            borderTopWidth: 2,
            borderTopColor: '#E0E0E0',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -3},
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          },
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="PrivateWork"
        component={PrivateWork}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'briefcase' : 'briefcase-outline'}
                size={28}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: normalize(14),
            marginTop: deviceInfo.isTablet ? 4 : 3,
            fontWeight: '600',
          }, // Increased from 12 and added fontWeight
          tabBarIconStyle: {marginTop: deviceInfo.isTablet ? 4 : 3}, // Increased from 2:1
          tabBarStyle: {
            height: deviceInfo.isTablet ? 85 : 75, // Increased from 65:55
            paddingBottom: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            paddingTop: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            backgroundColor: '#FFFFFF',
            borderTopWidth: 2,
            borderTopColor: '#E0E0E0',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -3},
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          },
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'person' : 'person-outline'}
                size={28}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: normalize(14),
            marginTop: deviceInfo.isTablet ? 4 : 3,
            fontWeight: '600',
          }, // Increased from 12 and added fontWeight
          tabBarIconStyle: {marginTop: deviceInfo.isTablet ? 4 : 3}, // Increased from 2:1
          tabBarStyle: {
            height: deviceInfo.isTablet ? 85 : 75, // Increased from 65:55
            paddingBottom: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            paddingTop: deviceInfo.isTablet ? 12 : 8, // Increased from 8:4
            backgroundColor: '#FFFFFF',
            borderTopWidth: 2,
            borderTopColor: '#E0E0E0',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -3},
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          },
          unmountOnBlur: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
