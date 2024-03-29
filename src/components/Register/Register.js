import {View, Text} from 'react-native';
import React from 'react';
import styles from './RegisterStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Register = () => {
  return (
    <View style={styles.container}>
      <View style={styles.Barline}></View>
      <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
        <Icon name="how-to-reg" size={40} color="#0375B7" />
        <Text style={styles.heading}>Personal Information</Text>
      </View>
    </View>
  );
};

export default Register;
