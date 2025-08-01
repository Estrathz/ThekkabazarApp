import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';
import { wp, hp, normalize, spacing, deviceInfo } from '../../utils/responsive';

const styles = StyleSheet.create({
  Bazarcontainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bazarImageContainer: {
    height: hp(deviceInfo.isTablet ? 20 : 18), // Responsive height
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bazarImage: {
    width: wp(deviceInfo.isTablet ? 25 : 28),
    height: '100%',
    resizeMode: 'contain',
  },
  bazarText: {
    color: colors.white,
    fontSize: normalize(deviceInfo.isTablet ? 16 : 13),
    fontFamily: fonts.regular,
    textAlign: 'center',
    width: wp(deviceInfo.isTablet ? 50 : 60),
    position: 'absolute',
    bottom: spacing.sm,
  },
  bazarCard: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: wp(2.5),
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bazarCardContent: {
    flexDirection: deviceInfo.isTablet ? 'row' : 'row',
    alignItems: 'center',
  },
  bazarTextContainer: {
    justifyContent: 'center',
    marginLeft: spacing.sm,
    flex: 1,
  },
  bazarItemName: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 18 : 14),
    fontFamily: fonts.regular,
    width: '100%',
    marginBottom: spacing.sm,
    lineHeight: normalize(deviceInfo.isTablet ? 24 : 20),
  },
  viewAllButton: {
    backgroundColor: colors.primary, // Primary blue color
    width: '100%',
    borderRadius: wp(3),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(6), // Minimum proper height
  },
  subcategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  subcategoryItem: {
    width: deviceInfo.isTablet ? '30%' : '48%',
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  bazarImage2: {
    width: wp(deviceInfo.isTablet ? 35 : 50),
    height: hp(deviceInfo.isTablet ? 18 : 15),
    resizeMode: 'cover',
    borderRadius: wp(2),
  },
  bazarImage3: {
    width: wp(deviceInfo.isTablet ? 25 : 35),
    height: hp(deviceInfo.isTablet ? 12 : 10),
    resizeMode: 'cover',
    borderRadius: wp(2),
    marginBottom: spacing.xs,
  },
  subcategoryName: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 14 : 11),
    marginTop: spacing.xs,
    textAlign: 'center',
    width: '100%',
    fontFamily: fonts.regular,
    lineHeight: normalize(deviceInfo.isTablet ? 18 : 15),
  },
  // Loading, error, and empty state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  loadingText: {
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.medium,
    color: colors.error || '#FF6B6B',
    textAlign: 'center',
    lineHeight: normalize(deviceInfo.isTablet ? 22 : 20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.medium,
    color: colors.text || '#666',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: normalize(deviceInfo.isTablet ? 14 : 12),
    fontFamily: fonts.regular,
    color: colors.text || '#999',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: spacing.lg,
    borderRadius: wp(3),
    marginTop: spacing.md,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});

export default styles;