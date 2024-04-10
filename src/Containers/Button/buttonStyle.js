import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
