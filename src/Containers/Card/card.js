import {Button, Text, View} from 'react-native';
import React from 'react';
import styles from './cardStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Custombutton from '../Button/button';

const Card = ({title, data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titletext}>{title}</Text>

      {data?.map((items, index) => (
        <View key={index} style={styles.Card}>
          <View style={styles.CardHeading}>
            <Icon name="calendar-month" size={24} color="black" />
            <Text style={styles.CardText}>
              Published Date : {items.published_date}
            </Text>
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}>
            {items.title}
          </Text>
          <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
            {items.description}
          </Text>
          <View style={styles.Cardbodytext}>
            {items.district?.map((location, index) => (
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
              Source: {items.source}
            </Text>
            {items.project_type?.map((project, index) => (
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
