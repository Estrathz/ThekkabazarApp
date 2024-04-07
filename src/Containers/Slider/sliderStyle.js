import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  sliderContainer: {
    height: 200,
    padding: 10,
    borderRadius: 20,
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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '30%',
    height: 130,
    borderRadius: 20,
  },
});

export default styles;
