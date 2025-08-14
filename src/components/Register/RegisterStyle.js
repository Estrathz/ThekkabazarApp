import {StyleSheet} from 'react-native';
import {colors, fonts as themeFonts} from '../../theme';
import {wp, hp, normalize, spacing, deviceInfo} from '../../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  registerForm: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    minHeight: hp(deviceInfo.isTablet ? 60 : 70), // Responsive height
    borderRadius: wp(2.5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  titletext: {
    fontSize: normalize(25),
    marginLeft: spacing.sm,
    color: colors.black,
    fontWeight: 'bold',
    fontFamily: themeFonts.regular,
  },
  subtitle: {
    fontSize: normalize(16),
    marginBottom: hp(2.5),
    color: colors.black,
    textAlign: 'center',
    fontFamily: themeFonts.regular,
  },
  sectionContainer: {
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: normalize(18),
    marginLeft: spacing.sm,
    color: colors.black,
    fontWeight: '800',
    fontFamily: themeFonts.medium,
  },
  input: {
    height: hp(7),
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: wp(2.5),
    marginBottom: hp(1.3),
    paddingHorizontal: spacing.md,
    fontSize: normalize(16),
    color: colors.black,
    backgroundColor: colors.white,
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
    color: colors.black,
    fontFamily: themeFonts.regular,
  },
  text7: {
    fontSize: normalize(16),
    color: colors.primary,
    fontFamily: themeFonts.medium,
  },
});

export default styles;
