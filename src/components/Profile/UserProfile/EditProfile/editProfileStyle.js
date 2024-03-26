import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  Cardcontainer: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 15,
    marginTop: 15,
  },
  TextInput: {
    color: colors.black,
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#D4D4D4',
    borderRadius: 10,
    flex: 1,
  },
});

export default styles;
