// Login.js
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import styles from './loginStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {login} from '../../reducers/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import Custombutton from '../../Containers/Button/button';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {isAuthenticated, error} = useSelector(state => state.users);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigation.navigate('Home');
  //   }
  //   if (error) {
  //     console.log(error);
  //   }
  // }, [dispatch, isAuthenticated, error]);

  const handleLogin = () => {
    console.log('Logging in with:', username, password);
    // navigation.navigate('Home');
    navigation.navigate('MainScreen', {
      screen: 'BottomNav',
      params: {screen: 'Home'},
    });
    // dispatch(login({username, password}));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/loginPic.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.loginForm}>
        <Text style={styles.titletext}>Login</Text>
        <Text style={styles.text}>Please enter your details</Text>

        <Text style={styles.text2}>Email or Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={text => setUsername(text)}
          value={username}
          placeholderTextColor={'#000000'}
        />

        <Text style={styles.text3}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
            placeholderTextColor={'#000000'}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={23}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text4}>Forget Password ?</Text>
        {/* <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity> */}
        <Custombutton title="Login" onPress={handleLogin} />

        <View style={styles.lineform}></View>
        <View style={styles.textContainer}>
          <Text style={styles.text6}>Don't have an account?</Text>
          <Text style={styles.text7}>Register Now</Text>
        </View>
      </View>
    </View>
  );
};

export default Login;
