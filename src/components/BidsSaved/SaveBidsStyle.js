import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  Card: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    padding: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
    borderRadius: 6,
    width: '100%',
    alignSelf: 'stretch',
  },
  image: {
    height: 90,
    width: 90,
    marginTop: 20,
    resizeMode: 'contain',
    borderRadius: 5,
  },
  CardText: {
    color: '#808080',
    fontSize: 14,
    marginLeft: 8,
  },
  cusBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 15,
    height: 35,
    borderWidth: 1,
    borderColor: colors.gray,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default styles;
