import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  detailCardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  Cardbodytext: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // flexGrow: 1,
    flexWrap: 'wrap',
  },
});

export default styles;
