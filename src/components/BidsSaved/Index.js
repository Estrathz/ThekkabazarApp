import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from './SaveBidsStyle';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import BidsComponent from './BidsSaved';
import InterestComponent from './Interest';

const Index = ({navigation}) => {
  const [active, setActive] = useState('bids');

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', padding: 15}}>
        <Icon2
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{fontSize: 20, marginLeft: 10, color: 'black'}}>
          Saved Bids
        </Text>
      </View>

      {/* <Text style={{fontSize: 20, marginLeft: 10, color: '#1F2937'}}>
        Saved Bids
      </Text> */}
      <View style={styles.bidsCard}>
        <TouchableOpacity
          onPress={() => setActive('bids')}
          style={[styles.tabButton, active === 'bids' && styles.activeTab]}>
          <Text style={styles.tabButtonText}>Saved Bids</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setActive('interest')}
          style={[styles.tabButton, active === 'interest' && styles.activeTab]}>
          <Text style={styles.tabButtonText}>Interested Area</Text>
        </TouchableOpacity> */}
      </View>
      {active === 'bids' && <BidsComponent />}
      {/* {active === 'interest' && <InterestComponent />} */}
    </View>
  );
};

export default Index;
