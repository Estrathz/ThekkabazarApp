import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './buttonStyle';

const Custombutton = ({title, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.buttonContainer}
      onPress={() => {
        onPress();
      }}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Custombutton;
