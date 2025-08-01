/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import store from './src/reducers/store';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
// ✅ Add this import for screens
import {enableScreens} from 'react-native-screens';

// ✅ Enable screens to prevent ScreenFragment crashes
enableScreens();

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
