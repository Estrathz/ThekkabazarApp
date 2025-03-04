import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  ResultContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  SearchContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: '70%',
    height: 45,
    marginLeft: 110,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    color: '#424242',
  },
  modalContainer: {
    height: '100%',
    backgroundColor: colors.white,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  modalContent: {
    width: '100%',
    padding: 15,
    paddingTop: 60,
  },
  modalText: {
    color: colors.primary,
    fontFamily: fonts.regular,
    textAlign: 'left',
    lineHeight: 28,
    fontSize: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  filterDescription: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
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
  dropdown1BtnTxtStyle: {
    color: '#444',
    textAlign: 'left',
  },
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown1RowTxtStyle: {
    color: '#444',
    textAlign: 'left',
  },
  dropdown1SelectedRowStyle: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
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
  },
  Card: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  image: {
    height: 200,
    width: 120,
    resizeMode: 'contain',
  },
  cardTitle: {
    color: '#0375B7',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    width: '100%',
  },
  cardText: {
    color: '#808080',
    fontSize: 16,
  },
  label: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  daysLeft: {
    color: '#fcc40d',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  datepicker: {
    width: '100%',
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    marginBottom: 15,
    color: 'black',
    padding: 15,
    fontSize: 18,
    textAlign: 'left',
  },
});

export default styles;