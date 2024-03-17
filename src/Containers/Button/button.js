import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './buttonStyle';

const Custombutton = ({title, onClick}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.buttonContainer}
      onPress={() => {
        onClick();
      }}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Custombutton;
