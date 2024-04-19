import {View, Text, Image, ScrollView, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './AboutStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {aboutUsdata, aboutUsform} from '../../reducers/aboutSlice';
import {useDispatch, useSelector} from 'react-redux';
import Custombutton from '../../Containers/Button/button';
import Toast from 'react-native-toast-message';

const About = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.about);
  const removeTags = str => str.replace(/<[^>]*>?/gm, '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(aboutUsdata());

    if (error) {
      console.log(error);
    }
  }, [dispatch]);

  const handleSubmitMessage = () => {
    if (
      name === '' ||
      email === '' ||
      phone_number === '' ||
      subject === '' ||
      message === ''
    ) {
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    dispatch(
      aboutUsform({
        name: name,
        email: email,
        phone_number: phone_number,
        subject: subject,
        message: message,
      }),
    );
    setEmail('');
    setName('');
    setPhone_number('');
    setSubject('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', padding: 10}}>
        <Icon
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{color: 'black', fontSize: 24, marginLeft: 10}}>
          About Us
        </Text>
      </View>

      <Text
        style={{
          color: '#0375B7',
          fontSize: 24,
          alignSelf: 'center',
          marginTop: 20,
        }}>
        Know About Us
      </Text>

      {data?.about_us?.map((items, index) => (
        <View
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
            {items.quotation}
          </Text>
          <Text style={{color: 'black', fontSize: 16, padding: 20, textAlign: 'justify'}}>
            {removeTags(items.description)}
          </Text>
        </View>
      ))}

      <View style={styles.serviceContainer}>
        <Text
          style={{
            color: 'black',
            fontSize: 24,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          What We Offer
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            alignSelf: 'center',
          }}>
          We serve: Company RegistrationTrademark RegistrationAccounting &
          Taxation
        </Text>
        {data?.services?.map((items, index) => (
          <View
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
              {items.quotation}
            </Text>
            <Text style={{color: 'black', fontSize: 20}}>
              {removeTags(items.description)}
            </Text>
          </View>
        ))}
      </View>

      <View style={{flex: 1, marginTop: 20, padding: 10}}>
        {data?.team_types?.map((team, index) => (
          <View key={index}>
            <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
              {team.name}
            </Text>
            <View
              style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                flex: 1,
                flexWrap: 'wrap',
              }}>
              {team.myteam.map((items, index) => (
                <View
                  key={index}
                  style={{
                    width: '40%',
                    marginTop: 10,
                  }}>
                  <Image
                    //   source={{uri: items.image}}
                    source={require('../../assets/group.png')}
                    style={{height: 80, width: '60%', aspectRatio: 1.5}}
                    alt="team"
                  />
                  <Text
                    style={{color: 'black', fontSize: 20, alignSelf: 'center'}}>
                    {items.name}
                  </Text>
                  <Text
                    style={{color: 'black', fontSize: 20, alignSelf: 'center'}}>
                    {items.position}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.Formcontainer}>
          <Text style={{color: '#0375B7', fontSize: 24, alignSelf: 'center'}}>
            Get In Touch
          </Text>
          <Text style={{color: 'black', fontSize: 16, alignSelf: 'center'}}>
            Say something to start a message!
          </Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="black"
            style={{
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
              marginBottom: 10,
              backgroundColor: '#F9FAFB',
              color: 'black',
            }}
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="black"
            style={{
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              backgroundColor: '#F9FAFB',
              color: 'black',
            }}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            placeholder="Subject"
            placeholderTextColor="black"
            style={{
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              backgroundColor: '#F9FAFB',
              color: 'black',
            }}
            value={subject}
            onChangeText={text => setSubject(text)}
          />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="black"
            style={{
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              color: 'black',
              backgroundColor: '#F9FAFB',
            }}
            value={phone_number}
            onChangeText={text => setPhone_number(text)}
          />

          <TextInput
            placeholder="Message"
            placeholderTextColor="black"
            numberOfLines={3}
            multiline={true}
            style={{
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              backgroundColor: '#F9FAFB',
              color: 'black',
            }}
            value={message}
            onChangeText={text => setMessage(text)}
          />
          <Custombutton
            title="Send Message"
            onPress={() => handleSubmitMessage()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default About;
