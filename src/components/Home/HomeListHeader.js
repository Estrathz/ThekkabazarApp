import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '../../Containers/Slider/slider';
import styles from './homeStyles';
import {normalize} from '../../utils/responsive';

const FilterButtonsSection = React.memo(
  ({
    activeFilter,
    onFilterPress,
    onImagePress,
    hasActiveFilters = false,
    filterCount = 0,
  }) => {
    const [isImageActive, setIsImageActive] = useState(true);

    const filterButtons = [
      {id: 'All', label: 'All'},
      {id: 'PPMO/EGP', label: 'PPMO'},
      {id: 'Others', label: 'Newspaper'},
      {id: 'Result', label: 'Results'},
    ];

    const handleImagePress = () => {
      setIsImageActive(prev => !prev);
      onImagePress();
    };

    return (
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
          style={styles.filterScrollView}>
          {filterButtons.map((button, index) => (
            <TouchableOpacity
              key={button.id}
              style={[
                styles.filterButton,
                activeFilter === button.id && styles.filterButtonActive,
                index === 0 && styles.firstButton,
                index === filterButtons.length - 1 && styles.lastButton,
              ]}
              onPress={() => onFilterPress(button.id)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === button.id && styles.filterButtonTextActive,
                ]}>
                {button.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.filterActionContainer}>
          {hasActiveFilters && (
            <View style={styles.filterStatusContainer}>
              <View style={styles.filterStatusIndicator}>
                <Text style={styles.filterStatusText}>{filterCount}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.filterIconContainer,
              isImageActive && styles.filterButtonActive,
            ]}
            onPress={handleImagePress}
            activeOpacity={0.8}>
            <Icon
              name="image"
              size={normalize(14)}
              color={isImageActive ? '#FFFFFF' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const HomeSearchBar = React.memo(
  ({
    searchText,
    onSearchChange,
    onClearSearch,
    hasActiveFilters,
    activeFilterCount,
    onOpenModal,
  }) => (
    <View style={styles.navcontainer}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchSection,
            hasActiveFilters && {borderColor: '#0375B7', borderWidth: 2},
          ]}>
          <Icon
            style={styles.searchIcon}
            name="search"
            size={20}
            color="#666"
          />
          <TextInput
            placeholder="Search tenders (min 2 chars)"
            placeholderTextColor="#999"
            style={styles.searchTextInput}
            value={searchText}
            onChangeText={onSearchChange}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={onClearSearch}
              style={styles.clearSearchButton}>
              <Icon name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={onOpenModal}
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
          ]}>
          <Icon
            name="options"
            size={20}
            color={hasActiveFilters ? '#FFFFFF' : '#666'}
          />
          {hasActiveFilters && (
            <View style={styles.filterIndicator}>
              <Text style={styles.filterIndicatorText}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  ),
);

const HomeStaticHeader = React.memo(
  ({activeFilter, onFilterPress, onImagePress, hasActiveFilters, filterCount}) => (
    <>
      <Slider />
      <FilterButtonsSection
        activeFilter={activeFilter}
        onFilterPress={onFilterPress}
        onImagePress={onImagePress}
        hasActiveFilters={hasActiveFilters}
        filterCount={filterCount}
      />
    </>
  ),
);

const SearchLoadingStrip = React.memo(({visible}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.searchLoadingStrip}>
      <ActivityIndicator size="small" color="#0375B7" />
      <Text style={styles.searchLoadingStripText}>Searching tenders...</Text>
    </View>
  );
});

const HomeListHeader = ({
  searchText,
  onSearchChange,
  onClearSearch,
  hasActiveFilters,
  activeFilterCount,
  onOpenModal,
  activeFilter,
  onFilterPress,
  onImagePress,
  isSearching = false,
}) => (
  <>
    <HomeSearchBar
      searchText={searchText}
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
      hasActiveFilters={hasActiveFilters}
      activeFilterCount={activeFilterCount}
      onOpenModal={onOpenModal}
    />
    <HomeStaticHeader
      activeFilter={activeFilter}
      onFilterPress={onFilterPress}
      onImagePress={onImagePress}
      hasActiveFilters={hasActiveFilters}
      filterCount={activeFilterCount}
    />
    <SearchLoadingStrip visible={isSearching} />
  </>
);

export default HomeListHeader;
