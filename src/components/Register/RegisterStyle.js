import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  Barline: {
    // backgroundColor: '#0F9E1D',
    backgroundColor: colors.primary,
    height: 20,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: 'black',
    shadowOffset: {width: 3, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    color: colors.black,
    fontSize: 20,
    fontFamily: fonts.regular,
    marginLeft: 10,
    alignSelf: 'center',
  },
});

export default styles;
