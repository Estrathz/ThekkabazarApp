import {View, Text, Image, TextInput, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import styles from './homeStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '../../Containers/Slider/slider';
import Card from '../../Containers/Card/card';
import {fetchTenderListData} from '../../reducers/cardSlice';
import {useDispatch, useSelector} from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.card);

  useEffect(() => {
    dispatch(fetchTenderListData());
    // dispatch(fetchDropdownData());

    if (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <ScrollView style={styles.HomeContainer}>
      <View style={styles.navcontainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.iconsContainer}>
          <Icon
            name="notifications-outline"
            size={28}
            color="black"
            style={styles.icon}
          />
          <Icon name="person" size={28} color="black" style={styles.icon} />
        </View>
      </View>
      <View style={styles.SearchContainer}>
        <Icon
          name="menu"
          size={35}
          color="#0375B7"
          style={{paddingLeft: 10, paddingRight: 10, top: 5}}
        />
        <View style={styles.searchSection}>
          <Icon
            style={styles.searchIcon}
            name="search"
            size={20}
            color="#000"
          />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            // onChangeText={searchString => this.setState({searchString})}
            underlineColorAndroid="transparent"
            placeholderTextColor={'#424242'}
          />
        </View>
      </View>
      <View style={{padding: 0}}>
        <Slider />
      </View>
      <View style={{flex: 1, padding: 10}}>
        <Card title={'All Bids'} data={data} />
      </View>
    </ScrollView>
  );
};

export default Home;
