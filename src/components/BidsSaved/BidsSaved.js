import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import styles from './SaveBidsStyle';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedBids } from '../../reducers/profileSlice';
import { savebid } from '../../reducers/cardSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const BidsSaved = () => {
  const dispatch = useDispatch();
  const { savedBids } = useSelector(state => state.userprofile);
  const { isAuthenticated } = useSelector(state => state.users);
  const [filteredBids, setFilteredBids] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getSavedBids());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (savedBids?.data) {
      setFilteredBids(savedBids.data);
    }
  }, [savedBids]);



  const handleUnSaveBids = async id => {
    dispatch(savebid({ id }));
    Toast.show({
      type: 'success',
      text1: 'Bid Unsaved Successfully',
    });

    // Remove the bid locally without waiting for API refresh
    setFilteredBids(prevBids => prevBids.filter(item => item.tender.pk !== id));
  };

  const renderHeader = () => (
    <Text style={styles.title}>Saved Bids</Text>
  );

  const renderItem = ({ item }) => (
    <View style={styles.Card}>
      {/* Image Section */}
      <Image source={{ uri: item.tender.image }} style={styles.image} />

      {/* Details Section */}
      <View style={{ padding: 8, flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{
            color: '#0375B7',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 8,
            width: '100%',
          }}
        >
          {item.tender.title}
        </Text>
        <Text numberOfLines={2} style={{ color: 'black', fontSize: 15 }}>
          {item.tender.public_entry_name}
        </Text>

        {/* Services */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Icon2 name="bag-handle" size={18} color="black" />
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>
            Service:
          </Text>
          <Text numberOfLines={1} style={{ color: '#000', marginLeft: 5, flex: 1 }}>
            {item.tender?.project_type?.map(project => project.name).join(', ')}
          </Text>
        </View>

        {/* Published Date */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Icon3 name="update" size={18} color="black" />
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>
            Published:
          </Text>
          <Text style={styles.CardText}>{item.tender.published_date}</Text>
          <Text style={{ fontSize: 12, color: 'red', marginLeft: 10 }}>
            {item.tender.days_left}
          </Text>
        </View>

        {/* Source */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Icon2 name="newspaper" size={18} color="black" />
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>
            Source:
          </Text>
          <Text style={styles.CardText}>{item.tender.source}</Text>
        </View>

        {/* Location */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Icon2 name="location" size={18} color="black" />
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>
            Location:
          </Text>
          <Text numberOfLines={1} style={{ color: '#000', marginLeft: 5, flex: 1 }}>
            {item.tender?.district?.map(loc => loc.name).join(', ')}
          </Text>
        </View>

        {/* Unsave Button */}
        <TouchableOpacity
          onPress={() => handleUnSaveBids(item.tender.pk)}
          style={styles.cusBottom}
        >
          <Icon2 name="save-outline" size={16} color="red" />
          <Text style={{ color: 'red', fontSize: 15, marginLeft: 5 }}>Remove Bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={filteredBids}
        renderItem={renderItem}
        keyExtractor={item => item.tender.pk.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default BidsSaved;
