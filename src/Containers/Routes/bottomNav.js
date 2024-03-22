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

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ResultStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="HomeDetails"
        component={Detail}
        options={{headerShown: false, unmountOnBlur: true}}
      />
    </HomeStack.Navigator>
  );
};

const ResultStackScreen = () => {
  return (
    <ResultStack.Navigator>
      <ResultStack.Screen
        name="Result"
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

const BottomNav = () => {
  return (
    <Tab.Navigator detachInactiveScreens={true}>
      <Tab.Screen
        name="HomestackScreen"
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
          tabBarLabelStyle: {fontSize: 14},
          tabBarStyle: {padding: 5},
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="ResultStack"
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
        }}
      />
      <Tab.Screen
        name="Bazar"
        component={Bazar}
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
        component={Profile}
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
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
