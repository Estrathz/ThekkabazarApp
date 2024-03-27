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
  modalContainer: {
    height: '80%',
    backgroundColor: colors.white,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  modalContent: {
    width: '100%',
    padding: 15,
  },
  modalText: {
    color: colors.primary,
    fontFamily: fonts.regular,
    textAlign: 'left',
    lineHeight: 28,
    fontSize: 24,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    marginBottom: 15,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  searchInput: {
    width: '100%',
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    marginBottom: 15,
    fontSize: 18,
    padding: 15,
    color: 'black',
  },
});

export default styles;
