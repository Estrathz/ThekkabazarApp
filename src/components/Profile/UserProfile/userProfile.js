import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './userProfileStyle';
import Custombutton from '../../../Containers/Button/button';
import {useDispatch, useSelector} from 'react-redux';
import {getProfile} from '../../../reducers/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  CommonActions,
  useRoute,
} from '@react-navigation/native';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.userprofile);
  const [token, setToken] = useState('');
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      getToken();
      // dispatch(getProfile({access_token: token}));

      if (error) {
        console.log(error);
      }
    }, []),
  );

  useEffect(() => {
    if (route.params && route.params.profileUpdated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'UserProfile'}],
        }),
      );
    }
  }, [route.params]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setToken(token);
      dispatch(getProfile({access_token: token}));
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.Profilecontainer}>
      <View style={{display: 'flex', flexDirection: 'row', padding: 15}}>
        <Icon2
          name="arrow-back-ios-new"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{fontSize: 24, marginLeft: 10, color: 'black'}}>
          Profile Sections
        </Text>
      </View>
      <Text
        style={{fontSize: 20, marginLeft: 10, color: 'black', marginTop: 10}}>
        Saved Bids and interested area.
      </Text>

      <View style={styles.HeaderCard}>
  <View style={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }}>
    <Text style={{
      fontSize: 20,
      color: '#0375B7',
      textDecorationLine: 'underline',
      paddingTop: 8,
    }}>
      My Details
    </Text>
    <View style={{ width: '30%' }}>
      <Custombutton
        title="Edit"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </View>
  </View>

    <View style={{ display: 'flex', padding: 10 }}>
      {/* Dynamic Container for Info */}
      {[
        { label: "Full Name:", value: data?.fullname },
        { label: "Phone Number:", value: data?.phone_number },
        { label: "Email:", value: data?.email },
        { label: "Company Name:", value: data?.company_name },
        { label: "User Name:", value: data?.username },
      ].map((item, index) => (
        <View key={index} style={{
          flexDirection: 'row',
          marginBottom: 5,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 18,
            color: 'black',
            flex: 1, // takes as much space as needed
          }}>
            {item.label}
          </Text>
          <Text style={{
            fontSize: 18,
            color: '#7F8A99',
            flex: 2, // takes twice the space of the label
            marginLeft: 13,
            numberOfLines: 1, // restricts text to a single line
            ellipsizeMode: 'tail' // adds "..." at the end if the text is too long
          }}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
</View>
    </View>
  );
};

export default UserProfile;
