import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  Bazarcontainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bazarImageContainer: {
    height: 200,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  bazarImage: {
    width: '40%',
    height: '100%',
    resizeMode: 'contain',
  },
  bazarText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.regular,
    textAlign: 'center',
    width: '60%',
    alignSelf: 'center',
  },
});

export default styles;
