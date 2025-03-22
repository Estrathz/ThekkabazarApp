import {StyleSheet, Dimensions} from 'react-native';
import {colors, fonts} from '../../theme';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.02,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    height: height * 0.08,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    paddingHorizontal: width * 0.01,
    minWidth: width * 0.15,
  },
  TextNav: {
    color: 'black',
    fontSize: width * 0.025,
    marginTop: height * 0.005,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  TextNav2: {
    color: 'black',
    fontSize: width * 0.025,
    marginTop: height * 0.015,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  bazarIcon: {
    position: 'absolute',
    transform: [{translateY: -height * 0.06}],
    backgroundColor: colors.primary,
    padding: width * 0.025,
    borderRadius: width * 0.05,
    color: colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: width * 0.12,
    height: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //   largeTab: {
  //     flex: 2, // Making the large tab take twice as much space
  //     borderRadius: 20, // Adding border radius for a rounded appearance
  //     backgroundColor: '#FFFFFF', // Setting a different background color
  //   },
});

export default styles;
