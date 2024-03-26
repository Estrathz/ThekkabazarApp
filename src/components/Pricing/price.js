import {View, Text, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import styles from './priceStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPriceData} from '../../reducers/priceSlice';
import Custombutton from '../../Containers/Button/button';

const Price = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, status, error} = useSelector(state => state.price);

  useEffect(() => {
    dispatch(fetchPriceData());
  }, [dispatch]);

  return (
    <ScrollView style={styles.PriceContainer}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <Icon
          name="arrow-back-ios-new"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={{color: 'black', fontSize: 20, marginLeft: 15}}>
          Upgrade Plans
        </Text>
      </View>

      <Text style={styles.PriceTitle}>
        We offer great price<Text style={{color: '#0375B7'}}> plan </Text>for
        the application
      </Text>
      {data?.plans?.map((items, index) => (
        <View key={index} style={styles.CardContainer}>
          <View
            style={[
              styles.CardHeader,
              {
                backgroundColor:
                  items.name === 'Life Time Plan'
                    ? '#DDF7FF'
                    : items.name === 'One year Plan'
                    ? '#F7EAFF'
                    : items.name === 'Two Year Plan'
                    ? '#FFF1D8'
                    : 'gray',
              },
            ]}>
            <Text style={{color: 'black', fontSize: 26}}>{items.name}</Text>
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              alignSelf: 'center',
              marginTop: 15,
            }}>
            Rs <Text style={{color: 'black', fontSize: 32}}>{items.price}</Text>{' '}
            /per Month
          </Text>
          {items?.features?.map((feature, index) => (
            <View key={index} style={styles.CardBody}>
              <Text style={{color: 'black', fontSize: 18}}>{feature.name}</Text>
              <Icon name="check-circle" size={25} color="black" />
            </View>
          ))}
          <View style={{padding: 30}}>
            <Custombutton title="Purchase Now" />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Price;
