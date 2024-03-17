import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from './footerStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomNavigationBar = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={25} color="black" />
        <Text style={styles.TextNav}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Result')}>
        <Icon name="newspaper" size={25} color="black" />
        <Text style={styles.TextNav}>Result</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Bazar')}>
        <Icon name="event" size={25} color="black" style={styles.bazarIcon} />
        <Text style={styles.TextNav2}>Bazar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('PrivateWork')}>
        <Icon name="sticky-note-2" size={25} color="black" />
        <Text style={styles.TextNav}>Private</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('More')}>
        <Icon name="menu" size={25} color="black" />
        <Text style={styles.TextNav}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigationBar;
