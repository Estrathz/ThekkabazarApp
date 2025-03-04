import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  Bazarcontainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bazarImageContainer: {
    height: 140, // Reduced from 200
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bazarImage: {
    width: '28%', // Reduced from 40%
    height: '100%',
    resizeMode: 'contain',
  },
  bazarText: {
    color: colors.white,
    fontSize: 12.6, // Reduced from 18
    fontFamily: fonts.regular,
    textAlign: 'center',
    width: '60%',
    position: 'absolute',
    bottom: 10,
  },
  bazarCard: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 10, // Reduced from 15
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  bazarCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bazarTextContainer: {
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1,
  },
  bazarItemName: {
    color: 'black',
    fontSize: 14, // Reduced from 18
    fontFamily: 'Poppins-Regular',
    width: '100%',
    marginBottom: 10,

  },
  viewAllButton: {
    marginTop: 10,
    width: '100%',
    fontSize: 12, // Reduced from 18
  },
  subcategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  subcategoryItem: {
    width: '48%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bazarImage2: {
    aspectRatio: 6 / 3,
    width: '50%', // Reduced from 40%
    height: undefined,
    aspectRatio: 1.9,
  },
  bazarImage3: {
    aspectRatio: 4 / 3,
    width: '60%', // Reduced from 100%
    height: undefined,
    aspectRatio: 1,
  },
  subcategoryName: {
    color: 'black',
    fontSize: 10, // Reduced from 14
    marginTop: 5,
    textAlign: 'center',
    width: '100%',
  },
});

export default styles;