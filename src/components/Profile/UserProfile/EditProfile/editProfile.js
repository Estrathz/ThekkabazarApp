import {View, Text, TextInput} from 'react-native';
import React from 'react';
import styles from './editProfileStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Custombutton from '../../../../Containers/Button/button';

const EditProfile = ({navigation}) => {
  const {data, error} = useSelector(state => state.userprofile);

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', padding: 15}}>
        <Icon
          name="arrow-back-ios-new"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{fontSize: 24, marginLeft: 10, color: 'black'}}>
          Edit Profile
        </Text>
      </View>

      <View style={styles.Cardcontainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Full Name:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.fullname}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Phone Number:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.phone_number}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Gender:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.gender}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Company Name:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.company_name}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Office Name:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.office_name}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            office Contact Number:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.office_contact_number}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Website Url:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.website_url}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            District:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.district}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>
            Municipality:
          </Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor={'black'}
            style={styles.TextInput}
            value={data?.municipality}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Custombutton title="Update Profile" />
        </View>
      </View>
    </View>
  );
};

export default EditProfile;
