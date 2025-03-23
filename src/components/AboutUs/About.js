import { View, Text, Image, ScrollView, TextInput, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './AboutStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { aboutUsdata, aboutUsform } from '../../reducers/aboutSlice';
import { useDispatch, useSelector } from 'react-redux';
import Custombutton from '../../Containers/Button/button';
import Toast from 'react-native-toast-message';
import he from 'he';
import RenderHtml from 'react-native-render-html';

const { width } = Dimensions.get('window');

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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load about us data',
        visibilityTime: 3000,
        autoHide: true,
      });
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

  const renderContent = (htmlContent) => {
    if (!htmlContent) return null;
    
    // Extract image URL from the HTML content
    const imgMatch = htmlContent.match(/src="([^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : null;
    
    // Remove the image tag from the content
    const textContent = htmlContent.replace(/<img[^>]*>/g, '').trim();
    
    return (
      <View style={styles.descriptionContainer}>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.descriptionImage}
            resizeMode="contain"
          />
        )}
        <Text style={styles.descriptionText}>
          {decodeHtmlEntities(removeHtmlTags(textContent))}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-back" size={30} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>About Us</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {data?.about_us?.map((item, index) => (
          <View key={index} style={styles.aboutSection}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.aboutImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.quotation}>{decodeHtmlEntities(item.quotation)}</Text>
            {renderContent(item.description)}
          </View>
        ))}

        <View style={styles.serviceContainer}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          {data?.team_types?.map((team, index) => (
            <View key={index} style={styles.teamSection}>
              <Text style={styles.teamTitle}>{team.name}</Text>
              <View style={styles.teamMembers}>
                {team.myteam.map((member, memberIndex) => (
                  <View key={memberIndex} style={styles.teamMember}>
                    <Image 
                      source={{ uri: member.image }} 
                      style={styles.teamImage} 
                    />
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberPosition}>{member.position}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.contactTitle}>Get In Touch</Text>
          <Text style={styles.contactSubtitle}>Say something to start a message!</Text>

          {['name', 'email', 'subject', 'phone_number', 'message'].map((field, index) => (
            <TextInput
              key={index}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
              placeholderTextColor="#666"
              style={styles.input}
              value={formData[field]}
              onChangeText={text => handleInputChange(field, text)}
              multiline={field === 'message'}
              numberOfLines={field === 'message' ? 4 : 1}
            />
          ))}

          <Custombutton 
            title="Send Message" 
            onPress={handleSubmitMessage}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default About;