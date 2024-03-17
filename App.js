import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './src/components/Login/login';
import HomeDashboard from './src/components/Home/home';
import Footer from './src/Containers/Footer/footer';
import Result from './src/components/Result/result';
import PrivateWork from './src/components/PrivateWorks/privateWork';
import Bazar from './src/components/Bazar/bazar';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeDashboard} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="PrivateWork" component={PrivateWork} />
        <Stack.Screen name="Bazar" component={Bazar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
