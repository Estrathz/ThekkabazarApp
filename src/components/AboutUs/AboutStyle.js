import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts } from '../../theme';

const { width } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = width >= 768;
const isLargeScreen = width >= 1024;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Business Header Styles - Base styles (responsive values applied in component)
  businessHeader: {
    alignItems: 'center',
    backgroundColor: '#177bba',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#125a8a',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    opacity: 0.8,
  },
  businessHeaderContent: {
    alignItems: 'center',
    zIndex: 5,
    width: '100%',
  },
  businessHeaderIcon: {
    backgroundColor: 'rgba(241, 160, 118, 0.2)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(241, 160, 118, 0.4)',
  },
  businessHeaderTitle: {
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 5,
  },
  businessHeaderSubtitle: {
    color: '#f1a076',
    letterSpacing: 1,
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  trustBadges: {
    width: '100%',
    marginTop: 6,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(241, 160, 118, 0.3)',
  },
  trustBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 5,
  },

  scrollContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // About Section Styles - Base styles
  aboutSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutCard: {
    // Margin applied responsively in component
  },
  aboutImageContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  aboutImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(27, 54, 93, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  quotation: {
    fontWeight: '700',
    color: '#177bba',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },

  // Content Styles - Base styles
  contentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f1a076',
  },
  contentImage: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  contentText: {
    color: '#374151',
    lineHeight: 24,
    textAlign: 'justify',
  },

  // Services Section - Base styles
  servicesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#177bba',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontWeight: '700',
    color: '#177bba',
    textAlign: 'center',
    marginBottom: 8,
  },
  serviceDescription: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Why Choose Us Section - Base styles
  whyChooseContainer: {
    backgroundColor: '#177bba',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  reasonsContainer: {
    // Margin applied responsively in component
  },
  reasonCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f1a076',
  },
  reasonContent: {
    flex: 1,
  },
  reasonTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reasonDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },

  // Team Section - Base styles
  teamContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  teamSection: {
    // Margin applied responsively in component
  },
  teamTitle: {
    fontWeight: '700',
    color: '#177bba',
    marginBottom: 16,
    textAlign: 'center',
  },
  teamMembers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  teamMemberCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  teamImage: {
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#f1a076',
  },
  memberInfo: {
    alignItems: 'center',
  },
  memberName: {
    fontWeight: '700',
    color: '#177bba',
    marginBottom: 4,
    textAlign: 'center',
  },
  memberPosition: {
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 160, 118, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(241, 160, 118, 0.3)',
  },
  badgeText: {
    color: '#f1a076',
    fontWeight: '600',
    marginLeft: 4,
  },

  // Contact Section - Base styles
  contactContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  contactHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactTitle: {
    fontWeight: '800',
    color: '#177bba',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  contactForm: {
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#177bba',
    fontWeight: '500',
  },
  messageInput: {
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#177bba',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#177bba',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  contactInfoText: {
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },

  // Legacy styles (kept for compatibility)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#177bba',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#125a8a',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    opacity: 0.8,
  },
});

export default styles;