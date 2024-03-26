import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreens from './src/Containers/Routes/MainScreens';

import Login from './src/components/Login/login';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Detail from './src/components/Home/Detail/detail';

export default function App() {
  const Stack = createStackNavigator();
  const [user, setUser] = useState('');

  const getInfo = async () => {
    setUser(await AsyncStorage.getItem('access_token'));
  };

  useEffect(() => {
    getInfo();
  }, []);

  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: 'pink'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 16,
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 16,
          fontWeight: '400',
        }}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {/* {user ? (
            <Stack.Screen name="MainScreen" component={MainScreens} />
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )} */}
          <Stack.Screen name="Login2" component={Login} />
          <Stack.Screen name="MainScreen" component={MainScreens} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
