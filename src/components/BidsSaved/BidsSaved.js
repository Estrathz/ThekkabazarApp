import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './SaveBidsStyle';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {getSavedBids} from '../../reducers/profileSlice';
import {savebid} from '../../reducers/cardSlice';
import {resolveFastImageSource} from '../../utils/tenderImage';
import Toast from 'react-native-toast-message';

const BidsSaved = () => {
  const dispatch = useDispatch();
  const {savedBids, savedBidsLoading, error} = useSelector(
    state => state.userprofile,
  );
  const {isAuthenticated} = useSelector(state => state.users);
  const [filteredBids, setFilteredBids] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getSavedBids());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (savedBids?.data) {
      setFilteredBids(savedBids.data);
    } else {
      setFilteredBids([]);
    }
  }, [savedBids]);

  const handleUnSaveBids = useCallback(async id => {
    setFilteredBids(prevBids =>
      prevBids.filter(item => item?.tender?.pk !== id),
    );

    try {
      await dispatch(savebid({id})).unwrap();
      dispatch(getSavedBids());
    } catch (unsaveError) {
      dispatch(getSavedBids());
      Toast.show({
        type: 'error',
        text1: 'Could not remove bid',
        text2: 'Please try again',
        visibilityTime: 3000,
      });
    }
  }, [dispatch]);

  const renderEmpty = useCallback(() => {
    if (savedBidsLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#0375B7" />
          <Text style={styles.emptyText}>Loading saved bids...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Could not load saved bids</Text>
          <Text style={styles.emptyText}>Please go back and try again.</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon2 name="bookmark-outline" size={48} color="#999" />
        <Text style={styles.emptyTitle}>No saved bids yet</Text>
        <Text style={styles.emptyText}>
          Save tenders from the home screen to see them here.
        </Text>
      </View>
    );
  }, [savedBidsLoading, error]);

  const renderItem = useCallback(({item}) => {
    const tender = item?.tender;

    if (!tender?.pk) {
      return null;
    }

    const imageSource = resolveFastImageSource(tender, FastImage);

    return (
      <View style={styles.Card}>
        <FastImage source={imageSource} style={styles.image} />

        <View style={{padding: 8, flex: 1}}>
          <Text
            numberOfLines={2}
            style={{
              color: '#0375B7',
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 8,
              width: '100%',
            }}>
            {tender.title}
          </Text>
          <Text numberOfLines={2} style={{color: 'black', fontSize: 15}}>
            {tender.public_entry_name}
          </Text>

          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Icon2 name="bag-handle" size={18} color="black" />
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Service:
            </Text>
            <Text
              numberOfLines={1}
              style={{color: '#000', marginLeft: 5, flex: 1}}>
              {(tender?.project_type || [])
                .map(project => project?.name)
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Icon3 name="update" size={18} color="black" />
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Published:
            </Text>
            <Text style={styles.CardText}>{tender.published_date}</Text>
            <Text style={{fontSize: 12, color: 'red', marginLeft: 10}}>
              {tender.days_left}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Icon2 name="newspaper" size={18} color="black" />
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Source:
            </Text>
            <Text style={styles.CardText}>{tender.source}</Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Icon2 name="location" size={18} color="black" />
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Location:
            </Text>
            <Text
              numberOfLines={1}
              style={{color: '#000', marginLeft: 5, flex: 1}}>
              {(tender?.district || [])
                .map(loc => loc?.name)
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleUnSaveBids(tender.pk)}
            style={styles.cusBottom}>
            <Icon2 name="save-outline" size={16} color="red" />
            <Text style={{color: 'red', fontSize: 15, marginLeft: 5}}>
              Remove Bid
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [handleUnSaveBids]);

  return (
    <View style={styles.listWrapper}>
      <FlatList
        data={filteredBids}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.tender?.pk?.toString() || `saved-bid-${index}`
        }
        ListEmptyComponent={renderEmpty}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={[
          styles.listContent,
          filteredBids.length === 0 && styles.listContentEmpty,
        ]}
      />
    </View>
  );
};

export default BidsSaved;
