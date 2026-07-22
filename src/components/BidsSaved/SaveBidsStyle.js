import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listWrapper: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 10,
    color: 'black',
    fontWeight: '600',
  },
  listContent: {
    padding: 10,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  Card: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    padding: 10,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
    borderRadius: 6,
    width: '100%',
    alignSelf: 'stretch',
  },
  image: {
    height: 90,
    width: 90,
    marginTop: 20,
    resizeMode: 'contain',
    borderRadius: 5,
  },
  CardText: {
    color: '#808080',
    fontSize: 14,
    marginLeft: 8,
  },
  cusBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 15,
    height: 35,
    borderWidth: 1,
    borderColor: colors.gray,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default styles;
