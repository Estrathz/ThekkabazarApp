import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  serviceContainer: {
    backgroundColor: colors.background,
    flex: 1,
    marginTop: 20,
    padding: 10,
  },
  Formcontainer: {
    marginTop: 20,
    padding: 6,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default styles;
