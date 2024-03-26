import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  Bodycontainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 20,
  },
  Card: {
    padding: 10,
  },
  noticeText: {
    color: colors.primary,
    fontSize: 24,
  },
  noticeBodyText: {
    color: colors.black,
    fontSize: 18,
    marginLeft: 20,
  },
});

export default styles;
