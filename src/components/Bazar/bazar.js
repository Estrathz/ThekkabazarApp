import React, { useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchbazarData } from '../../reducers/bazarSlice';
import styles from './bazarStyle';
import CustomButton from '../../Containers/Button/button'; // Ensure this path is correct

const Bazar = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.bazar);

  useEffect(() => {
    dispatch(fetchbazarData());
    if (error) {
      console.error(error);
    }
  }, [dispatch, error]);

  const handleBazarDetail = name => {
    navigation.navigate('BazarDetail', { name, pathname: 'mainProduct' });
  };

  const handleBazarSubDetail = name => {
    navigation.navigate('BazarDetail', { name, pathname: 'subProduct' });
  };

  return (
    <ScrollView style={styles.Bazarcontainer}>
      <View>
        <ImageBackground
          style={styles.bazarImageContainer}
          source={require('../../assets/carousel.jpg')}
          resizeMode="cover"
        >
          <Image
            style={styles.bazarImage}
            source={require('../../assets/bazarImage.png')}
          />
          <Text style={styles.bazarText}>
            Your One-Stop Marketplace for Construction Materials
          </Text>
        </ImageBackground>
      </View>

      {data?.map((item, index) => (
        <View key={index} style={styles.bazarCard}>
          <View style={styles.bazarCardContent}>
            <Image
              style={styles.bazarImage2}
              source={{ uri: item.image }}
            />
            <View style={styles.bazarTextContainer}>
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.bazarItemName}
              >
                {item.name}
              </Text>
              <CustomButton
                title="View All"
                onPress={() => handleBazarDetail(item.name)}
                style={{
                  marginTop: 10,
                  height: 20, // Reduced height by 20%
                }}
              />
            </View>
          </View>
          <View style={styles.subcategoryContainer}>
            {item?.subcategory?.map((sub, index) => (
              <View key={index} style={styles.subcategoryItem}>
                <Image
                  style={styles.bazarImage3}
                  source={{ uri: sub.image }}
                />
                <Text
                  style={styles.subcategoryName}
                  onPress={() => handleBazarSubDetail(sub.name)}
                >
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