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
  dropdown1BtnStyle: {
    backgroundColor: '#D4D4D4',
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    marginRight: 15,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
  dropdown1DropdownStyle: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
});

export default styles;
