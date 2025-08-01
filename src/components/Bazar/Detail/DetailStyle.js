import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../theme';
import { wp, hp, normalize, spacing, deviceInfo } from '../../../utils/responsive';

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flatList: {
    marginTop: 8,
  },

  // Header styles
  headerRow: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 26 : 24),
    fontFamily: fonts.medium,
    marginLeft: 10,
  },

  // Search and filter styles
  SearchContainer: {
    flexDirection: 'row',
    marginTop: 15,
    height: hp(6),
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  filterIcon: {
    paddingLeft: 10,
    paddingRight: 10,
    top: 5,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    flex: 1,
    height: 45,
    marginLeft: spacing.sm,
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
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.regular,
  },

  // Category and section headers
  categoryTitle: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 22 : 20),
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
    fontFamily: fonts.medium,
  },
  relatedProductsHeader: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  checklistIcon: {
    marginRight: 10,
  },
  relatedProductsText: {
    color: colors.primary,
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    fontFamily: fonts.regular,
    alignSelf: 'center',
  },

  // Product card styles
  productCardList: {
    flex: 1,
    backgroundColor: colors.white,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ProductImage: {
    aspectRatio: 1.5,
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    borderRadius: wp(2),
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  productName: {
    color: colors.primary,
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    fontFamily: fonts.medium,
    marginBottom: spacing.xs,
  },
  productBrand: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 18 : 16),
    fontFamily: fonts.regular,
    marginBottom: spacing.xs,
  },
  productPrice: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 18 : 16),
    fontFamily: fonts.medium,
  },

  // Supplier information styles
  supplierInfo: {
    flex: 1,
    backgroundColor: '#FFEFD7',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#E5E7EB',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  supplierTitle: {
    color: '#F45115',
    fontSize: normalize(deviceInfo.isTablet ? 22 : 20),
    fontFamily: fonts.medium,
  },
  supplierDivider: {
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  supplierDividerAccent: {
    borderBottomColor: '#F45115',
    borderBottomWidth: 3,
    width: '20%',
  },
  supplierName: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    marginTop: 10,
    fontFamily: fonts.medium,
  },
  supplierDetail: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  supplierDetailText: {
    color: 'black',
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    marginLeft: 10,
    fontFamily: fonts.regular,
    alignSelf: 'center',
  },

  // Modal styles
  modalContainer: {
    height: '90%',
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
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: normalize(deviceInfo.isTablet ? 22 : 20),
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  modalSubtitle: {
    fontSize: normalize(deviceInfo.isTablet ? 18 : 16),
    color: '#595D65',
    textAlign: 'center',
    fontFamily: fonts.regular,
    marginBottom: spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 10,
  },

  // Filter styles
  relatedCategory: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#E5E7EB',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  filterSectionTitle: {
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    color: 'black',
    marginLeft: 10,
    fontWeight: 'bold',
    fontFamily: fonts.medium,
  },
  filterOption: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  filterOptionText: {
    marginLeft: 10,
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    fontFamily: fonts.regular,
  },

  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  loadingText: {
    fontSize: normalize(deviceInfo.isTablet ? 18 : 16),
    fontFamily: fonts.medium,
    color: colors.primary,
    marginTop: spacing.md,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  loadingFooterText: {
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.regular,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: normalize(deviceInfo.isTablet ? 20 : 18),
    fontFamily: fonts.medium,
    color: 'black',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
    fontFamily: fonts.regular,
    color: '#666',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default styles;
