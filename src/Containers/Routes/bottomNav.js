import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../../components/Home/home';
import Bazar from '../../components/Bazar/bazar';
import PrivateWork from '../../components/PrivateWorks/privateWork';
import Result from '../../components/Result/result';
import Profile from '../../components/Profile/profile';
import Icon from 'react-native-vector-icons/Ionicons';
import Detail from '../../components/Home/Detail/detail';
import ResultDetails from '../../components/Result/ResultDetail/resultDetail';
import {createStackNavigator} from '@react-navigation/stack';
import Price from '../../components/Pricing/price';
import Notice from './../../components/Notice/notice';
import UserProfile from '../../components/Profile/UserProfile/userProfile';
import Login from '../../components/Login/login';
import EditProfile from '../../components/Profile/UserProfile/EditProfile/editProfile';
import BazarDetail from '../../components/Bazar/Detail/Detail';
import SavedBids from '../../components/BidsSaved/Index';
import AboutUs from '../../components/AboutUs/About';
import Register from '../../components/Register/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ResultStack = createStackNavigator();
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
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

const ResultStackScreen = () => {
  return (
    <ResultStack.Navigator>
      <ResultStack.Screen
        name="ResultScreen"
        component={Result}
        options={{headerShown: false}}
      />
      <ResultStack.Screen
        name="ResultDetails"
        component={ResultDetails}
        options={{headerShown: false}}
      />
    </ResultStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Pricing"
        component={Price}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Notice"
        component={Notice}
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
        name="SavedBids"
        component={SavedBids}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Aboutus"
        component={AboutUs}
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
    </Bazarstack.Navigator>
  );
};

const BottomNav = () => {
  const [token, setToken] = React.useState('');

  useEffect(() => {
    getToken();
    if (token) {
      console.log('ashdkasdhkasdhk');
    }
  }, [token]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setToken(token);
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  const MoreScreenComponent = token ? ProfileStackScreen : Login;

  return (
    <Tab.Navigator detachInactiveScreens={true}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={25}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 16},
          tabBarStyle: {padding: 5},
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Result"
        component={ResultStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'newspaper' : 'newspaper-outline'}
                size={25}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 14},
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Bazar"
        component={BazarStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                name={focused ? 'bag-add' : 'bag-add-outline'}
                size={28}
                color="white"
                style={{
                  backgroundColor: '#0375B7',
                  borderRadius: 20,
                  padding: 10,
                  transform: [{translateY: -15}, {translateX: 0}],
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  width: 50,
                  shadowOffset: {
                    width: 2,
                    height: 2,
                  },
                  shadowOpacity: 0.85,
                  shadowRadius: 5.84,
                  elevation: 5,
                }}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 14},
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="PrivateWorks"
        component={PrivateWork}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'newspaper' : 'newspaper-outline'}
                size={25}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 14},
        }}
      />

      <Tab.Screen
        name="More"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={focused ? 'menu' : 'menu-outline'}
                size={25}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#0375B7',
          headerBackTitleVisible: false,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 14},
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
