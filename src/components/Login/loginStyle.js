import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 225,
    // top: 58,
  },

  loginForm: {
    marginTop: 30,
    backgroundColor: '#ffff',
    // flex: 1,
    padding: 20,
    height: 489,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  titletext: {
    fontSize: 25,
    marginBottom: 6,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: fonts.regular,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: 'black',
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
  text2: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 9,
    color: 'black',
    fontWeight: '800',
    fontFamily: fonts.regular,
  },
  text3: {
    fontSize: 16,
    marginBottom: 6,
    color: 'black',
    fontWeight: '800',
    fontFamily: fonts.regular,
  },
  text4: {
    fontSize: 16,
    marginBottom: 6,
    color: '#737373',
    textAlign: 'right',
    fontFamily: fonts.regular,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 56,
    color: 'black',
  },
  eyeIcon: {
    padding: 10,
    color: 'black',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    color: 'black',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  lineform: {
    borderBottomWidth: 1,
    borderBlockColor: '#AAABAB',
    marginTop: 30,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 20,
  },
  text6: {
    fontSize: 16,
    marginBottom: 6,
    color: 'black',
    fontFamily: fonts.regular,
  },
  text7: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.primary,
    // fontWeight: 'bold',
    fontFamily: fonts.medium,
  },
});

export default styles;
