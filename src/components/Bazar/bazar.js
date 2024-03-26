import {View, Text, ScrollView, ImageBackground, Image} from 'react-native';
import React from 'react';
import styles from './bazarStyle';

const Bazar = () => {
  return (
    <ScrollView>
      <View style={styles.Bazarcontainer}>
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
    </ScrollView>
  );
};

export default Bazar;
