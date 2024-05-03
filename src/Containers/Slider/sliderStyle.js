import {StyleSheet} from 'react-native';
import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  sliderContainer: {
    height: 250,
    paddingHorizontal: 5,// Maintain this for overall container aesthetics
    overflow: 'hidden',  // Ensures that child views are clipped to the rounded boundaries
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,  // Apply radius to each slide to inherit the container's rounded corners
    overflow: 'hidden',  // Ensures images within are clipped to these rounded boundaries
  },
  carouselImage: {
    width: '100%',
    height: "100%",
    resizeMode: "contain", // Ensures images are contained within the area, preserving aspect ratio
    alignSelf: 'center',  // Center the image within the slide
  },
});


export default styles;
