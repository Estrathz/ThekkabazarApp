import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {TabRouter} from '@react-navigation/native';
import HomeScreen from '../../components/Home/home';
import SideDrawer from './drawer';
import BottomNav from './bottomNav';

const Drawer = createDrawerNavigator();

const MainScreens = () => {
  return (
    <Drawer.Navigator drawerContent={props => <SideDrawer {...props} />}>
      <Drawer.Screen
        name="BottomNav"
        component={BottomNav}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default MainScreens;
