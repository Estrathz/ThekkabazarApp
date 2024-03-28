import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  Bazarcontainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bazarImageContainer: {
    height: 200,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  bazarImage: {
    width: '40%',
    height: '100%',
    resizeMode: 'contain',
  },
  bazarText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.regular,
    textAlign: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  bazarCard: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  bazarImage2: {
    aspectRatio: 5 / 4,
    width: '40%',
    height: '40%',
  },
  bazarImage3: {
    aspectRatio: 4 / 3,
    width: '40%',
    height: '40%',
  },
});

export default styles;
