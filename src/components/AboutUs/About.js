import { View, Text, Image, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './AboutStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { aboutUsdata, aboutUsform } from '../../reducers/aboutSlice';
import { useDispatch, useSelector } from 'react-redux';
import Custombutton from '../../Containers/Button/button';
import Toast from 'react-native-toast-message';
import he from 'he';
import RenderHtml from 'react-native-render-html';

/**
 * Business & TAX Services - About Us Page
 * Professional design tailored for financial and business services
 * Fully responsive for all device sizes
 */

const { width, height } = Dimensions.get('window');

// Responsive utilities
const isTablet = width >= 768;
const isLargeScreen = width >= 1024;
const isSmallScreen = width < 375;

const getResponsiveValue = (small, medium, large) => {
  if (isLargeScreen) return large;
  if (isTablet) return medium;
  return small;
};

const getServiceColumns = () => {
  if (isLargeScreen) return 4;
  if (isTablet) return 3;
  return 2;
};

const getTeamColumns = () => {
  if (isLargeScreen) return 3;
  if (isTablet) return 2;
  return 2;
};

const About = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.about);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    subject: '',
    message: '',
    service_type: '', // New field for business services
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    dispatch(aboutUsdata());
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load about us data',
        visibilityTime: 3000,
        autoHide: true,
      });
    }

    return () => subscription?.remove();
  }, [dispatch, error]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitMessage = () => {
    const { name, email, phone_number, subject, message } = formData;
    if (!name || !email || !phone_number || !subject || !message) {
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    dispatch(aboutUsform(formData));
    setFormData({ name: '', email: '', phone_number: '', subject: '', message: '', service_type: '' });
  };

  // Responsive Business & TAX Services Header
  const renderBusinessHeader = () => (
    <View style={[styles.businessHeader, { 
      paddingHorizontal: getResponsiveValue(16, 24, 32),
      paddingTop: getResponsiveValue(40, 50, 60),
      paddingBottom: getResponsiveValue(16, 20, 24)
    }]}>
      <View style={styles.headerBackground} />
      
      <View style={styles.businessHeaderContent}>
        <View style={[styles.businessHeaderIcon, {
          padding: getResponsiveValue(12, 14, 16),
          marginBottom: getResponsiveValue(8, 10, 12)
        }]}>
          <Ionicons 
            name="business" 
            size={getResponsiveValue(24, 28, 32)} 
            color="#f1a076" 
          />
        </View>
        <Text style={[styles.businessHeaderTitle, {
          fontSize: getResponsiveValue(18, 22, 26)
        }]}>Business & TAX Services</Text>
        <Text style={[styles.businessHeaderSubtitle, {
          fontSize: getResponsiveValue(11, 13, 15)
        }]}>Your Trusted Financial Partner</Text>
        
        <View style={[styles.trustBadges, {
          flexDirection: isTablet ? 'row' : 'row',
          justifyContent: 'space-around',
          flexWrap: isSmallScreen ? 'wrap' : 'nowrap'
        }]}>
          <View style={[styles.trustBadge, {
            marginBottom: isSmallScreen ? 8 : 0,
            paddingHorizontal: getResponsiveValue(8, 10, 12)
          }]}>
            <Ionicons name="ribbon" size={getResponsiveValue(14, 16, 18)} color="#f1a076" />
            <Text style={[styles.trustBadgeText, {
              fontSize: getResponsiveValue(9, 10, 11)
            }]}>Certified</Text>
          </View>
          <View style={[styles.trustBadge, {
            marginBottom: isSmallScreen ? 8 : 0,
            paddingHorizontal: getResponsiveValue(8, 10, 12)
          }]}>
            <Ionicons name="shield-checkmark" size={getResponsiveValue(14, 16, 18)} color="#f1a076" />
            <Text style={[styles.trustBadgeText, {
              fontSize: getResponsiveValue(9, 10, 11)
            }]}>Trusted</Text>
          </View>
          <View style={[styles.trustBadge, {
            marginBottom: isSmallScreen ? 8 : 0,
            paddingHorizontal: getResponsiveValue(8, 10, 12)
          }]}>
            <Ionicons name="time" size={getResponsiveValue(14, 16, 18)} color="#f1a076" />
            <Text style={[styles.trustBadgeText, {
              fontSize: getResponsiveValue(9, 10, 11)
            }]}>24/7 Support</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Responsive Core Services Section
  const renderCoreServices = () => {
    const services = [
      {
        icon: 'calculator',
        title: 'Tax Preparation',
        description: 'Professional tax filing and optimization services for individuals and businesses',
        color: '#2E8B57'
      },
      {
        icon: 'trending-up',
        title: 'Business Consulting',
        description: 'Strategic business advice to help grow and optimize your operations',
        color: '#4682B4'
      },
      {
        icon: 'document-text',
        title: 'Financial Planning',
        description: 'Comprehensive financial planning and investment advisory services',
        color: '#B8860B'
      },
      {
        icon: 'people',
        title: 'Corporate Services',
        description: 'Business formation, compliance, and corporate governance solutions',
        color: '#8B4513'
      }
    ];

    const serviceColumns = getServiceColumns();
    const serviceCardWidth = (dimensions.width - (getResponsiveValue(48, 64, 80))) / serviceColumns - (serviceColumns > 2 ? 8 : 0);

    return (
      <View style={[styles.servicesContainer, {
        margin: getResponsiveValue(12, 16, 20),
        padding: getResponsiveValue(16, 20, 24)
      }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {
            fontSize: getResponsiveValue(22, 26, 30)
          }]}>Our Core Services</Text>
          <Text style={[styles.sectionSubtitle, {
            fontSize: getResponsiveValue(14, 16, 18)
          }]}>Comprehensive solutions for your business needs</Text>
        </View>
        
        <View style={[styles.servicesGrid, {
          justifyContent: isLargeScreen ? 'space-between' : 'space-around'
        }]}>
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={[styles.serviceCard, {
              width: serviceCardWidth,
              padding: getResponsiveValue(12, 16, 20),
              marginBottom: getResponsiveValue(12, 16, 20)
            }]}>
              <View style={[styles.serviceIcon, { 
                backgroundColor: `${service.color}15`,
                width: getResponsiveValue(50, 60, 70),
                height: getResponsiveValue(50, 60, 70),
                borderRadius: getResponsiveValue(25, 30, 35)
              }]}>
                <Ionicons 
                  name={service.icon} 
                  size={getResponsiveValue(20, 24, 28)} 
                  color={service.color} 
                />
              </View>
              <Text style={[styles.serviceTitle, {
                fontSize: getResponsiveValue(14, 16, 18)
              }]}>{service.title}</Text>
              <Text style={[styles.serviceDescription, {
                fontSize: getResponsiveValue(11, 13, 14)
              }]}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Responsive Why Choose Us Section
  const renderWhyChooseUs = () => (
    <View style={[styles.whyChooseContainer, {
      margin: getResponsiveValue(12, 16, 20),
      padding: getResponsiveValue(20, 24, 28)
    }]}>
      <Text style={[styles.sectionTitle, {
        fontSize: getResponsiveValue(22, 26, 30),
        color: '#FFFFFF'
      }]}>Why Choose Us?</Text>
      
      <View style={[styles.reasonsContainer, {
        marginTop: getResponsiveValue(16, 20, 24)
      }]}>
        {[
          { icon: 'trophy', title: '15+ Years Experience', description: 'Proven track record in financial services' },
          { icon: 'people', title: 'Expert Team', description: 'Certified professionals at your service' },
          { icon: 'lock-closed', title: 'Secure & Confidential', description: 'Your data protection is our priority' },
          { icon: 'cash', title: 'Cost Effective', description: 'Competitive pricing with maximum value' }
        ].map((reason, index) => (
          <View key={index} style={[styles.reasonCard, {
            padding: getResponsiveValue(12, 16, 20),
            marginBottom: getResponsiveValue(12, 16, 20),
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: isSmallScreen ? 'center' : 'center'
          }]}>
            <Ionicons 
              name={reason.icon} 
              size={getResponsiveValue(28, 32, 36)} 
              color="#f1a076" 
            />
            <View style={[styles.reasonContent, {
              marginLeft: isSmallScreen ? 0 : 16,
              marginTop: isSmallScreen ? 8 : 0,
              alignItems: isSmallScreen ? 'center' : 'flex-start'
            }]}>
              <Text style={[styles.reasonTitle, {
                fontSize: getResponsiveValue(14, 16, 18),
                textAlign: isSmallScreen ? 'center' : 'left'
              }]}>{reason.title}</Text>
              <Text style={[styles.reasonDescription, {
                fontSize: getResponsiveValue(12, 14, 16),
                textAlign: isSmallScreen ? 'center' : 'left'
              }]}>{reason.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const removeHtmlTags = (text) => (typeof text === 'string' ? text.replace(/<[^>]*>/g, '') : '');
  const decodeHtmlEntities = (text) => (typeof text === 'string' ? he.decode(text) : '');

  const renderContent = (htmlContent) => {
    if (!htmlContent) return null;
    
    const imgMatch = htmlContent.match(/src="([^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : null;
    const textContent = htmlContent.replace(/<img[^>]*>/g, '').trim();
    
    return (
      <View style={[styles.contentCard, {
        padding: getResponsiveValue(12, 16, 20)
      }]}>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={[styles.contentImage, {
              minHeight: getResponsiveValue(350, 450, 550),
              maxHeight: getResponsiveValue(500, 650, 800)
            }]}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.contentText, {
          fontSize: getResponsiveValue(14, 16, 18)
        }]}>
          {decodeHtmlEntities(removeHtmlTags(textContent))}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderBusinessHeader()}

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Responsive About Section */}
        <View style={[styles.aboutSection, {
          padding: getResponsiveValue(16, 20, 24),
          margin: getResponsiveValue(12, 16, 20)
        }]}>
          {data?.about_us?.map((item, index) => (
            <View key={index} style={[styles.aboutCard, {
              marginBottom: getResponsiveValue(16, 20, 24)
            }]}>
              <Text style={[styles.quotation, {
                fontSize: getResponsiveValue(16, 18, 20)
              }]}>{decodeHtmlEntities(item.quotation)}</Text>
              {renderContent(item.description)}
            </View>
          ))}
        </View>

        {/* Core Services */}
        {renderCoreServices()}

        {/* Why Choose Us */}
        {renderWhyChooseUs()}

        {/* Responsive Team Section */}
        <View style={[styles.teamContainer, {
          margin: getResponsiveValue(12, 16, 20),
          padding: getResponsiveValue(16, 20, 24)
        }]}>
          <Text style={[styles.sectionTitle, {
            fontSize: getResponsiveValue(22, 26, 30)
          }]}>Meet Our Experts</Text>
          <Text style={[styles.sectionSubtitle, {
            fontSize: getResponsiveValue(14, 16, 18)
          }]}>Professional team dedicated to your success</Text>
          
          {data?.team_types?.map((team, index) => (
            <View key={index} style={[styles.teamSection, {
              marginBottom: getResponsiveValue(20, 24, 28)
            }]}>
              <Text style={[styles.teamTitle, {
                fontSize: getResponsiveValue(18, 20, 22)
              }]}>{team.name}</Text>
              <View style={[styles.teamMembers, {
                justifyContent: isLargeScreen ? 'space-between' : 'space-around'
              }]}>
                {team.myteam.map((member, memberIndex) => {
                  const teamColumns = getTeamColumns();
                  const memberCardWidth = (dimensions.width - (getResponsiveValue(48, 64, 80))) / teamColumns - (teamColumns > 2 ? 8 : 0);
                  
                  return (
                    <View key={memberIndex} style={[styles.teamMemberCard, {
                      width: memberCardWidth,
                      padding: getResponsiveValue(10, 12, 16),
                      marginBottom: getResponsiveValue(12, 16, 20)
                    }]}>
                      <Image 
                        source={{ uri: member.image }} 
                        style={[styles.teamImage, {
                          width: getResponsiveValue(70, 80, 90),
                          height: getResponsiveValue(70, 80, 90),
                          borderRadius: getResponsiveValue(35, 40, 45)
                        }]} 
                      />
                      <View style={styles.memberInfo}>
                        <Text style={[styles.memberName, {
                          fontSize: getResponsiveValue(14, 16, 18)
                        }]}>{member.name}</Text>
                        <Text style={[styles.memberPosition, {
                          fontSize: getResponsiveValue(11, 13, 14)
                        }]}>{member.position}</Text>
                        <View style={styles.memberBadge}>
                          <Ionicons 
                            name="ribbon" 
                            size={getResponsiveValue(10, 12, 14)} 
                            color="#f1a076" 
                          />
                          <Text style={[styles.badgeText, {
                            fontSize: getResponsiveValue(9, 11, 12)
                          }]}>Certified</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Responsive Enhanced Contact Form */}
        <View style={[styles.contactContainer, {
          margin: getResponsiveValue(12, 16, 20),
          marginBottom: getResponsiveValue(24, 30, 36),
          padding: getResponsiveValue(20, 24, 28)
        }]}>
          <View style={[styles.contactHeader, {
            marginBottom: getResponsiveValue(20, 24, 28),
            paddingBottom: getResponsiveValue(16, 20, 24)
          }]}>
            <Ionicons 
              name="people" 
              size={getResponsiveValue(28, 32, 36)} 
              color="#177bba" 
            />
            <Text style={[styles.contactTitle, {
              fontSize: getResponsiveValue(20, 24, 28)
            }]}>Let's Discuss Your Needs</Text>
            <Text style={[styles.contactSubtitle, {
              fontSize: getResponsiveValue(14, 16, 18)
            }]}>Get a free consultation from our experts</Text>
          </View>

          <View style={styles.contactForm}>
            {[
              { field: 'name', placeholder: 'Full Name *', icon: 'person' },
              { field: 'email', placeholder: 'Email Address *', icon: 'mail' },
              { field: 'phone_number', placeholder: 'Phone Number *', icon: 'call' },
              { field: 'service_type', placeholder: 'Service Interest', icon: 'briefcase' },
              { field: 'subject', placeholder: 'Subject *', icon: 'pricetag' }
            ].map((input, index) => (
              <View key={index} style={[styles.inputContainer, {
                paddingHorizontal: getResponsiveValue(12, 16, 20),
                marginBottom: getResponsiveValue(12, 16, 20)
              }]}>
                <Ionicons 
                  name={input.icon} 
                  size={getResponsiveValue(14, 16, 18)} 
                  color="#177bba" 
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder={input.placeholder}
                  placeholderTextColor="#8A8A8A"
                  style={[styles.input, {
                    fontSize: getResponsiveValue(14, 16, 18),
                    paddingVertical: getResponsiveValue(14, 16, 18)
                  }]}
                  value={formData[input.field]}
                  onChangeText={text => handleInputChange(input.field, text)}
                />
              </View>
            ))}
            
            <View style={[styles.inputContainer, {
              paddingHorizontal: getResponsiveValue(12, 16, 20),
              marginBottom: getResponsiveValue(12, 16, 20)
            }]}>
              <Ionicons 
                name="chatbubble" 
                size={getResponsiveValue(14, 16, 18)} 
                color="#177bba" 
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Tell us about your requirements *"
                placeholderTextColor="#8A8A8A"
                style={[styles.input, styles.messageInput, {
                  fontSize: getResponsiveValue(14, 16, 18),
                  paddingVertical: getResponsiveValue(14, 16, 18),
                  minHeight: getResponsiveValue(80, 100, 120)
                }]}
                value={formData.message}
                onChangeText={text => handleInputChange('message', text)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, {
                paddingVertical: getResponsiveValue(16, 18, 20),
                paddingHorizontal: getResponsiveValue(20, 24, 28)
              }]} 
              onPress={handleSubmitMessage}
            >
              <Ionicons 
                name="send" 
                size={getResponsiveValue(14, 16, 18)} 
                color="#fff" 
                style={styles.submitIcon}
              />
              <Text style={[styles.submitButtonText, {
                fontSize: getResponsiveValue(14, 16, 18)
              }]}>Send Message</Text>
            </TouchableOpacity>

            <View style={[styles.contactInfo, {
              marginTop: getResponsiveValue(20, 24, 28),
              paddingTop: getResponsiveValue(16, 20, 24)
            }]}>
              <Text style={[styles.contactInfoText, {
                fontSize: getResponsiveValue(12, 14, 16)
              }]}>📞 Call us: 9851411188</Text>
              <Text style={[styles.contactInfoText, {
                fontSize: getResponsiveValue(12, 14, 16)
              }]}>📧 Email: thekkabazar@gmail.com</Text>
              <Text style={[styles.contactInfoText, {
                fontSize: getResponsiveValue(12, 14, 16)
              }]}>🕒 Mon - Fri: 10 AM - 6 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default About;