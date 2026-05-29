import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

// Icons
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import Slider from '../../Containers/Slider/slider';
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import DatePicker from 'react-native-date-picker';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

// Redux Actions
import {fetchDropdownData} from '../../reducers/dropdownSlice';
import {
  fetchTenderListData,
  fetchNewspaperTenderList,
  hydrateTenderListFromCache,
  hydrateNewspaperFromCache,
  savebid,
  searchTenderData,
} from '../../reducers/cardSlice';
import {
  fetchresultData,
  hydrateResultListFromCache,
} from '../../reducers/resultSlice';
import {getSavedBids} from '../../reducers/profileSlice';

// Styles and Utils
import styles from './homeStyles';
import Toast from 'react-native-toast-message';
import {normalize} from '../../utils/responsive';
import {
  NEWSPAPER_CACHE_KEY,
  NEWSPAPER_DAYS_WINDOW,
  dedupeTendersByPk,
} from '../../utils/newspaperTenders';
import {getTenderDefaultImage} from '../../utils/tenderImage';
import {getErrorMessage} from '../../utils/errorMessage';

// Constants
const INITIAL_FILTERS = {
  organization_sector: '',
  category: '',
  district: '',
  project_type: '',
  procurement_type: '',
  source: '',
  // search removed - handled client-side only
};

// Add new constants for retry and timeout configuration
const API_RETRY_COUNT = 3;
const API_TIMEOUT = 30000; // 30 seconds
const RETRY_DELAY = 1000; // 1 second
const HOME_TENDER_CACHE_KEY = 'home:tender:list:v1';
const HOME_RESULT_CACHE_KEY = 'home:result:list:v1';

// Add AdSpace component
const AdSpace = () => {
  return (
    <View style={styles.adContainer}>
      <ImageBackground
        source={require('../../assets/dummy-ads.jpg')}
        style={styles.adImage}
        resizeMode="cover"
      />
    </View>
  );
};

