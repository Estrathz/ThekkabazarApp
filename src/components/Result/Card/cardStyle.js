import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
    // padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
    padding: 10,
  },
  titletext: {
    fontSize: 14,
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
  Card: {
    backgroundColor: colors.white,
    padding: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  CardText: {
    color: '#808080',
    fontSize: 18,
    marginLeft: 8,
  },
  CardHeading: {
    display: 'flex',
    flexDirection: 'row',
  },
  Cardbodytext: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // flexGrow: 1,
    flexWrap: 'wrap',
  },
  CardFooter: {
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#C6C1C1',
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
  },
});

export default styles;
