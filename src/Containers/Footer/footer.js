import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import styles from './footerStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomNavigationBar = ({navigation}) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const iconSize = dimensions.width * 0.06;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={iconSize} color="black" />
        <Text style={styles.TextNav}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Result')}>
        <Icon name="newspaper" size={iconSize} color="black" />
        <Text style={styles.TextNav}>Result</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Bazar')}>
        <Icon name="event" size={iconSize} color="white" style={styles.bazarIcon} />
        <Text style={styles.TextNav2}>Bazar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('PrivateWork')}>
        <Icon name="sticky-note-2" size={iconSize} color="black" />
        <Text style={styles.TextNav}>Private Work</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('More')}>
        <Icon name="menu" size={iconSize} color="black" />
        <Text style={styles.TextNav}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigationBar;
