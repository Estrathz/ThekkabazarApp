import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import styles from './sliderStyle';
import Swiper from 'react-native-swiper';
import {fetchbanner} from '../../reducers/bannerSlice';
import {useDispatch, useSelector} from 'react-redux';

const Slider = () => {
  const {bannerdata} = useSelector(state => state.banner);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchbanner());
  }, [dispatch]);

  const banners =
    bannerdata && Array.isArray(bannerdata.banner) ? bannerdata.banner : [];

  // Render a neutral placeholder slide instead of a "Loading..." label so the
  // carousel area stays visually stable until banners arrive.
  if (banners.length === 0) {
    return (
      <View style={styles.sliderContainer}>
        <View style={styles.slide}>
          <Image
            style={styles.carouselImage}
            source={require('../../assets/carousel.jpg')}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      <Swiper
        style={styles.wrapper}
        autoplay
        autoplayTimeout={4}
        loop
        showsPagination={banners.length > 1}
        removeClippedSubviews={false}
        loadMinimal
        loadMinimalSize={1}
        dotColor="rgba(255,255,255,0.5)"
        activeDotColor="#0375B7">
        {banners.map((items, index) => (
          <View key={index} style={styles.slide}>
            <Image
              style={styles.carouselImage}
              source={{uri: items.image}}
              defaultSource={require('../../assets/carousel.jpg')}
              fadeDuration={0}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

// Memoized so frequent Home re-renders (search, refresh, saved-bid state, etc.)
// don't re-render/reset the carousel and cause stutter.
export default React.memo(Slider);
