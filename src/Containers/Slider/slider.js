import React, { useEffect } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import styles from './sliderStyle';
import Swiper from 'react-native-swiper';
import { fetchbanner } from '../../reducers/bannerSlice';
import { useDispatch, useSelector } from 'react-redux';

const Slider = () => {
  const { bannerdata } = useSelector((state) => state.banner);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchbanner());
  }, [dispatch]);

  return (
    <View style={styles.sliderContainer}>
  <Swiper style={styles.wrapper} autoplay={true}>
    {bannerdata && bannerdata.banner ? (
      bannerdata.banner.map((items, index) => (
        <View key={index} style={styles.slide}>
          <Image
            style={styles.carouselImage}
            source={{ uri: items.image }}
          />
        </View>
      ))
    ) : (
      <Text>Loading...</Text>
    )}
  </Swiper>
</View>

  );
};

export default Slider;
