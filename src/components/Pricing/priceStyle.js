import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  PriceContainer: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 15,
  },
  PriceTitle: {
    color: colors.black,
    fontSize: 22,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
  },
  CardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    paddingBottom: 20,
  },
  CardHeader: {
    height: '15%',
    padding: 20,
  },
  CardBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    marginTop: 10,
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
});

export default styles;
