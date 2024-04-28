import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './privateWorkStyles';
import Custombutton from '../../Containers/Button/button';
import {getPrivateWork, postPrivateWork} from '../../reducers/privateWorkSlice';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const PrivateWork = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.privateWork);
  const [isModalVisible, setModalVisible] = useState(false);
  const [work, setWork] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rate, setRate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getPrivateWork({page: page}));
  }, [dispatch]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleFormSubmit = () => {
    if (
      work === '' ||
      address === '' ||
      company === '' ||
      phoneNumber === '' ||
      rate === ''
    ) {
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    dispatch(
      postPrivateWork({
        work: work,
        address: address,
        company: company,
        phone_number: phoneNumber,
        rate: rate,
      }),
    )
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your work has been posted successfully',
          visibilityTime: 3000,
          autoHide: true,
        });
        setModalVisible(false);
        setWork('');
        setAddress('');
        setCompany('');
        setPhoneNumber('');
        setRate('');
      })
      .catch(error => {
        console.log('Error', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  return (
    <ScrollView
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent) && !loading) {
          handleLoadMore();
        }
      }}
      scrollEventThrottle={400}>
      <View style={styles.privateWorkContainer}>
        <ImageBackground
          style={styles.privateWorkBackground}
          source={require('../../assets/carousel.jpg')}
          resizeMode="cover">
          <Image
            style={styles.privateWorkImage}
            source={require('../../assets/group.png')}
          />

          <Text style={styles.privateWorkText}>
            Discover Top-Notch Sub- Contractors for Your Projects!
          </Text>
        </ImageBackground>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            margin: 15,
          }}>
          <View style={{width: '50%'}}>
            <Custombutton title="Post Your Work" onPress={() => openModal()} />
          </View>
        </View>

        <View style={styles.bannerContainer}>
          <Text style={styles.titletext}>
            Get the best Sub-Contractor for your work
          </Text>
          <View style={styles.bannerBody}>
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>
              <Image
                style={styles.bannerImage}
                source={require('../../assets/handIcon.png')}
              />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.subtitletext]}>
                Post Your Work
              </Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>
              <Image
                style={styles.bannerImage}
                source={require('../../assets/mens.png')}
              />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.subtitletext]}>
                Find Workers
              </Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>
              <Image
                style={styles.bannerImage}
                source={require('../../assets/tools.png')}
              />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.subtitletext}>
                Complete Projects
              </Text>
            </View>
          </View>
        </View>
        {data?.data?.map((items, index) => (
          <View key={index} style={styles.CardContainer}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Icon name="calendar" size={24} color="red" />
                <Text style={{color: 'black', fontSize: 18, marginLeft: 10}}>
                  Published Date:
                </Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Icon name="pricetag" size={24} color="black" />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    marginRight: 10,
                    marginLeft: 10,
                  }}>
                  {items.rate}
                </Text>
              </View>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Icon name="call-outline" size={24} color="black" />
                <Text style={{color: 'black', fontSize: 18, marginLeft: 5}}>
                  {items.phone_number}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 15,
                  flex: 1,
                }}>
                <Icon name="location-outline" size={24} color="black" />
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    color: 'black',
                    fontSize: 18,
                    marginLeft: 5,
                    flexWrap: 'wrap',
                    flex: 1,
                  }}>
                  {items.address}
                </Text>
              </View>
            </View>
            <View style={{padding: 5}}>
              <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
                {items.work}
              </Text>
              <Text style={{color: 'black', fontSize: 18}}>
                {items.company}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ScrollView style={styles.modalContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View
              style={{display: 'flex', flexDirection: 'row', marginLeft: 20}}>
              <Icon
                name="link"
                size={20}
                color="black"
                style={{transform: [{rotate: '-45deg'}]}}
              />
              <Text style={{color: '#0375B7', fontSize: 16}}>
                Post Your Sub-Contract Work Opportunities
              </Text>
            </View>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="close" size={35} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{padding: 10}}>
            <Text style={{color: '#595D65', fontSize: 16}}>
              The post will remain visible for a duration of 30 days.
            </Text>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Work"
                placeholderTextColor="black"
                value={work}
                onChangeText={setWork}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="black"
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="Company"
                placeholderTextColor="black"
                value={company}
                onChangeText={setCompany}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="black"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <TextInput
                style={styles.input}
                placeholder="Rate"
                placeholderTextColor="black"
                value={rate}
                onChangeText={setRate}
              />
            </View>
            <Custombutton title="Submit Work" onPress={handleFormSubmit} />
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default PrivateWork;
