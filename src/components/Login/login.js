// Login.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';
import styles from './loginStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {login} from '../../reducers/userSlice';
import {getProfile} from '../../reducers/profileSlice';
import {useDispatch, useSelector} from 'react-redux';
import Custombutton from '../../Containers/Button/button';
import Toast from 'react-native-toast-message';
import {completePostLoginNavigation} from '../../utils/navigationHelpers';
import {selectIsLoggedIn} from '../../utils/authAccess';

const Login = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {loading} = useSelector(state => state.users || {});

  const completeLoginNavigation = () => {
    if (hasNavigated) {
      return;
    }
    setHasNavigated(true);
    Keyboard.dismiss();
    completePostLoginNavigation(
      navigation,
      route?.params?.redirectAfterLogin,
    );
  };

  useEffect(() => {
    if (isLoggedIn && !hasNavigated) {
      completeLoginNavigation();
    }
  }, [isLoggedIn, hasNavigated]);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!username.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Username and Password are required',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    try {
      await dispatch(login({username: username.trim(), password})).unwrap();
      dispatch(getProfile());
      setTimeout(() => completeLoginNavigation(), 300);
    } catch (error) {
      // Error is already handled by the Redux slice with Toast
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
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
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
                disabled={loading}>
                <Icon
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={23}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'mailto:info@thekkabazar.com?subject=Password%20Reset%20Request',
                )
              }>
              <Text style={styles.text4}>Forget Password ?</Text>
            </TouchableOpacity>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0375B7" />
                <Text style={styles.loadingText}>Logging in...</Text>
              </View>
            ) : (
              <Custombutton title="Login" onPress={handleLogin} />
            )}

            <View style={styles.lineform} />
            <View style={styles.textContainer}>
              <Text style={styles.text6}>Don't have an account?</Text>
              <Text
                style={styles.text7}
                onPress={() => navigation.navigate('Register')}>
                Register Now
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
