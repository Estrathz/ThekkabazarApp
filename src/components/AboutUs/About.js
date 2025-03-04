import { View, Text, Image, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './AboutStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { aboutUsdata, aboutUsform } from '../../reducers/aboutSlice';
import { useDispatch, useSelector } from 'react-redux';
import Custombutton from '../../Containers/Button/button';
import Toast from 'react-native-toast-message';
import he from 'he';

const About = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.about);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    dispatch(aboutUsdata());
    if (error) {
      console.log(error);
    }
  }, [dispatch, error]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmitMessage = () => {
    const { name, email, phone_number, subject, message } = formData;
    if (!name || !email || !phone_number || !subject || !message) {
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    dispatch(aboutUsform(formData));
    setFormData({ name: '', email: '', phone_number: '', subject: '', message: '' });
  };

  const removeHtmlTags = (text) => (typeof text === 'string' ? text.replace(/<[^>]*>/g, '') : '');
  const decodeHtmlEntities = (text) => (typeof text === 'string' ? he.decode(text) : '');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-back" size={30} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>About Us</Text>
      </View>

      <Text style={styles.title}>Know About Us</Text>

      {data?.about_us?.map((item, index) => (
        <View key={index} style={styles.aboutSection}>
          <Text style={styles.quotation}>{item.quotation}</Text>
          <Text style={styles.description}>
  {removeHtmlTags(item.description)}
</Text>
        </View>
      ))}

      <View style={styles.serviceContainer}>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <Text style={styles.serviceDescription}>
          We serve: Company Registration, Trademark Registration, Accounting & Taxation
        </Text>
        {data?.services?.map((item, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.quotation}>{decodeHtmlEntities(item.quotation)}</Text>
            <Text style={styles.serviceDescription}>{decodeHtmlEntities(removeHtmlTags(item.description))}</Text>
          </View>
        ))}
      </View>

      <View style={styles.teamContainer}>
        {data?.team_types?.map((team, index) => (
          <View key={index}>
            <Text style={styles.teamTitle}>{team.name}</Text>
            <View style={styles.teamMembers}>
              {team.myteam.map((member, index) => (
                <View key={index} style={styles.teamMember}>
                <Image 
                  source={{ uri: member.image }} 
                  style={styles.teamImage} 
                  alt="team" 
                />
                
              </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.Formcontainer}>
          <Text style={styles.contactTitle}>Get In Touch</Text>
          <Text style={styles.contactSubtitle}>Say something to start a message!</Text>

          {['name', 'email', 'subject', 'phone_number', 'message'].map((field, index) => (
            <TextInput
              key={index}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
              placeholderTextColor="black"
              style={styles.input}
              value={formData[field]}
              onChangeText={text => handleInputChange(field, text)}
              multiline={field === 'message'}
              numberOfLines={field === 'message' ? 3 : 1}
            />
          ))}

          <Custombutton title="Send Message" onPress={handleSubmitMessage} />
        </View>
      </View>
    </ScrollView>
  );
};

export default About;