import {View, Text, TextInput, ScrollView, ActivityIndicator, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, SafeAreaView} from 'react-native';
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
    // Dismiss keyboard immediately when registration starts
    Keyboard.dismiss();
    
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
      
      // Dismiss keyboard before navigation
      Keyboard.dismiss();
      
      // Registration successful, navigate to login
      navigation.navigate('Login');
    } catch (error) {
      console.log('Registration error:', error);
      // Error is already handled by the Redux slice with Toast
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.registerForm}>
              <View style={styles.headerContainer}>
                <Icon name="how-to-reg" size={32} color="#0375B7" />
                <Text style={styles.titletext}>Create Account</Text>
              </View>
              
              <Text style={styles.subtitle}>Please fill in your details to register</Text>

              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Icon name="account-circle" size={20} color="#0375B7" />
                  <Text style={styles.sectionTitle}>Account Details</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={'#737373'}
                  value={username}
                  onChangeText={text => setUsername(text)}
                  editable={!loading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={'#737373'}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  editable={!loading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={'#737373'}
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  editable={!loading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Icon name="person" size={20} color="#0375B7" />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={'#737373'}
                  value={fullname}
                  onChangeText={text => setFullname(text)}
                  editable={!loading}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={'#737373'}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  editable={!loading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor={'#737373'}
                  value={phone}
                  onChangeText={text => setPhone(text)}
                  editable={!loading}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  placeholderTextColor={'#737373'}
                  value={companyName}
                  onChangeText={text => setCompanyName(text)}
                  editable={!loading}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0375B7" />
                  <Text style={styles.loadingText}>Creating account...</Text>
                </View>
              ) : (
                <Custombutton title="Create Account" onPress={handleRegister} />
              )}

              <View style={styles.lineform}></View>
              <View style={styles.textContainer}>
                <Text style={styles.text6}>Already have an account?</Text>
                <Text
                  style={styles.text7}
                  onPress={() => navigation.navigate('Login')}>
                  Login Now
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
