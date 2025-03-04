import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
  },
  title: {
    color: '#0375B7',
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 10,
  },
  aboutSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  quotation: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: 'black',
    fontSize: 16,
    padding: 20,
    textAlign: 'justify',
  },
  serviceContainer: {
    backgroundColor: colors.background,
    marginTop: 10,
    padding: 10,
  },
  sectionTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  serviceDescription: {
    color: 'black',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 10,
  },
  serviceItem: {
    alignItems: 'center',
    marginTop: 5,
  },
  teamContainer: {
    flex: 1,
    marginTop: 20,
    padding: 10,
  },
  teamTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamMembers: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  teamMembers: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start
    flexWrap: 'wrap',
  },
  
  teamMember: {
    width: '40%',
    marginTop: 10,// Center items horizontally
  },

  teamImage: {
    height: 72, // Reduced from 80 to 72 (10% reduction)
    width: '54%', // Reduced from 60% to 54% (10% reduction)
    aspectRatio: 1.5,
    marginBottom: 8, // Add some space between the image and text
  },

  memberName: {
    color: 'black',
    fontSize: 14,
  },

  memberPosition: {
    color: 'black',
    fontSize: 12,

  },
  Formcontainer: {
    marginTop: 20,
    padding: 6,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactTitle: {
    color: '#0375B7',
    fontSize: 24,
    alignSelf: 'center',
  },
  contactSubtitle: {
    color: 'black',
    fontSize: 16,
    alignSelf: 'center',
  },
  input: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    color: 'black',
  },
});

export default styles;