import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ImageBackground, 
  Image, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchbazarData } from '../../reducers/bazarSlice';
import styles from './bazarStyle';
import CustomButton from '../../Containers/Button/button';
import { wp, hp, normalize, spacing, deviceInfo } from '../../utils/responsive';
import { fonts, colors } from '../../theme';

const Bazar = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const { data, error, status } = useSelector(state => state.bazar);
  const { isAuthenticated, access_token } = useSelector(state => state.users);

  // Component state
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Fetch bazar data with error handling
  const fetchData = useCallback(async () => {
    try {
      await dispatch(fetchbazarData()).unwrap();
    } catch (error) {
      console.error('Failed to fetch bazar data:', error);
      Alert.alert(
        'Error',
        'Failed to load categories. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  }, [dispatch]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  // Navigation handlers with authentication checks
  const handleBazarDetail = useCallback((name) => {
    if (!isAuthenticated || !access_token || access_token.trim() === '') {
      Alert.alert(
        'Login Required',
        'Please login to view product details.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    navigation.navigate('BazarDetail', { name, pathname: 'mainProduct' });
  }, [isAuthenticated, access_token, navigation]);

  const handleBazarSubDetail = useCallback((name) => {
    if (!isAuthenticated || !access_token || access_token.trim() === '') {
      Alert.alert(
        'Login Required',
        'Please login to view subcategory details.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    navigation.navigate('BazarDetail', { name, pathname: 'subProduct' });
  }, [isAuthenticated, access_token, navigation]);

  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading categories...</Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Failed to load categories. Please try again.
      </Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={handleRefresh}
        disabled={isRefreshing}
      >
        <Text style={styles.retryButtonText}>
          {isRefreshing ? 'Retrying...' : 'Retry'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No categories available</Text>
      <Text style={styles.emptySubText}>Check back later for new categories</Text>
    </View>
  );

  // Render category card
  const renderCategoryCard = useCallback((item, index) => (
    <View key={`category-${index}`} style={styles.bazarCard}>
      <View style={styles.bazarCardContent}>
        <Image
          style={styles.bazarImage2}
          source={{ uri: item.image }}
          onError={(error) => console.log('Category image load error:', error.nativeEvent.error)}
          defaultSource={require('../../assets/dummy-image.png')}
        />
        <View style={styles.bazarTextContainer}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={styles.bazarItemName}
          >
            {item.name || 'Unnamed Category'}
          </Text>
          <CustomButton
            title="View All"
            onPress={() => handleBazarDetail(item.name)}
            style={[
              styles.viewAllButton,
              {
                marginTop: spacing.md,
                paddingVertical: hp(1.8),
                paddingHorizontal: spacing.lg,
              }
            ]}
            textStyle={{
              fontSize: normalize(deviceInfo.isTablet ? 16 : 14),
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: fonts.medium,
            }}
          />
        </View>
      </View>
      
      {/* Subcategories */}
      {item?.subcategory && item.subcategory.length > 0 && (
        <View style={styles.subcategoryContainer}>
          {item.subcategory.map((sub, subIndex) => (
            <View key={`subcategory-${index}-${subIndex}`} style={styles.subcategoryItem}>
              <Image
                style={styles.bazarImage3}
                source={{ uri: sub.image }}
                onError={(error) => console.log('Subcategory image load error:', error.nativeEvent.error)}
                defaultSource={require('../../assets/dummy-image.png')}
              />
              <TouchableOpacity onPress={() => handleBazarSubDetail(sub.name)}>
                <Text style={styles.subcategoryName}>
                  {sub.name || 'Unnamed Subcategory'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  ), [handleBazarDetail, handleBazarSubDetail]);

  // Render header
  const renderHeader = () => (
    <View>
      <ImageBackground
        style={styles.bazarImageContainer}
        source={require('../../assets/carousel.jpg')}
        resizeMode="cover"
      >
        <Image
          style={styles.bazarImage}
          source={require('../../assets/bazarImage.png')}
        />
        <Text style={styles.bazarText}>
          Your One-Stop Marketplace for Construction Materials
        </Text>
      </ImageBackground>
    </View>
  );

  return (
    <ScrollView 
      style={styles.Bazarcontainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {renderHeader()}

      {/* Loading State */}
      {status === 'loading' && renderLoadingState()}

      {/* Error State */}
      {status === 'failed' && renderErrorState()}

      {/* Success State with Data */}
      {status === 'succeeded' && data && data.length > 0 && (
        data.map((item, index) => renderCategoryCard(item, index))
      )}

      {/* Empty State */}
      {status === 'succeeded' && (!data || data.length === 0) && renderEmptyState()}
    </ScrollView>
  );
};

export default Bazar;