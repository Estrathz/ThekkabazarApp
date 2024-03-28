import {Text, View, Modal, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './cardStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Custombutton from '../Button/button';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {savebid} from '../../reducers/cardSlice';
import {useDispatch} from 'react-redux';
const Card = ({title, navigation, data}) => {
  const [isImageVisible, setIsImageVisible] = useState(null);
  const dispatch = useDispatch();

  const openModal = index => {
    setIsImageVisible(index);
  };

  const closeModal = () => {
    setIsImageVisible(null);
  };

  const handleSaveBids = pk => {
    dispatch(savebid({id: pk}));
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.titletext}
        onPress={() => navigation.navigate('Bazar')}>
        {title}
      </Text>

      {data?.map((item, index) => (
        <View key={index} style={styles.Card}>
          <View style={styles.CardHeading}>
            <Icon name="calendar-month" size={20} color="black" />
            <Text style={styles.CardText}>
              Published Date : {item.published_date}
            </Text>
          </View>
          <Text
            style={{
              color: '#0375B7',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}
            onPress={() => navigation.navigate('HomeDetails', {id: item.pk})}>
            {item.title}
          </Text>
          <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
            {item.public_entry_name}
          </Text>
          <View style={styles.Cardbodytext}>
            {item.district?.map((location, index) => (
              <Text
                key={index}
                style={{
                  color: '#185CAB',
                  backgroundColor: '#F0F7FF',
                  padding: 10,
                  marginTop: 20,
                  borderRadius: 8,
                  marginLeft: 15,
                  alignSelf: 'center',
                }}>
                {location.name}
              </Text>
            ))}

            <Text
              style={{
                color: '#0F9E1D',
                backgroundColor: '#E2FBE4',
                padding: 10,
                marginTop: 20,
                borderRadius: 8,
                marginLeft: 15,
                alignSelf: 'center',
              }}>
              Source: {item.source}
            </Text>
            {item.project_type?.map((project, index) => (
              <Text
                key={index}
                style={{
                  color: '#FF7A00',
                  backgroundColor: '#FFF2F0',
                  padding: 10,
                  marginTop: 20,
                  borderRadius: 8,
                  marginLeft: 15,
                  alignSelf: 'center',
                }}>
                {project.name}
              </Text>
            ))}
          </View>
          <View style={styles.CardFooter}>
            <Icon
              name="file-multiple-outline"
              size={30}
              style={styles.Icons}
              onPress={() => openModal(index)}
            />
            <Custombutton
              title="Save Bids"
              onPress={() => handleSaveBids(item.pk)}
            />
          </View>
          <Modal
            visible={isImageVisible === index}
            animationType="slide"
            transparent={true}>
            <View
              style={{
                backgroundColor: 'white',
                height: '80%',
                bottom: 0,
                right: 0,
                left: 0,
                position: 'absolute',
              }}>
              <TouchableOpacity
                onPress={closeModal}
                style={{alignSelf: 'flex-end', margin: 10}}>
                <Icon2 name="close" size={30} color="black" />
              </TouchableOpacity>
              <Image
                source={{uri: item.image}}
                alt="tenderpicture"
                style={{height: '80%', width: '80%', alignSelf: 'center'}}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </View>
      ))}
    </View>
  );
};

export default Card;