// Updated FilterButtonsSection component - Responsive & Movable
const FilterButtonsSection = ({
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
    setIsImageActive(!isImageActive);
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
        {/* Filter Status Indicator */}
        {hasActiveFilters && (
          <View style={styles.filterStatusContainer}>
            <View style={styles.filterStatusIndicator}>
              <Text style={styles.filterStatusText}>{filterCount}</Text>
            </View>
          </View>
        )}

        {/* Image Gallery Button */}
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
};

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    data,
    newspaperData,
    error: apiError,
    loading: cardLoading,
    newspaperLoading,
    newspaperError,
  } = useSelector(state => state.card);
  const {dropdowndata, dropdownerror} = useSelector(state => state.dropdown);
  const {isAuthenticated} = useSelector(state => state.users);
  const {savedBids} = useSelector(state => state.userprofile);
  const {
    data: resultData,
    error: resultError,
    loading: resultLoading,
  } = useSelector(state => state.result);

  // State management
  const [isModalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [date, setDate] = useState(new Date());
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [datepicker, setDatepicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // Add state for active filter
  const [filtersJustApplied, setFiltersJustApplied] = useState(false); // Track when filters were just applied
  const [newspaperCachedData, setNewspaperCachedData] = useState([]);
  // Set of tender pks the current user has saved, so the Save button reflects
  // saved state across the app until removed from the Saved Bids page.
  const [savedPks, setSavedPks] = useState(() => new Set());

  // Check if we have active filters (dropdown filters or date only)
  const hasActiveFilters = useMemo(() => {
    const hasDropdownFilters = Object.values(filters).some(
      value => value && value.trim() !== '',
    );
    const hasDateFilter = useCustomDate;
    return hasDropdownFilters || hasDateFilter;
  }, [filters, useCustomDate]);

  // Count active filters for display
  const activeFilterCount = useMemo(() => {
    const dropdownCount = Object.values(filters).filter(
      value => value && value.trim() !== '',
    ).length;
    const dateCount = useCustomDate ? 1 : 0;
    return dropdownCount + dateCount;
  }, [filters, useCustomDate]);

  // Hydrate from local cache first, then refresh in background
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cachedTenderRaw, cachedResultRaw] = await Promise.all([
          AsyncStorage.getItem(HOME_TENDER_CACHE_KEY),
          AsyncStorage.getItem(HOME_RESULT_CACHE_KEY),
        ]);

        if (cachedTenderRaw) {
          const cachedTender = JSON.parse(cachedTenderRaw);
          dispatch(hydrateTenderListFromCache(cachedTender));
        }

        if (cachedResultRaw) {
          const cachedResult = JSON.parse(cachedResultRaw);
          dispatch(hydrateResultListFromCache(cachedResult));
        }

        const cachedNewspaperRaw = await AsyncStorage.getItem(
          NEWSPAPER_CACHE_KEY,
        );
        if (cachedNewspaperRaw) {
          const cachedNewspaper = JSON.parse(cachedNewspaperRaw);
          if (Array.isArray(cachedNewspaper) && cachedNewspaper.length) {
            setNewspaperCachedData(cachedNewspaper);
            dispatch(
              hydrateNewspaperFromCache({
                data: cachedNewspaper,
                count: cachedNewspaper.length,
              }),
            );
          }
        }

        await Promise.all([
          dispatch(fetchTenderListData({page: 1, page_size: 100})),
          dispatch(fetchDropdownData()),
          dispatch(fetchresultData({page: 1, page_size: 100})),
          dispatch(fetchNewspaperTenderList({days: NEWSPAPER_DAYS_WINDOW})),
        ]);
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Persist latest list payloads for instant next launch rendering
  useEffect(() => {
    if (data?.data?.length) {
      const hasSearch = !!searchText?.trim();
      if (hasSearch || hasActiveFilters || activeFilter === 'Result') {
        return;
      }
      AsyncStorage.setItem(HOME_TENDER_CACHE_KEY, JSON.stringify(data)).catch(
        () => {},
      );
    }
  }, [data, searchText, hasActiveFilters, activeFilter]);

  useEffect(() => {
    if (resultData?.data?.length) {
      AsyncStorage.setItem(
        HOME_RESULT_CACHE_KEY,
        JSON.stringify(resultData),
      ).catch(() => {});
    }
  }, [resultData]);

  const refreshNewspaperData = useCallback(() => {
    if (hasActiveFilters || (searchText && searchText.trim() !== '')) {
      return Promise.resolve();
    }

    return dispatch(
      fetchNewspaperTenderList({
        days: NEWSPAPER_DAYS_WINDOW,
        forceRefresh: true,
      }),
    );
  }, [dispatch, hasActiveFilters, searchText]);

  // Persist complete 5-day newspaper list after full fetch.
  useEffect(() => {
    if (
      !Array.isArray(newspaperData?.data) ||
      newspaperData.data.length === 0
    ) {
      return;
    }

    const latestNewspaperData = (newspaperData.data || []).filter(
      item => item?.source !== 'PPMO/EGP',
    );
    setNewspaperCachedData(latestNewspaperData);
    AsyncStorage.setItem(
      NEWSPAPER_CACHE_KEY,
      JSON.stringify(latestNewspaperData),
    ).catch(() => {});
  }, [newspaperData]);

  // Focus effect to refresh data when returning to the screen
  useFocusEffect(
    useCallback(() => {
      // Refresh data when screen comes into focus
      // BUT NOT when filters are applied and intentionally returned empty results
      const refreshData = async () => {
        try {
          // Keep saved-bid state fresh on focus (covers saves/removals made on
          // other screens).
          if (isAuthenticated) {
            dispatch(getSavedBids());
          }

          // Don't auto-refresh if we have active filters or just applied filters - respect the filtered empty results
          if (hasActiveFilters || filtersJustApplied) {
            return;
          }

          if (activeFilter === 'Result') {
            // Refresh result data if Result filter is active
            if (!resultData?.data || resultData.data.length === 0) {
              await dispatch(fetchresultData({page: 1, page_size: 100}));
            }
          } else if (activeFilter === 'Others') {
            await refreshNewspaperData();
          } else {
            // Refresh tender data if other filters are active
            if (!data?.data || data.data.length === 0) {
              await dispatch(fetchTenderListData({page: 1, page_size: 100}));
            }
          }
        } catch (error) {
          // Error handling without console.log
        }
      };

      refreshData();
    }, [
      dispatch,
      activeFilter,
      data?.data,
      resultData?.data,
      hasActiveFilters,
      filtersJustApplied,
      refreshNewspaperData,
      isAuthenticated,
    ]),
  );

  // Server-side search function
  const performServerSideSearch = useCallback(
    async (searchText, pageNum = 1) => {
      if (
        !searchText ||
        searchText.trim() === '' ||
        searchText.trim().length < 2
      ) {
        return;
      }

      try {
        setIsSearching(true);
        setRefreshing(true);

        const searchParams = {
          searchText: searchText.trim(),
          page: pageNum,
          page_size: 50,
          activeFilter,
          ...filters,
          ...(useCustomDate && {
            published_date: moment(date).format('YYYY-MM-DD'),
          }),
        };

        // Call the search API
        if (activeFilter === 'Result') {
          await dispatch(fetchresultData(searchParams));
        } else if (activeFilter === 'All') {
          await Promise.all([
            dispatch(searchTenderData(searchParams)),
            dispatch(fetchresultData(searchParams)),
          ]);
        } else {
          await dispatch(searchTenderData(searchParams));
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Search Error',
          text2: 'Failed to perform search. Please try again.',
          visibilityTime: 3000,
        });
      } finally {
        setRefreshing(false);
        setIsSearching(false);
      }
    },
    [dispatch, activeFilter, filters, useCustomDate, date],
  );

  // Simple data display logic with proper empty results handling
  const displayData = useMemo(() => {
    let baseData = [];
    const hasSearch = !!(searchText && searchText.trim() !== '');

    // Step 1: Handle filtered empty results properly
    // If we have active filters and the API returned empty results, show empty data
    if (hasActiveFilters) {
      const tenderCount = data?.count ?? 0;
      const resultCount = resultData?.count ?? 0;

      // If filters are applied and API returned 0 results, show empty regardless of cached data
      if (activeFilter === 'Result' && resultCount === 0) {
        return [];
      } else if (
        activeFilter === 'All' &&
        tenderCount === 0 &&
        resultCount === 0
      ) {
        return [];
      } else if (
        (activeFilter === 'PPMO/EGP' || activeFilter === 'Others') &&
        tenderCount === 0
      ) {
        return [];
      }
    }

    // Step 2: Get base data based on selected tab (normal case)
    if (activeFilter === 'All') {
      const tenderItems = (data?.data || []).map((item, index) => ({
        ...item,
        __itemType: 'tender',
        __stableKey: `tender-${item?.pk ?? item?.id ?? index}`,
      }));
      const resultItems = (resultData?.data || []).map((item, index) => ({
        ...item,
        __itemType: 'result',
        __stableKey: `result-${item?.pk ?? item?.id ?? index}`,
      }));
      baseData = [...tenderItems, ...resultItems];
    } else if (activeFilter === 'Result') {
      baseData = (resultData?.data || []).map((item, index) => ({
        ...item,
        __itemType: 'result',
        __stableKey: `result-${item?.pk ?? item?.id ?? index}`,
      }));
    } else if (activeFilter === 'PPMO/EGP') {
      baseData = (data?.data || [])
        .filter(item => item.source === 'PPMO/EGP')
        .map((item, index) => ({
          ...item,
          __itemType: 'tender',
          __stableKey: `tender-${item?.pk ?? item?.id ?? index}`,
        }));
    } else if (activeFilter === 'Others') {
      if (hasSearch) {
        // Search results for the Newspaper tab are returned via searchTenderData
        // (with exclude_source=PPMO/EGP) into `data`, not `newspaperData`.
        baseData = (data?.data || [])
          .filter(item => item?.source !== 'PPMO/EGP')
          .map((item, index) => ({
            ...item,
            __itemType: 'tender',
            __stableKey: `tender-${item?.pk ?? item?.id ?? index}`,
          }));
      } else {
        // newspaperData is already server-filtered to the last N days and
        // PPMO-excluded. Trust it; only fall back to cache and exclude PPMO.
        const mergedNewspaper = dedupeTendersByPk([
          ...(newspaperData?.data || []),
          ...newspaperCachedData,
        ]).filter(item => item?.source !== 'PPMO/EGP');

        const recentNewspaper = mergedNewspaper.sort(
          (a, b) =>
            moment(b.published_date).valueOf() -
            moment(a.published_date).valueOf(),
        );

        baseData = recentNewspaper.map((item, index) => ({
          ...item,
          __itemType: 'tender',
          __stableKey: `tender-${item?.pk ?? item?.id ?? index}`,
        }));
      }
    }

    // Step 3: Server-side search handles the filtering, so just return the base data
    // The API will return filtered results based on search parameters
    return baseData;
  }, [
    data?.data,
    newspaperData?.data,
    resultData?.data,
    resultData?.count,
    activeFilter,
    hasActiveFilters,
    newspaperCachedData,
    data?.count,
    searchText,
  ]);

  // Data updates handling - displayData now handles all filtering automatically
  // No need for allData state updates since displayData useMemo provides the final data

  // API parameters builder - now context-aware based on active filter
  const buildApiParams = useCallback(
    (pageNum = 1, forActiveFilter = null) => {
      const currentFilter = forActiveFilter || activeFilter;
      const apiParams = {
        page: pageNum,
        page_size: 50, // Set page size to 50
      };

      // Add dropdown filters only if they have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          apiParams[key] = value.trim();
        }
      });

      // Add context-aware source filtering based on active filter tab
      if (currentFilter === 'PPMO/EGP') {
        apiParams.source = 'PPMO/EGP';
      } else if (currentFilter === 'Others') {
        // For "Others" (Newspaper), we'll filter out PPMO on the client side
        // since the API doesn't have a "not equal" filter
      }
      // For 'All' and 'Result' - no source filtering needed

      if (useCustomDate) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        apiParams.published_date = formattedDate;
      }

      return apiParams;
    },
    [filters, date, useCustomDate, activeFilter],
  );

  // Restore the base list for the active tab (used after clearing a search).
  const restoreBaseList = useCallback(() => {
    setPage(1);

    if (activeFilter === 'Others') {
      refreshNewspaperData();
      return;
    }

    const params = buildApiParams(1, activeFilter);
    if (activeFilter === 'Result') {
      dispatch(fetchresultData(params));
    } else if (activeFilter === 'All') {
      dispatch(fetchTenderListData(params));
      dispatch(fetchresultData(params));
    } else {
      dispatch(fetchTenderListData(params));
    }
  }, [activeFilter, buildApiParams, dispatch, refreshNewspaperData]);

  // Debounced search with server-side API call. Clearing the search restores
  // the base list instead of leaving stale search results on screen.
  const hadSearchRef = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const query = searchText.trim();
      if (query !== '') {
        hadSearchRef.current = true;
        performServerSideSearch(searchText, 1);
      } else if (hadSearchRef.current) {
        hadSearchRef.current = false;
        restoreBaseList();
      }
    }, 500); // Debounce server-side search

    return () => clearTimeout(timer);
  }, [searchText, performServerSideSearch, restoreBaseList]);

  // Add retry logic function
  const retryFetch = useCallback(
    async (fetchFunction, params) => {
      if (retryCount >= API_RETRY_COUNT) {
        setIsRetrying(false);
        return;
      }

      setIsRetrying(true);
      setRetryCount(prev => prev + 1);

      try {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        const result = await fetchFunction(params);
        if (result.payload?.data) {
          setRetryCount(0);
          setIsRetrying(false);
          return result;
        }
      } catch (err) {
        if (retryCount < API_RETRY_COUNT) {
          return retryFetch(fetchFunction, params);
        }
      }
      setIsRetrying(false);
    },
    [retryCount],
  );

  // Context-aware fetchData function with proper error handling
  const fetchData = useCallback(
    async (pageNum = 1, shouldClearData = false) => {
      if (isSearching) {
        return;
      }

      try {
        setIsSearching(true);
        setRefreshing(true);

        // Choose the appropriate API calls based on active filter
        const params = buildApiParams(pageNum, activeFilter);

        // Add timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT);
        });

        // Context-aware API calls
        const apiCalls = [];

        if (activeFilter === 'Result') {
          // Only fetch result data when Results tab is active
          apiCalls.push(
            Promise.race([dispatch(fetchresultData(params)), timeoutPromise]),
          );
        } else if (activeFilter === 'All') {
          // Fetch both for All tab
          apiCalls.push(
            Promise.race([
              dispatch(fetchTenderListData(params)),
              timeoutPromise,
            ]),
            Promise.race([dispatch(fetchresultData(params)), timeoutPromise]),
          );
        } else {
          // For PPMO and Others tabs, only fetch tender data
          apiCalls.push(
            Promise.race([
              dispatch(fetchTenderListData(params)),
              timeoutPromise,
            ]),
          );
        }

        await Promise.all(apiCalls);

        // Data is automatically updated in Redux store and displayData useMemo
        // No need to manually manage allData state
      } catch (err) {
        // ✅ Proper error handling
        if (err.message === 'Request timeout') {
          if (activeFilter === 'Result') {
            await retryFetch(
              fetchresultData,
              buildApiParams(pageNum, activeFilter),
            );
          } else {
            await retryFetch(
              fetchTenderListData,
              buildApiParams(pageNum, activeFilter),
            );
          }
        } else {
          // Show user-friendly error message
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load data. Please try again.',
            visibilityTime: 3000,
          });
        }
      } finally {
        setRefreshing(false);
        setIsSearching(false);
      }
    },
    [buildApiParams, dispatch, isSearching, retryFetch, activeFilter],
  );

  // Search text change handler - triggers server-side search
  const handleSearchChange = useCallback(text => {
    setSearchText(text);
    // Server-side search is triggered by the useEffect with debouncing
  }, []);

  // Simple filter handler - applies dropdown and date filters only
  const handleFilter = useCallback(async () => {
    if (isSearching) {
      return;
    }

    try {
      setIsSearching(true);
      setRefreshing(true);
      setFiltersJustApplied(true); // Mark that we just applied filters
      closeModal();
      setPage(1);

      // If there's a search query, use search API with filters
      if (searchText && searchText.trim() !== '') {
        const searchParams = {
          searchText: searchText.trim(),
          page: 1,
          page_size: 50,
          activeFilter,
          ...filters,
          ...(useCustomDate && {
            published_date: moment(date).format('YYYY-MM-DD'),
          }),
        };

        if (activeFilter === 'Result') {
          await dispatch(fetchresultData(searchParams));
        } else if (activeFilter === 'All') {
          await Promise.all([
            dispatch(searchTenderData(searchParams)),
            dispatch(fetchresultData(searchParams)),
          ]);
        } else {
          await dispatch(searchTenderData(searchParams));
        }
      } else {
        // Regular filter without search
        const params = buildApiParams(1, activeFilter);

        // Apply filters based on active tab
        if (activeFilter === 'Result') {
          await dispatch(fetchresultData(params));
        } else if (activeFilter === 'All') {
          await Promise.all([
            dispatch(fetchTenderListData(params)),
            dispatch(fetchresultData(params)),
          ]);
        } else {
          await dispatch(fetchTenderListData(params));
        }
      }

      // Show success message if filters are applied
      if (activeFilterCount > 0) {
        Toast.show({
          type: 'success',
          text1: 'Filters Applied',
          text2: `${activeFilterCount} filter${
            activeFilterCount > 1 ? 's' : ''
          } applied`,
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to apply filters. Please try again.',
        visibilityTime: 3000,
      });
    } finally {
      setRefreshing(false);
      setIsSearching(false);
    }
  }, [
    buildApiParams,
    dispatch,
    isSearching,
    activeFilter,
    activeFilterCount,
    searchText,
    filters,
    useCustomDate,
    date,
  ]);

  // Simple clear filters handler
  const clearFilters = useCallback(async () => {
    if (isSearching) {
      return;
    }

    try {
      setIsSearching(true);
      setRefreshing(true);

      // Reset all filters and search immediately for UI responsiveness
      setFilters(INITIAL_FILTERS);
      setSearchText('');
      setDate(new Date());
      setUseCustomDate(false);
      setPage(1);
      setFiltersJustApplied(false); // Reset the flag when clearing filters
      setModalVisible(false);

      // Fetch fresh data without filters or search
      const apiPromises = [];
      if (activeFilter === 'Result') {
        apiPromises.push(dispatch(fetchresultData({page: 1, page_size: 100})));
      } else if (activeFilter === 'All') {
        apiPromises.push(
          dispatch(fetchTenderListData({page: 1, page_size: 100})),
          dispatch(fetchresultData({page: 1, page_size: 100})),
        );
      } else {
        apiPromises.push(
          dispatch(fetchTenderListData({page: 1, page_size: 100})),
        );
      }

      await Promise.all(apiPromises);

      Toast.show({
        type: 'success',
        text1: 'Filters Cleared',
        text2: 'All filters and search have been reset',
        visibilityTime: 2000,
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to clear filters. Please try again.',
        visibilityTime: 3000,
      });
    } finally {
      setRefreshing(false);
      setIsSearching(false);
    }
  }, [dispatch, isSearching, activeFilter]);

  // Optimized end reached handler
  const handleEndReached = useCallback(() => {
    if (isSearching || isLoadingMore) {
      return;
    }
    // Newspaper tab is fixed to rolling last 5 days (no old-page pagination).
    if (activeFilter === 'Others') {
      return;
    }

    // Check if we have more pages to load
    const currentData = activeFilter === 'Result' ? resultData : data;
    if (currentData?.total_pages && page < currentData.total_pages) {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      // If there's a search query, use search API for pagination
      if (searchText && searchText.trim() !== '') {
        const searchParams = {
          searchText: searchText.trim(),
          page: nextPage,
          page_size: 50,
          activeFilter,
          ...filters,
          ...(useCustomDate && {
            published_date: moment(date).format('YYYY-MM-DD'),
          }),
        };

        if (activeFilter === 'Result') {
          dispatch(fetchresultData(searchParams))
            .then(() => {
              setPage(nextPage);
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        } else if (activeFilter === 'All') {
          Promise.all([
            dispatch(searchTenderData(searchParams)),
            dispatch(fetchresultData(searchParams)),
          ])
            .then(() => {
              setPage(nextPage);
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        } else {
          dispatch(searchTenderData(searchParams))
            .then(() => {
              setPage(nextPage);
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        }
      } else {
        // Dedicated lightweight pagination path to avoid full refresh/loading flicker
        const params = buildApiParams(nextPage, activeFilter);
        const requests = [];

        if (activeFilter === 'Result') {
          requests.push(dispatch(fetchresultData(params)));
        } else if (activeFilter === 'All') {
          requests.push(
            dispatch(fetchTenderListData(params)),
            dispatch(fetchresultData(params)),
          );
        } else {
          requests.push(dispatch(fetchTenderListData(params)));
        }

        Promise.all(requests)
          .then(() => {
            setPage(nextPage);
          })
          .finally(() => {
            setIsLoadingMore(false);
          });
      }
    }
  }, [
    page,
    data?.total_pages,
    resultData?.total_pages,
    buildApiParams,
    isSearching,
    isLoadingMore,
    activeFilter,
    searchText,
    filters,
    useCustomDate,
    date,
    dispatch,
  ]);

  // Modal handlers
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  // Only open the zoom viewer with a real, non-empty URL. PPMO/EGP tenders have
  // no scanned image, so opening with a null/empty URL would crash or show a
  // blank black screen. Viewing a tender image requires login.
  const openImageModal = imageUrl => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    if (
      typeof imageUrl === 'string' &&
      imageUrl.trim() !== '' &&
      imageUrl !== 'null'
    ) {
      setSelectedImage(imageUrl);
    }
  };
  const closeImageModal = () => setSelectedImage(null);

  // Keep the saved-pk set in sync with the user's profile saved bids.
  useEffect(() => {
    const pks = (savedBids?.data || [])
      .map(bid => bid?.tender?.pk)
      .filter(pk => pk !== undefined && pk !== null);
    setSavedPks(new Set(pks));
  }, [savedBids]);

  // Load the user's saved bids when authenticated so the Save button can
  // reflect the correct state right away.
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getSavedBids());
    } else {
      setSavedPks(new Set());
    }
  }, [isAuthenticated, dispatch]);

  // Navigation handlers
  const handleSaveBids = useCallback(
    pk => {
      if (!isAuthenticated) {
        navigation.navigate('Login');
        return;
      }

      // Already saved: leave it saved (removal happens on the Saved Bids page).
      if (savedPks.has(pk)) {
        return;
      }

      // Optimistically mark as saved, then persist and resync from server.
      setSavedPks(prev => {
        const next = new Set(prev);
        next.add(pk);
        return next;
      });

      Promise.resolve(dispatch(savebid({id: pk})))
        .then(() => dispatch(getSavedBids()))
        .catch(() => {
          // Revert optimistic update on failure.
          setSavedPks(prev => {
            const next = new Set(prev);
            next.delete(pk);
            return next;
          });
        });
    },
    [isAuthenticated, savedPks, dispatch, navigation],
  );

  const handleDetailNavigation = useCallback(
    pk => {
      if (!isAuthenticated) {
        navigation.navigate('Login');
        return;
      }

      // Find the tender data from the current display data
      const tenderData = displayData.find(item => item.pk === pk);

      // Navigate to different screens based on active filter
      if (activeFilter === 'Result') {
        navigation.navigate('ResultDetails', {id: pk, tenderData});
      } else {
        navigation.navigate('HomeDetails', {id: pk, tenderData});
      }
    },
    [isAuthenticated, navigation, activeFilter, displayData],
  );

  // Date handlers
  const handleDateConfirm = useCallback(selectedDate => {
    setDatepicker(false);
    setDate(selectedDate);
    setUseCustomDate(true);
  }, []);

  // Filter button handler - optimized for instant switching
  const handleFilterPress = useCallback(
    filterType => {
      setActiveFilter(filterType);
      setPage(1);
      setIsLoadingMore(false);
      setFiltersJustApplied(false);

      if (filterType === 'Others') {
        refreshNewspaperData();
      }
    },
    [refreshNewspaperData],
  );

  // Image icon press handler - viewing the gallery requires login.
  const handleImagePress = useCallback(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    try {
      navigation.navigate('ImageGallery');
    } catch (error) {}
  }, [isAuthenticated, navigation]);

  // Dropdown data processing
  const dropdownData = useMemo(() => {
    if (!dropdowndata) {
      return {
        organizationData: [],
        categoryData: [],
        locationData: [],
        projectTypeData: [],
        procurementData: [],
        sourceData: [],
      };
    }

    return {
      organizationData: dropdowndata.organization_sectors || [],
      categoryData: dropdowndata.categories || [],
      locationData: dropdowndata.districts || [],
      projectTypeData: dropdowndata.project_types || [],
      procurementData: dropdowndata.procurement_types || [],
      sourceData: dropdowndata.sources || [],
    };
  }, [dropdowndata]);

  // Dropdown rendering with improved persistence
  const renderDropdown = useCallback(
    (data, placeholder, onSelect, value) => {
      const isSelected = value && value.trim() !== '';

      // Find the selected item object from the data array
      const selectedItem = isSelected
        ? data.find(item => item.name === value)
        : null;

      // Find the index of the selected item
      const selectedIndex = selectedItem
        ? data.findIndex(item => item.name === value)
        : -1;

      return (
        <SelectDropdown
          data={data || []}
          onSelect={onSelect}
          defaultButtonText={placeholder}
          buttonStyle={[
            styles.dropdown1BtnStyle,
            isSelected && styles.dropdown1BtnStyleSelected,
          ]}
          buttonTextStyle={[
            styles.dropdown1BtnTxtStyle,
            isSelected && styles.dropdown1BtnTxtStyleSelected,
          ]}
          renderDropdownIcon={isOpened => (
            <Icon
              name={isOpened ? 'chevron-up' : 'chevron-down'}
              color={isSelected ? '#0375B7' : '#666'}
              size={normalize(20)}
            />
          )}
          dropdownIconPosition={'right'}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
          selectedRowStyle={styles.dropdown1SelectedRowStyle}
          search
          searchInputStyle={styles.dropdown1searchInputStyleStyle}
          searchPlaceHolder={'Search options...'}
          searchPlaceHolderColor={'#999'}
          renderSearchInputLeftIcon={() => (
            <Icon name="search" color={'#0375B7'} size={normalize(18)} />
          )}
          renderCustomizedRowChild={item => (
            <Text style={styles.dropdown1RowTxtStyle} numberOfLines={1}>
              {item.name}
            </Text>
          )}
          buttonTextAfterSelection={selectedItem => selectedItem.name}
          rowTextForSelection={item => item.name}
          showsVerticalScrollIndicator={false}
          dropdownOverlayColor={'rgba(0,0,0,0.2)'}
          searchTextInputProps={{
            placeholderTextColor: '#999',
            style: {
              color: '#333',
              fontSize: normalize(15),
            },
          }}
          // Properly maintain selection state
          defaultValue={selectedItem}
          defaultValueByIndex={selectedIndex >= 0 ? selectedIndex : undefined}
          disabled={isSearching}
          // Force re-render when value changes
          key={`dropdown-${placeholder}-${value || 'empty'}`}
        />
      );
    },
    [isSearching],
  );

  // Modal content rendering
  const renderModalContent = useCallback(
    () => (
      <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalText}>Advanced Filters</Text>
          <TouchableOpacity onPress={closeModal} style={styles.modalCloseBtn}>
            <Icon name="close" size={normalize(22)} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.modalScrollView}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          {renderDropdown(
            dropdownData.organizationData,
            'Select Organization',
            selectedItem =>
              setFilters(prev => ({
                ...prev,
                organization_sector: selectedItem.name,
              })),
            filters.organization_sector,
          )}

          {renderDropdown(
            dropdownData.categoryData,
            'Select Category',
            selectedItem =>
              setFilters(prev => ({...prev, category: selectedItem.name})),
            filters.category,
          )}

          {renderDropdown(
            dropdownData.locationData,
            'Select Location',
            selectedItem =>
              setFilters(prev => ({...prev, district: selectedItem.name})),
            filters.district,
          )}

          {renderDropdown(
            dropdownData.projectTypeData,
            'Select Project Type',
            selectedItem =>
              setFilters(prev => ({...prev, project_type: selectedItem.name})),
            filters.project_type,
          )}

          {renderDropdown(
            dropdownData.procurementData,
            'Select Procurement Type',
            selectedItem =>
              setFilters(prev => ({
                ...prev,
                procurement_type: selectedItem.name,
              })),
            filters.procurement_type,
          )}

          {renderDropdown(
            dropdownData.sourceData,
            'Select Source',
            selectedItem =>
              setFilters(prev => ({...prev, source: selectedItem.name})),
            filters.source,
          )}

          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={[
                styles.datepicker,
                useCustomDate && styles.datepickerSelected,
              ]}
              onPress={() => {
                setDatepicker(true);
              }}
              disabled={isSearching}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.datepickerText,
                  useCustomDate && styles.datepickerTextSelected,
                ]}>
                {useCustomDate
                  ? moment(date).format('YYYY-MM-DD')
                  : 'Select Date'}
              </Text>
              <Icon
                name="calendar-outline"
                size={normalize(18)}
                color={useCustomDate ? '#0375B7' : '#666'}
                style={styles.datepickerIcon}
              />
            </TouchableOpacity>

            {/* Date Picker Modal - Overlay on filter modal */}
            <DatePicker
              modal
              mode="date"
              open={datepicker}
              date={date}
              confirmBtnText="Set"
              cancelBtnText="Cancel"
              title="Select Date"
              theme="light"
              onConfirm={handleDateConfirm}
              onCancel={() => {
                setDatepicker(false);
              }}
              androidVariant="nativeAndroid"
              maximumDate={new Date()}
              minimumDate={new Date(2020, 0, 1)}
            />

            {useCustomDate && (
              <TouchableOpacity
                onPress={() => {
                  setUseCustomDate(false);
                  setDate(new Date());
                }}
                style={styles.clearDateButton}
                activeOpacity={0.8}>
                <Icon
                  name="close-circle"
                  size={normalize(18)}
                  color="#FF0000"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={clearFilters}
              style={styles.clearFilterButton}
              disabled={isSearching}
              activeOpacity={0.8}>
              <Icon
                name="refresh"
                size={normalize(18)}
                style={styles.clearFilterIcon}
              />
              <Text style={styles.clearFilterText}>Clear Filters</Text>
            </TouchableOpacity>
            <Custombutton
              title="Apply Filter"
              onPress={handleFilter}
              disabled={isSearching}
              style={styles.applyFilterButton}
            />
          </View>
        </ScrollView>
      </TouchableOpacity>
    ),
    [
      dropdownData,
      filters,
      date,
      useCustomDate,
      datepicker,
      handleDateConfirm,
      clearFilters,
      handleFilter,
      renderDropdown,
      isSearching,
      searchText,
      handleSearchChange,
    ],
  );

  // Image modal rendering
  const renderImageModal = useCallback(
    () => (
      <Modal
        visible={!!selectedImage}
        animationType="slide"
        transparent={true}
        onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeImageModal}
            style={styles.closeButton}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          <ImageZoomViewer
            imageUrls={[{url: selectedImage}]}
            enableSwipeDown={true}
            onSwipeDown={closeImageModal}
            renderIndicator={() => null}
            backgroundColor="black"
          />
        </View>
      </Modal>
    ),
    [selectedImage, closeImageModal],
  );

  // Modify ErrorComponent to use apiError and resultError
  const ErrorComponent = useCallback(() => {
    const currentError = activeFilter === 'Result' ? resultError : apiError;

    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={50} color="#FF0000" />
        <Text style={styles.errorText}>
          {getErrorMessage(
            currentError,
            'An error occurred while fetching data. Please try again.',
          )}
        </Text>
        {isRetrying ? (
          <ActivityIndicator
            size="small"
            color="#0375B7"
            style={{marginTop: 10}}
          />
        ) : (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setRetryCount(0);
              fetchData(1, true);
            }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [apiError, resultError, isRetrying, fetchData, activeFilter]);

  // Simple No Tender Found Component
  const NoTenderFoundComponent = useCallback(() => {
    const hasFilters = hasActiveFilters;
    const hasSearch = searchText && searchText.trim() !== '';
    const hasAnyFilter = hasFilters || hasSearch;

    // Simple message logic
    let icon, title, description, actionText;

    if (hasSearch && hasFilters) {
      icon = 'search-outline';
      title = 'No Results Found';
      description = `No results found for "${searchText}" with applied filters.`;
      actionText = 'Try different keywords or clear filters';
    } else if (hasSearch) {
      icon = 'search-outline';
      title = 'No Search Results';
      description = `No results found for "${searchText}".`;
      actionText = 'Try different keywords';
    } else if (hasFilters) {
      icon = 'filter-outline';
      title = 'No Matching Results';
      description = 'No results match your filter criteria.';
      actionText = 'Try adjusting or clearing filters';
    } else {
      icon = 'document-text-outline';
      title = 'No Data Available';
      description = 'No data available at the moment.';
      actionText = 'Pull down to refresh';
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIconWrapper}>
            <View style={styles.emptyIconContainer}>
              <Icon name={icon} size={normalize(70)} color="#0375B7" />
            </View>
          </View>
          <View style={styles.emptyTextWrapper}>
            <Text style={styles.emptyTitle}>{title}</Text>
            <Text style={styles.emptyDescription}>{description}</Text>
            <Text style={styles.emptyActionText}>{actionText}</Text>
          </View>
          {hasAnyFilter && (
            <View style={styles.emptyActions}>
              <TouchableOpacity
                style={styles.clearFiltersBtn}
                onPress={async () => {
                  try {
                    // Reset all states immediately for UI responsiveness
                    setFilters(INITIAL_FILTERS);
                    setSearchText('');
                    setUseCustomDate(false);
                    setDate(new Date());
                    setPage(1);
                    setFiltersJustApplied(false); // Reset the flag when clearing filters

                    // Fetch fresh data without showing loading states unnecessarily
                    await Promise.all([
                      dispatch(fetchTenderListData({page: 1, page_size: 100})),
                      dispatch(fetchresultData({page: 1, page_size: 100})),
                    ]);
                  } catch (error) {
                    // Silently handle errors - user can try manual refresh if needed
                  }
                }}
                activeOpacity={0.8}>
                <Icon
                  name="refresh-outline"
                  size={normalize(18)}
                  color="#0375B7"
                />
                <Text style={styles.clearFiltersBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }, [hasActiveFilters, searchText, dispatch]);

  // Fixed renderItem function with null safety
  const renderItem = useCallback(
    ({item}) => {
      // ✅ Add safety check for invalid items
      if (!item || !item.pk) {
        return null;
      }

      const isResultData = activeFilter === 'Result';

      return (
        <View style={styles.Card}>
          <TouchableOpacity onPress={() => openImageModal(item.image)}>
            <Image source={getTenderDefaultImage(item)} style={styles.image} />
          </TouchableOpacity>
          <View style={{padding: 6, flex: 1}}>
            <Text
              numberOfLines={2}
              style={{
                color: '#0375B7',
                fontSize: 15,
                fontWeight: 'bold',
                marginTop: 4,
              }}
              onPress={() => handleDetailNavigation(item.pk)}>
              {item.title || 'Untitled'}
            </Text>
            <Text
              numberOfLines={2}
              style={{color: 'black', fontSize: 14, marginTop: 2}}>
              {item.public_entry_name || 'No description available'}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <View style={{flexDirection: 'row'}}>
                <Icon2 name="bag-handle" size={16} color="black" />
                <Text
                  style={{color: 'black', fontSize: 14, fontWeight: 'bold'}}>
                  Service:
                </Text>
              </View>
              {/* ✅ Safe array mapping with null checks */}
              {item.project_type &&
              Array.isArray(item.project_type) &&
              item.project_type.length > 0 ? (
                item.project_type.map((project, projectIndex) => (
                  <Text
                    key={projectIndex}
                    numberOfLines={2}
                    style={{color: '#000', flex: 1}}>
                    {project?.name || 'Unknown Service'}
                  </Text>
                ))
              ) : (
                <Text style={{color: '#666', flex: 1}}>
                  No service specified
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <View style={{flexDirection: 'row'}}>
                <Icon3 name="update" size={14} color="black" />
                <Text
                  style={{color: 'black', fontSize: 12, fontWeight: 'bold'}}>
                  Published:
                </Text>
              </View>
              <Text style={[styles.CardText, {fontSize: 11, flex: 1}]}>
                {item.published_date || 'Date not available'}
              </Text>
              {!isResultData && (
                <Text style={{color: '#FF0000', marginRight: 10, fontSize: 10}}>
                  {item.days_left || ''}
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <View style={{flexDirection: 'row'}}>
                <Icon2 name="newspaper" size={16} color="black" />
                <Text
                  style={{color: 'black', fontSize: 14, fontWeight: 'bold'}}>
                  Source:
                </Text>
              </View>
              <Text style={styles.CardText}>
                {item.source || 'Unknown Source'}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <View style={{flexDirection: 'row'}}>
                <Icon2 name="location" size={16} color="black" />
                <Text
                  style={{color: 'black', fontSize: 14, fontWeight: 'bold'}}>
                  Location:
                </Text>
              </View>
              {/* ✅ Safe array mapping with null checks */}
              {item.district &&
              Array.isArray(item.district) &&
              item.district.length > 0 ? (
                item.district.map((loc, locIndex) => (
                  <Text
                    key={locIndex}
                    numberOfLines={2}
                    style={{color: '#000', flex: 1, marginLeft: 5}}>
                    {loc?.name || 'Unknown Location'}
                  </Text>
                ))
              ) : (
                <Text style={{color: '#666', flex: 1, marginLeft: 5}}>
                  Location not specified
                </Text>
              )}
            </View>
            {!isResultData && (
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                <TouchableOpacity
                  onPress={() => handleSaveBids(item.pk)}
                  disabled={savedPks.has(item.pk)}
                  style={styles.cusBottom}>
                  <Icon2
                    name={
                      savedPks.has(item.pk) ? 'bookmark' : 'bookmark-outline'
                    }
                    size={18}
                    color={savedPks.has(item.pk) ? '#0375B7' : '#000'}
                  />
                  <Text
                    style={{
                      color: savedPks.has(item.pk) ? '#0375B7' : '#000',
                      fontSize: 14,
                      fontWeight: savedPks.has(item.pk) ? 'bold' : 'normal',
                    }}>
                    {savedPks.has(item.pk) ? 'Saved' : 'Save Bids'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    },
    [
      handleDetailNavigation,
      handleSaveBids,
      openImageModal,
      activeFilter,
      savedPks,
    ],
  );

  // Improved FlatList props with better empty state handling and optimized performance
  const flatListProps = useMemo(
    () => ({
      data: displayData,
      renderItem,
      keyExtractor: (item, index) => item?.__stableKey || `home-item-${index}`,
      onEndReached: handleEndReached,
      onEndReachedThreshold: 0.2,
      removeClippedSubviews: true,
      maxToRenderPerBatch: 12,
      windowSize: 7,
      initialNumToRender: 10,
      updateCellsBatchingPeriod: 50, // Reduced from 100 for more responsive updates
      ListEmptyComponent: () => {
        // Enhanced empty state logic with prioritized search and filter handling
        const isApiLoading = refreshing || isSearching;
        const isNewspaperTab = activeFilter === 'Others';
        const isReduxLoading = isNewspaperTab
          ? newspaperLoading
          : cardLoading || resultLoading;
        const hasError = isNewspaperTab
          ? newspaperError
          : apiError || resultError;
        const hasApiData = isNewspaperTab
          ? (newspaperData?.data && newspaperData.data.length > 0) ||
            newspaperCachedData.length > 0
          : (data?.data && data.data.length > 0) ||
            (resultData?.data && resultData.data.length > 0);
        const hasSearch = searchText && searchText.trim() !== '';
        const hasFilters = hasActiveFilters;

        // Show error if there's an API error
        if (hasError) {
          return <ErrorComponent />;
        }

        // PRIORITY 1: If user has search text or filters, NEVER show loading - always show results or empty state
        if (hasSearch || hasFilters) {
          if (displayData.length === 0) {
            return <NoTenderFoundComponent />;
          }
          return null;
        }

        // PRIORITY 2: Only show loading when no search/filters AND genuinely loading initial data
        const shouldShowLoading =
          isApiLoading || (isReduxLoading && !hasApiData);

        if (shouldShowLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0375B7" />
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          );
        }

        // PRIORITY 3: Show empty state for everything else
        if (displayData.length === 0) {
          return <NoTenderFoundComponent />;
        }

        return null;
      },
      ListFooterComponent: isLoadingMore ? (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#0375B7" />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      ) : displayData.length > 0 ? (
        <AdSpace />
      ) : null,
    }),
    [
      displayData,
      refreshing,
      activeFilter,
      cardLoading,
      newspaperLoading,
      resultLoading,
      isSearching,
      handleEndReached,
      isLoadingMore,
      apiError,
      newspaperError,
      resultError,
      data?.data,
      newspaperData?.data,
      newspaperCachedData,
      resultData?.data,
      searchText,
      hasActiveFilters,
      ErrorComponent,
      NoTenderFoundComponent,
      renderItem,
    ],
  );

  // Optimized ListHeaderComponent
  const ListHeaderComponent = useMemo(
    () => (
      <>
        <View style={styles.navcontainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
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
                placeholder="Search"
                placeholderTextColor={'#999'}
                style={styles.searchTextInput}
                value={searchText}
                onChangeText={handleSearchChange}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                  }}
                  style={styles.clearSearchButton}>
                  <Icon name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={openModal}
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
        <Slider />
        <FilterButtonsSection
          activeFilter={activeFilter}
          onFilterPress={handleFilterPress}
          onImagePress={handleImagePress}
          hasActiveFilters={hasActiveFilters}
          filterCount={activeFilterCount}
        />
      </>
    ),
    [
      openModal,
      activeFilter,
      handleFilterPress,
      handleImagePress,
      hasActiveFilters,
      activeFilterCount,
      searchText,
      handleSearchChange,
    ],
  );

  // Add a useEffect to monitor dropdown data changes
  useEffect(() => {
    if (dropdownerror) {
      // Handle dropdown error if needed
    }
    if (dropdowndata) {
      // Dropdown data loaded successfully
    }
  }, [dropdowndata, dropdownerror]);

  return (
    <SafeAreaView style={styles.HomeContainer} edges={['top']}>
      <View style={{flex: 1, paddingBottom: 10}}>
        <FlatList
          {...flatListProps}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>

      {/* Enhanced Filter Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
        statusBarTranslucent={true}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={closeModal}>
          {renderModalContent()}
        </TouchableOpacity>
      </Modal>

      {renderImageModal()}
    </SafeAreaView>
  );
};

// Single export default
export default React.memo(Home);
