import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import styles from './drawerStyle';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.drawerHeader}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.drawerItemContainer}>
        <Pressable style={styles.drawerItem}>
          <Icon name="home" size={25} color="#0375B7" />
          <Text
            style={styles.drawerItemText}
            onPress={() =>
              navigation.navigate('MainScreen', {
                screen: 'BottomNav',
                params: {screen: 'Home'},
              })
            }>
            Home
          </Text>
        </Pressable>
        <Pressable style={styles.drawerItem}>
          <Icon name="newspaper" size={25} color="#ed61ff" />
          <Text
            style={styles.drawerItemText}
            onPress={() =>
              navigation.navigate('MainScreen', {
                screen: 'BottomNav',
                params: {screen: 'Result'},
              })
            }>
            Result
          </Text>
        </Pressable>
        <Pressable style={styles.drawerItem}>
          <Icon name="bag-add" size={25} color="#96200b" />
          <Text
            style={styles.drawerItemText}
            onPress={() =>
              navigation.navigate('MainScreen', {
                screen: 'BottomNav',
                params: {screen: 'Bazar'},
              })
            }>
            Bazar
          </Text>
        </Pressable>
        <Pressable style={styles.drawerItem}>
          <Icon name="pricetag" size={25} color="#d4c955" />
          <Text
            style={styles.drawerItemText}
            onPress={() =>
              navigation.navigate('MainScreen', {
                screen: 'BottomNav',
                params: {screen: 'Home'},
              })
            }>
            Pricing
          </Text>
        </Pressable>
        <Pressable style={styles.drawerItem}>
          <Icon name="podium" size={25} color="#b8026c" />
          <Text
            style={styles.drawerItemText}
            onPress={() =>
              navigation.navigate('MainScreen', {
                screen: 'BottomNav',
                params: {screen: 'PrivateWorks'},
              })
            }>
            PrivateWorks
          </Text>
        </Pressable>
        <Pressable style={styles.drawerItem}>
          <Icon name="file-tray-full" size={25} color="#00257d" />
          <Text
            style={styles.drawerItemText}
            onPress={() =>
              navigation.navigate('MainScreen', {
                screen: 'BottomNav',
                params: {screen: 'Home'},
              })
            }>
            Tax & Vat Services
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Drawer;
