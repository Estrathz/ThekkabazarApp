import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  dropdownButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    paddingHorizontal: 15,
    height: 45,
    justifyContent: 'center',
  },
  dropdownText: {
    color: '#444',
    textAlign: 'left',
    fontSize: 16,
  },
  dropdownStyle: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dropdownRowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdownRowText: {
    color: '#444',
    textAlign: 'left',
    fontSize: 16,
  },
  updateButton: {
    marginTop: 20,
  },
});

export default styles;
