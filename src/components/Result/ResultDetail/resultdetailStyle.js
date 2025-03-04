import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    marginLeft: 10,
  },
  detailCardContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  tenderDetailsTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    elevation: 4,
    shadowOpacity: 0.5,
  },
  detailText: {
    color: '#bf0a7f',
    fontSize: 18,
    marginTop: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dateText: {
    color: '#bf0a7f',
    fontSize: 16,
    marginLeft: 8,
    marginTop: 4,
  },
  sourceText: {
    color: '#0F9E1D',
    marginTop: 10,
    fontSize: 18,
  },
  organizationText: {
    color: '#0F9E1D',
    marginTop: 10,
    fontSize: 18,
  },
  locationText: {
    color: '#0F9E1D',
    marginTop: 10,
    fontSize: 18,
  },
  projectTypeText: {
    color: '#0F9E1D',
    marginTop: 10,
    fontSize: 18,
  },
  procurementTypeText: {
    color: '#bf0a7f',
    marginTop: 10,
    fontSize: 18,
  },
  awardedToText: {
    color: 'black',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 20,
  },
  htmlContent: {
    fontSize: 14,
    color: 'black',
  },
  fileContainer: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'column',
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default styles;