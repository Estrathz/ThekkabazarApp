import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './userProfileStyle';
import Custombutton from '../../../Containers/Button/button';
import {useDispatch, useSelector} from 'react-redux';
import {getProfile} from '../../../reducers/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.userprofile);
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken();
    dispatch(getProfile({access_token: token}));

    if (error) {
      console.log(error);
    }
  }, [dispatch, token]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setToken(token);
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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: '#0375B7',
              textDecorationLine: 'underline',
              paddingTop: 8,
            }}>
            My Details
          </Text>
          <View style={{width: '30%'}}>
            <Custombutton
              title="Edit"
              onPress={() => navigation.navigate('EditProfile')}
            />
          </View>
        </View>

        <View style={{display: 'flex'}}>
          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>User Name:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.username}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
            }}>
            <Text style={{fontSize: 18, color: 'black'}}>Phone Number:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.phone_number}
            </Text>
          </View>
          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Email:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.email}
            </Text>
          </View>
          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Full Name:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.fullname}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Gender:</Text>
            <Text style={{fontSize: 16, color: '#7F8A99', marginLeft: 13}}>
              {data?.gender}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>District:</Text>
            <Text style={{fontSize: 16, color: '#7F8A99', marginLeft: 13}}>
              {data?.district}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Municipality:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.municipality}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Company Name:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.company_name}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Office Name:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.office_name}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>
              Office Contact Number:
            </Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.office_contact_number}
            </Text>
          </View>

          <View style={{flexDirection: 'row', padding: 10}}>
            <Text style={{fontSize: 18, color: 'black'}}>Website Url:</Text>
            <Text style={{fontSize: 18, color: '#7F8A99', marginLeft: 13}}>
              {data?.website_url}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;
