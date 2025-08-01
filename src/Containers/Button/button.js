import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './buttonStyle';

const Custombutton = ({title, onPress, style, textStyle, disabled, ...props}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.buttonContainer, style]}
      onPress={() => {
        onPress();
      }}
      disabled={disabled}
      {...props}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Custombutton;
