import {View, Text, ScrollView, ImageBackground, Image} from 'react-native';
import React, {useEffect} from 'react';
import styles from './bazarStyle';
import Custombutton from '../../Containers/Button/button';
import {fetchbazarData} from '../../reducers/bazarSlice';
import {useDispatch, useSelector} from 'react-redux';

const Bazar = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, error} = useSelector(state => state.bazar);

  useEffect(() => {
    dispatch(fetchbazarData());

    if (error) {
      console.log(error);
    }
  }, [dispatch]);

  const handleBazarDetail = name => {
    navigation.navigate('BazarDetail', {name: name, pathname: 'mainProduct'});
  };

  const handleBazarSubDetail = name => {
    navigation.navigate('BazarDetail', {name: name, pathname: 'subProduct'});
  };

  return (
    <ScrollView style={styles.Bazarcontainer}>
      <View>
        <ImageBackground
          style={styles.bazarImageContainer}
          source={require('../../assets/carousel.jpg')}
          alt="bazarImage">
          <Image
            style={styles.bazarImage}
            source={require('../../assets/bazarImage.png')}
            alt="bazarImage"
          />
          <Text style={styles.bazarText}>
            Your One-Stop Marketplace for Construction Materials
          </Text>
        </ImageBackground>
      </View>

      {data?.map((item, index) => (
        <View key={index} style={styles.bazarCard}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
            }}>
            <Image
              style={styles.bazarImage2}
              source={{uri: item.image}}
              alt="bazar"
            />
            <View
              style={{
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Text
                numberOfLines={3}
                ellipsizeMode="head"
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                  width: '70%',
                }}>
                {item.name}
              </Text>
              <View style={{width: '40%', height: '40%'}}>
                <Custombutton
                  title="View All"
                  onPress={() => handleBazarDetail(item.name)}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
              marginTop: 10,
              padding: 10,
              justifyContent: 'center',
            }}>
            {item?.subcategory?.map((sub, index) => (
              <View
                key={index}
                style={{
                  width: '48%',
                  marginBottom: 10,
                  justifyContent: 'center',
                }}
                onPress={() => handleBazarSubDetail(sub.name)}>
                <Image
                  style={styles.bazarImage3}
                  source={{uri: sub.image}}
                  alt="bazar"
                  onPress={() => handleBazarSubDetail(sub.name)}
                />
                <Text
                  onPress={() => handleBazarSubDetail(sub.name)}
                  style={{
                    color: 'black',
                    fontSize: 14,
                    marginTop: 10,
                    width: '78%',
                  }}>
                  {sub.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Bazar;
