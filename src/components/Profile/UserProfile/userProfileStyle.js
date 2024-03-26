import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../../theme';

const styles = StyleSheet.create({
  Profilecontainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  HeaderCard: {
    display: 'flex',
    backgroundColor: colors.white,
    padding: 15,
    margin: 15,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    borderRadius: 10,
    elevation: 5,
  },
});

export default styles;
