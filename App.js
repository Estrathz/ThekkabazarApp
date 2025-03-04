import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreens from './src/Containers/Routes/MainScreens';
import { WebView } from 'react-native-webview';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './src/Containers/Loading/loading';

export default function App() {
  const Stack = createStackNavigator();
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getInfo = async () => {
    setUser(await AsyncStorage.getItem('access_token'));
    setIsLoading(false);
  };

  useEffect(() => {
    getInfo();
  }, []);
  const PricingWebviewScreen = ({ route }) => {
    const { url } = route.params;
    return (
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: url }} />
      </View>
    );
  };
  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: 'blue'}}
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

  if (isLoading) {
    return <LoadingScreen />; // Render loading screen while retrieving token
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="MainScreen" component={MainScreens} />
          <Stack.Screen name="PricingWebview" component={PricingWebviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
    
  );
}
