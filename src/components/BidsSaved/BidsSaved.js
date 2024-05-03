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
          <View>
            <Image source={{uri: item.tender.image}} style={styles.image} />
          </View>
          <View style={{padding: 8, flex: 1, flexDirection: 'column'}}>
            <Text
              numberOfLines={2}
              style={{
                color: '#0375B7',
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 8,
                width: '100%',
              }}
              onPress={() => handleDetailNavigation(item.pk)}>
              {item.tender.title}
            </Text>
            <Text numberOfLines={2} style={{color: 'black', fontSize: 15}}>
              {item.tender.public_entry_name}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View style={{flexDirection: 'row'}}>
                <Icon2 name="bag-handle" size={18} color="black" />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  Service:
                </Text>
              </View>
              {item.tender?.project_type?.map((project, index) => (
                <Text
                  key={index}
                  numberOfLines={2}
                  style={{
                    color: '#000',
                    width: '100%',
                    flex: 1,
                  }}>
                  {project.name}
                </Text>
              ))}
            </View>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View style={{flexDirection: 'row'}}>
                <Icon3 name="update" size={18} color="black" />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  Published:
                </Text>
              </View>
              <Text style={styles.CardText}>{item.tender.published_date}</Text>
              <Text style={{color: '#fcc40d', marginLeft: 10}}>
                {item.tender.days_left}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View style={{flexDirection: 'row'}}>
                <Icon2 name="newspaper" size={18} color="black" />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  Source:
                </Text>
              </View>
              <Text style={styles.CardText}>{item.tender.source}</Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View style={{flexDirection: 'row'}}>
                <Icon2 name="location" size={18} color="black" />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  Location:
                </Text>
              </View>
              {item.tender?.district?.map((loc, index) => (
                <Text
                  key={index}
                  numberOfLines={2}
                  style={{
                    color: '#000',
                    width: '100%',
                    flex: 1,
                    marginLeft: 5,
                  }}>
                  {loc.name}
                </Text>
              ))}
            </View>

            <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => handleUnSaveBids(item.tender.pk)}
                style={styles.cusBottom}>
                <Icon2 name="save-outline" size={25} color="#000" />
                <Text
                  style={{
                    color: '#000',
                    fontSize: 15,
                    alignSelf: 'center',
                  }}>
                  Remove Bid
                </Text>
              </TouchableOpacity>
              {/* <Custombutton
                    title="Save Bids"
                    onPress={() => handleSaveBids(item.pk)}
                  /> */}
            </View>
          </View>
        </View>
      )}
      keyExtractor={item => item.tender.pk}
    />
  );
};

export default BidsSaved;
