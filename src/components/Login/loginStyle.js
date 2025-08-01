import {StyleSheet} from 'react-native';
import {colors, fonts as themeFonts} from '../../theme';
import {wp, hp, normalize, spacing, deviceInfo} from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  image: {
    width: wp(deviceInfo.isTablet ? 40 : 53), // Responsive width
    height: hp(deviceInfo.isTablet ? 20 : 25), // Responsive height
    resizeMode: 'contain',
  },
  loginForm: {
    backgroundColor: '#ffff',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    minHeight: hp(deviceInfo.isTablet ? 50 : 55), // Responsive height
    borderRadius: wp(2.5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titletext: {
    fontSize: normalize(25),
    marginBottom: hp(1),
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: themeFonts.regular,
  },
  text: {
    fontSize: normalize(16),
    marginBottom: hp(1),
    color: 'black',
    textAlign: 'center',
    fontFamily: themeFonts.regular,
  },
  text2: {
    fontSize: normalize(16),
    marginBottom: hp(1),
    marginTop: hp(1.2),
    color: 'black',
    fontWeight: '800',
    fontFamily: themeFonts.regular,
  },
  text3: {
    fontSize: normalize(16),
    marginBottom: hp(1),
    color: 'black',
    fontWeight: '800',
    fontFamily: themeFonts.regular,
  },
  text4: {
    fontSize: normalize(16),
    marginBottom: hp(1),
    color: '#737373',
    textAlign: 'right',
    fontFamily: themeFonts.regular,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(7),
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: hp(1.3),
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
    borderRadius: wp(1.2),
  },
  passwordInput: {
    flex: 1,
    height: hp(7),
    fontSize: normalize(16),
    color: 'black',
  },
  eyeIcon: {
    padding: spacing.sm,
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: hp(7),
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: wp(2.5),
    marginBottom: hp(1.3),
    paddingHorizontal: spacing.md,
    fontSize: normalize(16),
    color: 'black',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2.5),
  },
  loadingText: {
    marginTop: hp(1.3),
    fontSize: normalize(16),
    color: colors.primary,
    fontFamily: themeFonts.regular,
  },
  lineform: {
    borderBottomWidth: 1,
    borderBottomColor: '#AAABAB',
    marginTop: hp(4),
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.5),
  },
  text6: {
    fontSize: normalize(16),
    color: 'black',
    fontFamily: themeFonts.regular,
  },
  text7: {
    fontSize: normalize(16),
    color: colors.primary,
    fontFamily: themeFonts.medium,
  },
});

export default styles;
