/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import store from './src/reducers/store';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
