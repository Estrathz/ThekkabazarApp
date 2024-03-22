import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import styles from './resultdetailStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useDispatch, useSelector} from 'react-redux';
import {fetchOneResultData} from '../../../reducers/resultSlice';

const Detail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {one, error} = useSelector(state => state.result);

  useEffect(() => {
    // const {id} = route.params;
    console.log(route.params, 'route');
    const id = route.params.id;

    dispatch(fetchOneResultData({tenderId: id}));
    if (error) {
      console.log(error);
    }
  }, [dispatch, error]);

  useEffect(() => {
    console.log('sadasdasd', one);
  }, []);

  const items = one;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="arrow-back"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={{color: 'black', fontSize: 24, marginLeft: 10}}>
            Details
          </Text>
        </View>

        <View style={styles.detailCardContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="calendar-month" size={30} color="red" />
              <Text
                style={{
                  color: '#808080',
                  fontSize: 18,
                  marginLeft: 8,
                  marginTop: 4,
                }}>
                Published Date: {items.published_date}
              </Text>
            </View>
            <Icon name="file-copy" size={30} color="#0375B7" />
          </View>
          <View style={styles.Cardbodytext}>
            {items?.district?.map((location, index) => (
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
            {items?.project_type?.map((project, index) => (
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

          {/* {items?.tender_awarded_to?.map((tender, index) => (
            <Text key={index} style={{color: 'black', fontSize: 15}}>
              {tender.awarded_to}
            </Text>
          ))} */}

          <Text
            style={{
              color: 'black',
              fontSize: 20,
              marginTop: 15,
              fontWeight: 'bold',
            }}>
            Documents
          </Text>
          <Image
            source={{uri: items.image}}
            style={{flex: 1, height: 200, width: '100%', marginTop: 10}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;
