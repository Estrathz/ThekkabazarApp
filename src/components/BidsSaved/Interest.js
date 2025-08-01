import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './SaveBidsStyle';
import Custombutton from '../../Containers/Button/button';
import Icon from 'react-native-vector-icons/Octicons';
import {fetchInterestData} from '../../reducers/interestSlice';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Interest = () => {
  const dispatch = useDispatch();
  const {interestdata, interesterror} = useSelector(state => state.interest);
  const { isAuthenticated } = useSelector(state => state.users);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchInterestData());
    }

    if (interesterror) {
      console.log(interesterror);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    console.log(interestdata);
  });



  return (
    <View style={styles.container}>
      <View style={styles.interestCard}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.interestText}>Health</Text>
          <Custombutton title="Edit" />
        </View>
        {interestdata?.project_type?.map((item, index) => (
          <View
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 5,
            }}>
            <Icon
              name="dot-fill"
              size={16}
              color="black"
              style={{alignSelf: 'center'}}
            />
            <Text style={{marginLeft: 5, color: 'black', fontSize: 18}}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Interest;
