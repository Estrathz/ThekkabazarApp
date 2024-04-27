import {StyleSheet} from 'react-native';
import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  sliderContainer: {
    height: 250,
    paddingHorizontal:10,
    borderRadius: 20,
    backgroundColor: colors.white
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: "100%",
  },
  carouselImage: {
    width: '100%',
    height: "100%",
    resizeMode:"contain",
  },
});

export default styles;
