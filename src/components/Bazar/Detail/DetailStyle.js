import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  SearchContainer: {
    flexDirection: 'row',
    marginTop: 15,
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
  productCardList: {
    flex: 1,
    backgroundColor: colors.white,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  ProductImage: {
    aspectRatio: 1.5,
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
  },
  supplierInfo: {
    flex: 1,
    backgroundColor: '#FFEFD7',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#E5E7EB',
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});

export default styles;
