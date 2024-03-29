import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './SaveBidsStyle';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Custombutton from '../../Containers/Button/button';

const BidsSaved = () => {
  return (
    <FlatList
      data=""
      renderItem={({item, index}) => (
        <View key={index} style={styles.Card}>
          <View style={styles.CardHeading}>
            <Icon3 name="calendar-month" size={20} color="black" />
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
            <Icon3
              name="file-multiple-outline"
              size={30}
              style={styles.Icons}
              onPress={() => openImageModal(index)}
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
                onPress={closeImageModal}
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
      )}
      keyExtractor={item => item.pk}
    />
  );
};

export default BidsSaved;
