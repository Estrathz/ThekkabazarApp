import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import styles from './noticeStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {fetchNoticeData} from '../../reducers/noticeSlice';
import {useDispatch, useSelector} from 'react-redux';

const Notice = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.notice);

  useEffect(() => {
    dispatch(fetchNoticeData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', padding: 15}}>
        <Icon2
          name="arrow-back-ios-new"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{fontSize: 24, marginLeft: 10, color: 'black'}}>
          Notice
        </Text>
      </View>

      <View style={styles.Bodycontainer}>
        <View style={{display: 'flex', flexDirection: 'row', padding: 15}}>
          <Icon name="link-variant" size={30} color="black" />
          <Text style={{fontSize: 24, marginLeft: 10, color: 'black'}}>
            Notice
          </Text>
        </View>
        {data?.map((items, index) => (
          <View key={index} style={styles.Card}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Icon
                name="checkbox-blank-circle"
                size={14}
                color="black"
                style={{marginTop: 13, marginRight: 10}}
              />
              <Text style={styles.noticeText}>{items.notice}</Text>
            </View>
            <Text style={styles.noticeBodyText}>{items.tender_name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Notice;
