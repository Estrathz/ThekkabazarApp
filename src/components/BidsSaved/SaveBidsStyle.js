import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bidsCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  activeTab: {
    borderRadius: 18,
    backgroundColor: colors.primary,
    shadowColor: 'black',
    shadowOffset: {width: 3, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabButtonText: {
    fontSize: 18,
    color: 'black',
  },
  interestCard: {
    margin: 15,
    backgroundColor: colors.white,
    padding: 8,
  },
  interestText: {
    color: 'black',
    fontSize: 20,
    fontFamily: fonts.regular,
  },
});

export default styles;
