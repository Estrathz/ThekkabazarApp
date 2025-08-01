import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#000',
  },
  detailCardContainer: {
    padding: 15,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginVertical: 15,
  },
  tenderDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  detailContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  sourceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  organizationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  projectTypeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  procurementTypeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  worksHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
  },
  htmlContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  fileContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fileTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 15,
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