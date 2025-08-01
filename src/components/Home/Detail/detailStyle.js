import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  detailCardContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
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
  detailContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    elevation: 4,
    shadowOpacity: 0.5,
  },
  worksHeader: {
    color: 'black',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 20,
  },
  htmlContent: {
    fontSize: 12,
    color: 'black',
  },
  fileContainer: {
    marginTop: 10,
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
  // Download Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0375B7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  activityIndicator: {
    marginTop: 5,
  },
});

export default styles;