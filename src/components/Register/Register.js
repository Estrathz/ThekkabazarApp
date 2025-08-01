import {View, Text, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import styles from './RegisterStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Custombutton from '../../Containers/Button/button';
import {register} from '../../reducers/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.users);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !password ||
      !confirmPassword ||
      !fullname.trim() ||
      !phone.trim() ||
      !companyName.trim() ||
      !email.trim()
    ) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all the fields',
        visibilityTime: 3000,
        position: 'bottom',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
        visibilityTime: 3000,
        position: 'bottom',
      });
      return;
    }

    try {
      const result = await dispatch(
        register({
          username: username.trim(),
          password: password,
          password2: confirmPassword,
          fullname: fullname.trim(),
          phone_number: phone.trim(),
          company_name: companyName.trim(),
          email: email.trim(),
        }),
      ).unwrap();
      
      // Registration successful, navigate to login
      navigation.navigate('Login');
    } catch (error) {
      console.log('Registration error:', error);
      // Error is already handled by the Redux slice with Toast
    }
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
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'black'}
          value={password}
          onChangeText={text => setPassword(text)}
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={'black'}
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
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
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={'black'}
          value={phone}
          onChangeText={text => setPhone(text)}
          editable={!loading}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={'black'}
          value={fullname}
          onChangeText={text => setFullname(text)}
          editable={!loading}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          placeholderTextColor={'black'}
          value={companyName}
          onChangeText={text => setCompanyName(text)}
          editable={!loading}
          autoCapitalize="words"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0375B7" />
          <Text style={styles.loadingText}>Creating account...</Text>
        </View>
      ) : (
        <Custombutton title="Register" onPress={handleRegister} />
      )}
    </ScrollView>
  );
};

export default Register;
