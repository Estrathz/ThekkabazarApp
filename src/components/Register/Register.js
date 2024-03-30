import {View, Text, TextInput, ScrollView} from 'react-native';
import React, {useState} from 'react';
import styles from './RegisterStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Custombutton from '../../Containers/Button/button';
import {register} from '../../reducers/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const handleRegister = () => {
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !fullname ||
      !phone ||
      !companyName ||
      !email
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all the fields',
        visibilityTime: 2000,
        position: 'bottom',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        visibilityTime: 2000,
        position: 'bottom',
      });
      return;
    }
    dispatch(
      register({
        username: username,
        password: password,
        password2: confirmPassword,
        fullname: fullname,
        phone_number: phone,
        company_name: companyName,
        email: email,
      }),
    )
      .then(navigation.navigate('Login'))
      .catch(error => console.log(error));
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.Barline}></View>
      <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
        <Icon name="how-to-reg" size={40} color="#0375B7" />
        <Text style={styles.heading}>Personal Information</Text>
      </View>

      <Text style={styles.loginHeading}>Login Details</Text>
      <View style={styles.loginCard}>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor={'black'}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'black'}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={'black'}
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
        />
      </View>

      <Text style={styles.loginHeading}>Profile Details</Text>
      <View style={styles.loginCard}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={'black'}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={'black'}
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={'black'}
          value={fullname}
          onChangeText={text => setFullname(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          placeholderTextColor={'black'}
          value={companyName}
          onChangeText={text => setCompanyName(text)}
        />
      </View>

      <Custombutton title="Register" onPress={() => handleRegister()} />
    </ScrollView>
  );
};

export default Register;
