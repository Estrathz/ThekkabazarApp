import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './SaveBidsStyle';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import BidsComponent from './BidsSaved';
import useRequireAuth from '../../hooks/useRequireAuth';

const Index = ({navigation, route}) => {
  const isLoggedIn = useRequireAuth(navigation, route);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon2 name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Bids</Text>
      </View>
      <BidsComponent />
    </View>
  );
};

export default Index;
