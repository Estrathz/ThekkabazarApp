import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  HomeContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
  navcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    height: '100px',
  },
  iconsContainer: {
    flexDirection: 'row',
    width: '25%',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  logo: {
    width: 70,
    aspectRatio: 2 / 1,
  },
  SearchContainer: {
    flexDirection: 'row',
    // padding: 20,
    height: '100px',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 340,
    height: 45,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    marginLeft: 10,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#fff',
    color: '#424242',
  },
});

export default styles;
