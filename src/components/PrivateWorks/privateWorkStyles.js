import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  privateWorkContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  privateWorkBackground: {
    height: 200,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  privateWorkImage: {
    width: '40%',
    height: '100%',
    resizeMode: 'contain',
  },
  privateWorkText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.regular,
    textAlign: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  buttonContainer: {width: '40%'},
  bannerContainer: {
    // flex: 1,
    width: '100%',
    height: 110,
    backgroundColor: colors.white,
    padding: 15,
  },
  titletext: {
    color: colors.black,
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  bannerBody: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  bannerImage: {
    height: 35,
    width: 35,
  },
  subtitletext: {
    color: colors.black,
    fontSize: 12,
    paddingTop: 10
  },
  CardContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  modalContainer: {
    width: '100%',
    height: '70%',
    backgroundColor: colors.white,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  modalBody: {
    padding: 10,
    flex: 1,
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    fontSize: 18,
    height: 50,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    color: colors.black,
  },
  modalContent: {
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    padding: 15,
  },
});

export default styles;
