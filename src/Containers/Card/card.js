import {Button, FlatList, RefreshControl, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './cardStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Custombutton from '../Button/button';

const Card = ({title, navigation, data}) => {
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
            <Icon name="calendar-month" size={24} color="black" />
            <Text style={styles.CardText}>
              Published Date : {item.published_date}
            </Text>
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}
            onPress={() => navigation.navigate('HomeDetails', {id: item.pk})}>
            {item.title}
          </Text>
          <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
            {item.description}
          </Text>
          <View style={styles.Cardbodytext}>
            {item.district?.map((location, index) => (
              <Text
                key={index}
                style={{
                  color: '#185CAB',
                  backgroundColor: '#F0F7FF',
                  padding: 15,
                  marginTop: 20,
                  borderRadius: 8,
                  marginLeft: 15,
                }}>
                {location.name}
              </Text>
            ))}

            <Text
              style={{
                color: '#0F9E1D',
                backgroundColor: '#E2FBE4',
                padding: 15,
                marginTop: 20,
                borderRadius: 8,
                marginLeft: 15,
              }}>
              Source: {item.source}
            </Text>
            {item.project_type?.map((project, index) => (
              <Text
                key={index}
                style={{
                  color: '#FF7A00',
                  backgroundColor: '#FFF2F0',
                  padding: 15,
                  marginTop: 20,
                  borderRadius: 8,
                  marginLeft: 15,
                }}>
                {project.name}
              </Text>
            ))}
          </View>
          <View style={styles.CardFooter}>
            <Icon name="file-multiple-outline" size={30} style={styles.Icons} />
            <Custombutton title="Save Bids" />
          </View>
        </View>
      ))}
    </View>
  );
};

export default Card;
