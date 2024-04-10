import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './SaveBidsStyle';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Custombutton from '../../Containers/Button/button';
import {useDispatch, useSelector} from 'react-redux';
import {getSavedBids} from '../../reducers/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {savebid} from '../../reducers/cardSlice';
import Toast from 'react-native-toast-message';

const BidsSaved = () => {
  const dispatch = useDispatch();
  const {savedBids, error} = useSelector(state => state.userprofile);
  const [token, setToken] = useState('');
  const [isImageVisible, setIsImageVisible] = useState(null);
  const [unsavedBidId, setUnsavedBidId] = useState(null);

  useEffect(() => {
    getToken();
    dispatch(getSavedBids({access_token: token}));
  }, [dispatch, token]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setToken(token);
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  const openImageModal = index => {
    setIsImageVisible(index);
  };

  const closeImageModal = () => {
    setIsImageVisible(null);
  };

  const handleUnSaveBids = async id => {
    dispatch(savebid({id: id, access_token: token}));
    setUnsavedBidId(id);
    Toast.show({
      type: 'success',
      text1: 'Bid Unsaved Successfully',
    });
  };

  return (
    <FlatList
      data={savedBids?.data?.filter(item => item.tender.pk !== unsavedBidId)}
      renderItem={({item, index}) => (
        <View key={index} style={styles.Card}>
          <View style={styles.CardHeading}>
            <Icon3 name="calendar-month" size={20} color="black" />
            <Text style={styles.CardText}>
              Published Date : {item.tender.published_date}
            </Text>
          </View>
          <Text
            style={{
              color: '#0375B7',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}>
            {item.tender.title}
          </Text>
          <Text style={{color: 'black', fontSize: 15, marginTop: 8}}>
            {item.tender.public_entry_name}
          </Text>
          <View style={styles.Cardbodytext}>
            {item.tender.district?.map((location, index) => (
              <Text
                key={index}
                style={{
                  color: '#185CAB',
                  backgroundColor: '#F0F7FF',
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 8,
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
                marginTop: 10,
                borderRadius: 8,
                marginLeft: 8,
                alignSelf: 'center',
              }}>
              Source: {item.tender.source}
            </Text>
            {item.tender.project_type?.map((project, index) => (
              <Text
                key={index}
                style={{
                  color: '#FF7A00',
                  backgroundColor: '#FFF2F0',
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 8,
                  marginLeft: 8,
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
              title="UnSave Bids"
              onPress={() => handleUnSaveBids(item.tender.pk)}
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
                source={{uri: item.tender.image}}
                alt="tenderpicture"
                style={{height: '80%', width: '80%', alignSelf: 'center'}}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </View>
      )}
      keyExtractor={item => item.tender.pk}
    />
  );
};

export default BidsSaved;
