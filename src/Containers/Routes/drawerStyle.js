import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 90,
    aspectRatio: 2 / 1,
  },
  drawerHeader: {
    height: '30%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerItemContainer: {
    flex: 1,
  },
  drawerItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  drawerItemText: {
    color: 'black',
    fontSize: 22,
    marginLeft: 10,
  },
});

export default styles;
