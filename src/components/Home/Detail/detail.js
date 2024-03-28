import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import styles from './detailStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useDispatch, useSelector} from 'react-redux';
import {fetchOneTenderData} from '../../../reducers/cardSlice';
import Custombutton from '../../../Containers/Button/button';

const Detail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {one, error} = useSelector(state => state.card);

  useEffect(() => {
    const id = route.params.id;

    dispatch(fetchOneTenderData({tenderId: id}));
    if (error) {
      console.log(error);
    }
  }, [dispatch, error]);

  const items = one;

  if (!items || !items.image) {
    return null;
  }

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
            <Text
              style={{
                display: 'flex',
                color: '#000',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 15,
              }}>
              Tender Details
            </Text>
            <Icon name="file-copy" size={25} color="#0375B7" />
          </View>

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
            alt="pitcure"
          />

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Custombutton title="Download Brochure" onPress={() => {}} />
          </View>

          <View style={styles.detailContainer}>
            <Text style={{color: '#bf0a7f', fontSize: 18}}>
              <Text style={{fontWeight: 'bold'}}>Tender Title: </Text>
              {items.title}
            </Text>
            <Text style={{color: '#bf0a7f', fontSize: 18, marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>Public Entity Name: </Text>
              {items.public_entry_name}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Icon name="calendar-month" size={23} color="red" />
              <Text
                style={{
                  color: '#bf0a7f',
                  fontSize: 16,
                  marginLeft: 8,
                  marginTop: 4,
                }}>
                Published Date: {items.published_date}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Icon name="calendar-month" size={23} color="red" />
              <Text
                style={{
                  color: '#bf0a7f',
                  fontSize: 16,
                  marginLeft: 8,
                  marginTop: 4,
                }}>
                Last Date To Apply: {items.last_date_to_apply}
              </Text>
            </View>

            <Text
              style={{
                color: '#0F9E1D',
                marginTop: 10,
                fontSize: 18,
              }}>
              Source: {items.source}
            </Text>

            {items?.organization_sector?.map((org, index) => (
              <Text
                key={index}
                style={{
                  color: '#0F9E1D',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                OrganizationSector: {org.name}
              </Text>
            ))}

            {items?.district?.map((location, index) => (
              <Text
                key={index}
                style={{
                  color: '#0F9E1D',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                Location: {location.name}
              </Text>
            ))}

            {items?.project_type?.map((project, index) => (
              <Text
                key={index}
                style={{
                  color: '#0F9E1D',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                Project Type: {project.name}
              </Text>
            ))}

            {items?.procurement_type?.map((pro, index) => (
              <Text
                key={index}
                style={{
                  color: '#bf0a7f',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                Procurement Type: {pro.name}
              </Text>
            ))}

            <Text
              style={{
                color: 'black',
                fontSize: 19,
                fontWeight: 'bold',
                marginTop: 20,
              }}>
              Works
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;
