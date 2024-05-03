import {View, Text, ScrollView, Modal, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './priceStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPriceData} from '../../reducers/priceSlice';
import Custombutton from '../../Containers/Button/button';
import Icon2 from 'react-native-vector-icons/Ionicons';

const Price = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, status, error} = useSelector(state => state.price);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchPriceData());
  }, [dispatch]);

  return (
    <>
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
              Rs{' '}
              <Text style={{color: 'black', fontSize: 32}}>{items.price}</Text>{' '}
              /per Month
            </Text>
            {items?.features?.map((feature, index) => (
              <View key={index} style={styles.CardBody}>
                <Text style={{color: 'black', fontSize: 18}}>
                  {feature.name}
                </Text>
                <Icon name="check-circle" size={25} color="black" />
              </View>
            ))}
            <View style={{padding: 30}}>
              <Custombutton
                title="Purchase Now"
                onPress={() => setModalVisible(true)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ScrollView style={styles.modalContainer}>
          <View style={{display: 'flex', padding: 10}}>
            <Icon2
              name="close"
              size={33}
              color="black"
              style={{alignSelf: 'flex-end'}}
              onPress={() => setModalVisible(false)}
            />
          </View>
          <Text style={{color: 'black', fontSize: 18, alignSelf: 'center'}}>
            Choose Payment Method
          </Text>
          <View>
            {data?.banks?.map((items, index) => (
              <View
                key={index}
                style={{display: 'flex', flexDirection: 'row', padding: 10}}>
                <View style={{padding: 3, alignSelf: 'center'}}>
                  <Text style={{color: 'black', fontSize: 12}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>
                      Bank Name:{' '}
                    </Text>
                    {items.bank_name}
                  </Text>
                  <Text style={{color: 'black', fontSize: 12}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>
                      Account Number:{' '}
                    </Text>{' '}
                    {items.account_number}
                  </Text>
                  <Text style={{color: 'black', fontSize: 12}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>
                      Account Name:{' '}
                    </Text>{' '}
                    {items.account_name}
                  </Text>
                  <Text style={{color: 'black', fontSize: 12}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>
                      Branch Name:{' '}
                    </Text>{' '}
                    {items.branch}
                  </Text>
                </View>
                <Image
                  source={{
                    uri: `https://thekkabazar.itnepalsolutions.com${items.qr}`,
                  }}
                  style={{width: 190, height: 190}}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};

export default Price;
