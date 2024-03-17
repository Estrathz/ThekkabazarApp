import React from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import styles from './sliderStyle';
import Swiper from 'react-native-swiper';

const Slider = () => {
  return (
    <View style={styles.HomeContainer}>
      {/* Your other components */}
      <View style={styles.sliderContainer}>
        <Swiper style={styles.wrapper} autoplay={true}>
          <View style={styles.slide}>
            <ImageBackground
              style={styles.backgroundImage}
              source={require('../../assets/carousel.jpg')}
              resizeMode="cover">
              <Image
                style={styles.carouselImage}
                source={require('../../assets/loginPic.png')}
              />
              <View
                style={{
                  width: '70%',
                  padding: 3,
                }}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  Unlock Opportunities with Winning Bids!
                </Text>
                <Text style={{fontSize: 12, color: 'white'}}>
                  Expert bid management for guaranteed results.
                </Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.slide}>
            <ImageBackground
              style={styles.backgroundImage}
              source={require('../../assets/carousel.jpg')}
              resizeMode="cover">
              <Image
                style={styles.carouselImage}
                source={require('../../assets/loginPic.png')}
              />
              <View
                style={{
                  width: '70%',
                  padding: 3,
                }}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  Unlock Opportunities with Winning Bids!
                </Text>
                <Text style={{fontSize: 12, color: 'white'}}>
                  Expert bid management for guaranteed results.
                </Text>
              </View>
            </ImageBackground>
          </View>
        </Swiper>
      </View>
    </View>
  );
};

export default Slider;
