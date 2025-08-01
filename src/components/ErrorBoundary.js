import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // After max retries, show a different message
      Alert.alert(
        'Unable to Recover',
        'The app encountered a persistent error. Please restart the app.',
        [
          {
            text: 'OK',
            onPress: () => {
              // You could implement app restart logic here
              this.setState({ hasError: false });
            }
          }
        ]
      );
    }
  }

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    // In a real app, you would send this to your error reporting service
    const errorReport = {
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      appVersion: '22.0', // Get from your app config
    };

    if (__DEV__) {
      console.log('Error Report:', errorReport);
    }

    Alert.alert(
      'Error Reported',
      'Thank you for reporting this issue. We will investigate and fix it.',
      [{ text: 'OK' }]
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle-outline" size={80} color="#FF6B6B" />
            </View>
            
            <Text style={styles.title}>Oops! Something went wrong</Text>
            
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Don't worry, your data is safe.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={this.handleRetry}
                activeOpacity={0.8}
              >
                <Icon name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>
                  Try Again ({this.state.retryCount}/3)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.reportButton}
                onPress={this.handleReportError}
                activeOpacity={0.8}
              >
                <Icon name="bug-outline" size={20} color="#0375B7" />
                <Text style={styles.reportButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helpText}>
              If the problem persists, please restart the app or contact support.
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  debugContainer: {
    backgroundColor: '#F1F2F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 40,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#0375B7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#0375B7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0375B7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportButtonText: {
    color: '#0375B7',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ErrorBoundary;
