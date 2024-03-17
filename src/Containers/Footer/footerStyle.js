import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.65,
    shadowRadius: 2.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  TextNav: {
    color: 'black',
  },
  TextNav2: {
    color: 'black',
    top: 12,
  },
  bazarIcon: {
    position: 'absolute',
    transform: [{translateY: -50}, {translateX: 0}],
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    color: colors.white,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 5.84,
    elevation: 5,
  },
  //   largeTab: {
  //     flex: 2, // Making the large tab take twice as much space
  //     borderRadius: 20, // Adding border radius for a rounded appearance
  //     backgroundColor: '#FFFFFF', // Setting a different background color
  //   },
});

export default styles;
