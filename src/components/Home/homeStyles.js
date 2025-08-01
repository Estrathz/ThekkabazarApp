import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';
import {wp, hp, normalize, spacing, deviceInfo} from '../../utils/responsive';

const styles = StyleSheet.create({
  HomeContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
  navcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: hp(8), // Responsive height
    backgroundColor: colors.background,
  },
  iconsContainer: {
    flexDirection: 'row',
    width: '25%',
  },
  logo: {
    width: wp(deviceInfo.isTablet ? 15 : 20),
    height: hp(deviceInfo.isTablet ? 4 : 5),
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.lg,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(2.5),
    flex: 1,
    height: hp(5.5),
    borderColor: colors.gray,
    borderWidth: 1,
    paddingRight: spacing.sm,
    marginRight: spacing.sm,
  },
  searchIcon: {
    paddingHorizontal: spacing.md,
  },
  searchTextInput: {
    flex: 1,
    height: hp(5.5),
    fontSize: normalize(16),
    color: '#333',
    paddingRight: spacing.sm,
  },
  clearSearchButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: wp(12),
    height: hp(5.5),
    borderRadius: wp(2.5),
    backgroundColor: '#fff',
    borderColor: colors.gray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#0375B7',
    borderColor: '#0375B7',
    shadowColor: '#0375B7',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  filterIndicator: {
    position: 'absolute',
    top: -wp(1),
    right: -wp(1),
    backgroundColor: '#FF0000',
    borderRadius: wp(2.5),
    width: wp(5),
    height: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  filterIndicatorText: {
    color: '#FFFFFF',
    fontSize: normalize(10),
    fontWeight: '700',
  },
  searchButtonText: {
    color: '#424242',
    fontSize: normalize(16),
    fontWeight: '500',
    flex: 1,
  },
  searchActiveIndicator: {
    position: 'absolute',
    right: wp(2),
    top: hp(0.5),
    backgroundColor: '#0375B7',
    borderRadius: wp(2.5),
    width: wp(5),
    height: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0375B7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  searchActiveText: {
    color: '#FFFFFF',
    fontSize: normalize(11),
    fontWeight: '700',
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    marginLeft: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#fff',
    color: '#424242',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add semi-transparent overlay
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: hp(10), // Add top margin for better mobile experience
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
  },
  modalText: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: normalize(deviceInfo.isTablet ? 26 : 20),
    flex: 1,
  },
  modalCloseBtn: {
    padding: spacing.sm,
    borderRadius: wp(6),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(9),
    height: wp(9),
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: hp(5), // Extra bottom padding for mobile keyboards
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: hp(deviceInfo.isTablet ? 7.5 : 6.5),
    backgroundColor: colors.white,
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: '#E1E5E9',
    marginBottom: hp(2),
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdown1BtnStyleSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    elevation: 5,
    transform: [{ scale: 1.02 }], // Subtle scale effect for selected state
  },
  dropdown1BtnTxtStyle: {
    color: '#555',
    textAlign: 'left',
    fontSize: normalize(deviceInfo.isTablet ? 17 : 15),
    fontWeight: '500',
  },
  dropdown1BtnTxtStyleSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  dropdown1RowStyle: {
    backgroundColor: colors.white,
    borderBottomColor: '#F0F0F0',
    paddingVertical: hp(2),
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 0.5,
    minHeight: hp(6),
  },
  dropdown1RowTxtStyle: {
    color: '#333',
    textAlign: 'left',
    fontSize: normalize(deviceInfo.isTablet ? 16 : 15),
    fontWeight: '500',
    lineHeight: normalize(20),
  },
  dropdown1SelectedRowStyle: {
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#E1E5E9',
    paddingVertical: hp(1.5),
    paddingHorizontal: spacing.md,
    fontSize: normalize(15),
    color: '#333',
    marginBottom: spacing.sm,
  },
  dropdown1DropdownStyle: {
    backgroundColor: colors.white,
    borderRadius: wp(3),
    marginTop: spacing.sm,
    maxHeight: hp(35), // Reduced max height for better mobile experience
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    zIndex: 1000, // Ensure dropdown appears above other elements
  },
  searchInput: {
    width: '100%',
    height: hp(deviceInfo.isTablet ? 7.5 : 6.5),
    backgroundColor: colors.white,
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: '#E1E5E9',
    marginBottom: hp(2),
    fontSize: normalize(deviceInfo.isTablet ? 17 : 15),
    paddingHorizontal: spacing.lg,
    color: '#555',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  titletext: {
    fontSize: normalize(14),
    color: colors.white,
    fontFamily: fonts.regular,
    backgroundColor: colors.text,
    padding: 10,
    width: 95,
    height: 35,
    borderRadius: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  // Card styles with responsive dimensions
  Card: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: wp(2.5),
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    height: hp(deviceInfo.isTablet ? 20 : 25),
    width: wp(deviceInfo.isTablet ? 20 : 25),
    resizeMode: 'contain',
  },
  CardText: {
    color: '#000',
    fontSize: normalize(14),
    marginLeft: spacing.sm,
    flex: 1,
  },
  CardHeading: {
    display: 'flex',
    flexDirection: 'row',
  },
  Cardbodytext: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cusBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    backgroundColor: colors.white,
    borderRadius: wp(2),
    marginTop: hp(2.5),
    height: hp(4.5),
    borderWidth: 1,
    borderColor: colors.gray,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  CardFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#C6C1C1',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  Icons: {
    color: colors.primary,
    marginLeft: 20,
  },
  datepicker: {
    width: '100%',
    height: hp(deviceInfo.isTablet ? 7.5 : 6.5),
    backgroundColor: colors.white,
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: '#E1E5E9',
    marginBottom: hp(2),
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  datepickerSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  datepickerText: {
    fontSize: normalize(16),
    color: '#555',
    fontWeight: '500',
    flex: 1,
  },
  datepickerTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  datepickerIcon: {
    marginLeft: spacing.sm,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    minHeight: hp(50),
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIconWrapper: {
    marginBottom: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextWrapper: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1.3),
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
    lineHeight: normalize(24),
  },
  emptyActionText: {
    fontSize: normalize(14),
    color: '#999',
    textAlign: 'center',
    marginTop: hp(1),
    fontStyle: 'italic',
  },
  emptyActions: {
    marginTop: hp(3),
    alignItems: 'center',
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingVertical: hp(1.5),
    paddingHorizontal: spacing.lg,
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: '#0375B7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearFiltersBtnText: {
    color: '#0375B7',
    fontSize: normalize(15),
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    minHeight: hp(40),
  },
  errorText: {
    fontSize: normalize(16),
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: hp(2),
    lineHeight: normalize(24),
  },
  retryButton: {
    backgroundColor: '#0375B7',
    paddingVertical: hp(1.5),
    paddingHorizontal: spacing.xl,
    borderRadius: wp(6),
    marginTop: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: '#666',
    fontSize: normalize(14),
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    minHeight: hp(40),
    paddingVertical: hp(10),
  },
  loadingText: {
    color: '#666',
    fontSize: normalize(16),
    marginTop: spacing.lg,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Always side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(3),
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: hp(2),
    paddingHorizontal: spacing.md, // Reduced padding for better fit
    borderRadius: wp(3),
    width: '48%', // Always take 48% width for side-by-side layout
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E1E5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  clearFilterIcon: {
    marginRight: 8,
  },
  clearFilterText: {
    color: '#333',
    fontSize: 16,
  },
  applyFilterButton: {
    width: '48%', // Match the clear filter button width
    paddingVertical: hp(2),
    borderRadius: wp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  clearDateButton: {
    position: 'absolute',
    right: wp(12),
    top: hp(1.8),
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: wp(3),
    padding: wp(1),
  },
  dateContainer: {
    position: 'relative',
    zIndex: 10, // Ensure date picker appears above other elements
  },
  adContainer: {
    marginVertical: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: wp(2),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  adImage: {
    width: '100%',
    height: hp(deviceInfo.isTablet ? 8 : 12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  adOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 4,
  },
  adText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Filter buttons - compact rectangular design
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5), // Increased to prevent button cutoff
    paddingHorizontal: spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    minHeight: hp(deviceInfo.isTablet ? 7.5 : 6.5), // Increased to accommodate buttons
    maxHeight: hp(deviceInfo.isTablet ? 9 : 8), // Increased to prevent cutoff
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'space-between',
  },
  filterScrollView: {
    flex: 1,
    marginRight: spacing.sm,
  },
  filterScrollContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    minHeight: hp(deviceInfo.isTablet ? 6 : 5), // Increased to prevent button cutoff
    paddingVertical: hp(0.5), // Added vertical padding for buttons
  },
  filterActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filterStatusContainer: {
    marginRight: spacing.sm,
  },
  filterStatusIndicator: {
    backgroundColor: '#0375B7',
    borderRadius: wp(1.5), // Made more rectangular (reduced from wp(2.4))
    width: wp(deviceInfo.isTablet ? 5.67 : 4.41), // Increased by 5%
    height: wp(deviceInfo.isTablet ? 5.67 : 4.41), // Increased by 5%
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0375B7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  filterStatusText: {
    color: '#FFFFFF',
    fontSize: normalize(deviceInfo.isTablet ? 13 : 11), // Increased by 20%
    fontWeight: '700',
    fontFamily: fonts.bold, // Keep font family
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(deviceInfo.isTablet ? 3 : 2.4), // Increased by 20%
    paddingVertical: hp(deviceInfo.isTablet ? 0.9 : 0.72), // Increased by 20%
    marginHorizontal: wp(0.6), // Increased by 20%
    borderRadius: wp(1.5), // Made more rectangular to match icons
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E5E9',
    minWidth: wp(deviceInfo.isTablet ? 14.4 : 12), // Increased by 20%
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  firstButton: {
    marginLeft: 0,
  },
  lastButton: {
    marginRight: spacing.sm, // Back to smaller spacing
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25, // Reduced shadow opacity
    elevation: 3, // Reduced elevation
    transform: [{ scale: 1.02 }], // Minimal scale for compact design
  },
  buttonIcon: {
    marginRight: wp(1.5),
  },
  filterButtonText: {
    fontSize: normalize(deviceInfo.isTablet ? 16 : 13), // Increased by 20%
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    fontFamily: fonts.medium, // Keep font family for consistency
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: fonts.bold, // Added bold font for active state
  },
  filterIconContainer: {
    width: wp(9.45), // Increased by 5%
    height: wp(9.45), // Increased by 5%
    borderRadius: wp(1.5), // Made rectangular (reduced from wp(4.5))
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E1E5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Ultra-compact filter styles
  compactFilterSection: {
    paddingVertical: hp(0.5),
    paddingHorizontal: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    height: hp(5), // Very small height
  },

  compactFilterContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },

  compactFilterButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
    marginHorizontal: wp(1),
    borderRadius: wp(3),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E1E5E9',
    minWidth: wp(15),
    alignItems: 'center',
  },

  compactFilterButtonActive: {
    backgroundColor: '#0375B7',
    borderColor: '#0375B7',
  },

  compactFilterText: {
    fontSize: normalize(10),
    fontWeight: '500',
    color: '#666',
  },

  compactFilterTextActive: {
    color: '#FFFFFF',
  },

  // Enhanced tablet-specific styles
  ...(deviceInfo.isTablet && {
    modalContent: {
      marginTop: hp(8),
      marginHorizontal: wp(5),
      marginBottom: hp(8),
      borderRadius: wp(4),
    },
    filterSection: {
      paddingVertical: hp(2), // Increased to prevent button cutoff on tablets
      paddingHorizontal: spacing.lg,
      minHeight: hp(9), // Increased to accommodate tablet buttons
    },
    filterButton: {
      paddingHorizontal: wp(4.2), // Increased by 5% from wp(4)
      paddingVertical: hp(1.26), // Increased by 5% from hp(1.2)
      marginHorizontal: wp(1.58), // Increased by 5% from wp(1.5)
      minWidth: wp(23.1), // Increased by 5% from wp(22)
      borderRadius: wp(1.5), // Made rectangular to match main styles
    },
    filterIconContainer: {
      width: wp(9.45), // Increased by 5% from wp(9)
      height: wp(9.45), // Increased by 5% from wp(9)
      borderRadius: wp(1.5), // Made rectangular (reduced from wp(4.5))
    },
    dropdown1BtnStyle: {
      height: hp(8),
    },
    searchInput: {
      height: hp(8),
    },
    datepicker: {
      height: hp(8),
    },
  }),
});

export default styles;
