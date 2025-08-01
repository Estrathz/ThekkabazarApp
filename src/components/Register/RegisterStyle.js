import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  Barline: {
    // backgroundColor: '#0F9E1D',
    backgroundColor: colors.primary,
    height: 20,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: 'black',
    shadowOffset: {width: 3, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    color: colors.black,
    fontSize: 20,
    fontFamily: fonts.regular,
    marginLeft: 10,
    alignSelf: 'center',
  },
  loginCard: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  loginHeading: {
    color: colors.black,
    fontSize: 20,
    fontFamily: fonts.regular,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.background,
    height: 56,
    marginTop: 10,
    borderRadius: 8,
    padding: 10,
    color: colors.black,
    shadowColor: 'black',
    shadowOffset: {width: 3, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
});

export default styles;
