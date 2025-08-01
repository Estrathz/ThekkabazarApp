import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreens from './src/Containers/Routes/MainScreens';
import { WebView } from 'react-native-webview';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './src/Containers/Loading/loading';
import ErrorBoundary from './src/components/ErrorBoundary';
import { Provider } from 'react-redux';
import store from './src/reducers/store';

export default function App() {
  const Stack = createStackNavigator();
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  const getInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setUser(token);
      
      // Log app initialization
      console.log('App initialized successfully', {
        hasToken: !!token,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to initialize app', error);
      setAppError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const PricingWebviewScreen = ({ route }) => {
    const { url } = route.params;
    return (
      <View style={{ flex: 1 }}>
        <WebView 
          source={{ uri: url }} 
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading...</Text>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error', { url }, nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error', { url, statusCode: nativeEvent.statusCode }, nativeEvent);
          }}
        />
      </View>
    );
  };

  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: '#0375B7'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: '400',
        }}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: '400',
        }}
      />
    ),
  };

  // Show error screen if app initialization failed
  if (appError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          App Initialization Error
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
          Failed to initialize the app. Please restart the application.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <NavigationContainer
          onStateChange={(state) => {
            // Log navigation state changes
            console.log('Navigation state changed', { state });
          }}
          onReady={() => {
            console.log('Navigation container ready');
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen 
              name="MainScreen" 
              component={MainScreens}
              options={{
                unmountOnBlur: false, // Keep screens in memory for better performance
              }}
            />
            <Stack.Screen 
              name="PricingWebview" 
              component={PricingWebviewScreen}
              options={{
                unmountOnBlur: true, // WebView should be unmounted when not visible
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </ErrorBoundary>
    </Provider>
  );
}
