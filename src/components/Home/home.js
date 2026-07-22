import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import {useFocusEffect} from '@react-navigation/native';

// Icons
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import SelectDropdown from 'react-native-select-dropdown';
import Custombutton from '../../Containers/Button/button';
import DatePicker from 'react-native-date-picker';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import TenderCard from './TenderCard';
import HomeListHeader from './HomeListHeader';

// Redux Actions
import {fetchDropdownData} from '../../reducers/dropdownSlice';
import {
  fetchTenderListData,
  savebid,
  searchTenderData,
  selectHomeTabBucket,
  buildHomeTabQueryKey,
} from '../../reducers/cardSlice';
import {
  fetchresultData,
  buildResultListQueryKey,
} from '../../reducers/resultSlice';
import {getSavedBids} from '../../reducers/profileSlice';
import {selectIsLoggedIn, guardTenderAccess} from '../../utils/authAccess';

// Styles and Utils
import styles from './homeStyles';
import Toast from 'react-native-toast-message';
import {normalize} from '../../utils/responsive';
import {
  buildRefreshKey,
  createRefreshThrottle,
} from '../../utils/refreshThrottle';
import {getErrorMessage} from '../../utils/errorMessage';
import {DEFAULT_PAGE_SIZE} from '../../constants/pagination';

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
const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

const isActiveSearch = text => (text || '').trim().length >= MIN_SEARCH_LENGTH;

const appendFilterParams = (params, filters, useCustomDate, date) => {
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params[key] = value.trim();
    }
  });
  if (useCustomDate) {
    params.published_date = moment(date).format('YYYY-MM-DD');
  }
  return params;
};

const buildTenderSearchParams = ({
  searchText,
  page = 1,
  tab,
  filters,
  useCustomDate,
  date,
}) => {
  const params = {
    searchText: searchText.trim(),
    page,
    page_size: DEFAULT_PAGE_SIZE,
    activeFilter: tab,
    homeTab: tab,
  };
  return appendFilterParams(params, filters, useCustomDate, date);
};

const buildResultSearchParams = ({
  searchText,
  page = 1,
  filters,
  useCustomDate,
  date,
}) => {
  const params = {
    search: searchText.trim(),
    page,
    page_size: DEFAULT_PAGE_SIZE,
  };
  return appendFilterParams(params, filters, useCustomDate, date);
};

const sortByPublishedDateDesc = items =>
  [...(items || [])].sort(
    (a, b) =>
      moment(b?.published_date).valueOf() - moment(a?.published_date).valueOf(),
  );

const mapTenderItems = items =>
  sortByPublishedDateDesc(items).map((item, index) => ({
    ...item,
    __itemType: 'tender',
    __stableKey: `tender-${item?.pk ?? item?.id ?? index}`,
  }));

const mapResultItems = items =>
  sortByPublishedDateDesc(items).map((item, index) => ({
    ...item,
    __itemType: 'result',
    __stableKey: `result-${item?.pk ?? item?.id ?? index}`,
  }));

const buildExpectedSearchQueryKey = ({
  searchText,
  activeFilter,
  filters,
  useCustomDate,
  date,
}) => {
  const query = searchText.trim();
  if (activeFilter === 'Result') {
    return buildResultListQueryKey(
      buildResultSearchParams({
        searchText: query,
        page: 1,
        filters,
        useCustomDate,
        date,
      }),
    );
  }

  return buildHomeTabQueryKey(
    buildTenderSearchParams({
      searchText: query,
      page: 1,
      tab: activeFilter,
      filters,
      useCustomDate,
      date,
    }),
    {isSearch: true},
  );
};

const buildExpectedListQueryKey = ({
  activeFilter,
  filters,
  useCustomDate,
  date,
  page = 1,
}) => {
  const params = {
    page,
    page_size: DEFAULT_PAGE_SIZE,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params[key] = value.trim();
    }
  });

  if (activeFilter === 'PPMO/EGP') {
    params.source = 'PPMO/EGP';
  } else if (activeFilter === 'Others') {
    params.exclude_source = 'PPMO/EGP';
  }

  if (useCustomDate) {
    params.published_date = moment(date).format('YYYY-MM-DD');
  }

  if (activeFilter === 'Result') {
    return buildResultListQueryKey(params);
  }

  params.homeTab = activeFilter;
  return buildHomeTabQueryKey(params, {isSearch: false});
};

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

const Home = ({navigation}) => {
  const dispatch = useDispatch();

  // State management
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [date, setDate] = useState(new Date());
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [datepicker, setDatepicker] = useState(false);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [filtersJustApplied, setFiltersJustApplied] = useState(false);
  const [savedPks, setSavedPks] = useState(() => new Set());
  const refreshThrottleRef = useRef(createRefreshThrottle());
  const searchSnapshotRef = useRef({queryKey: null, rows: []});
  const tabDisplaySnapshotRef = useRef({});
  const searchGenerationRef = useRef(0);
  const skipNextFocusRefreshRef = useRef(true);
  const homeMountedAtRef = useRef(Date.now());

  const activeTabBucket = useSelector(state =>
    selectHomeTabBucket(state, activeFilter),
  );
  const data = activeTabBucket.data;
  const cardLoading = activeTabBucket.loading;
  const apiError = activeTabBucket.error;
  const tenderListQueryKey = activeTabBucket.listQueryKey;
  const {dropdowndata, dropdownerror} = useSelector(state => state.dropdown);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {savedBids} = useSelector(state => state.userprofile);
  const {
    data: resultData,
    error: resultError,
    loading: resultLoading,
    listQueryKey: resultListQueryKey,
  } = useSelector(state => state.result);

  // Check if we have active filters (dropdown filters or date only)
  const hasActiveFilters = useMemo(() => {
    const hasDropdownFilters = Object.values(filters).some(
      value => value && value.trim() !== '',
    );
    const hasDateFilter = useCustomDate;
    return hasDropdownFilters || hasDateFilter;
  }, [filters, useCustomDate]);

  const markTabRefreshed = useCallback(
    (tab, {search = searchText, filtersActive = hasActiveFilters} = {}) => {
      refreshThrottleRef.current.markRefreshed(
        buildRefreshKey(tab, {search, hasFilters: filtersActive}),
      );
    },
    [searchText, hasActiveFilters],
  );

  // Count active filters for display
  const activeFilterCount = useMemo(() => {
    const dropdownCount = Object.values(filters).filter(
      value => value && value.trim() !== '',
    ).length;
    const dateCount = useCustomDate ? 1 : 0;
    return dropdownCount + dateCount;
  }, [filters, useCustomDate]);

  // tabLists are rehydrated from Redux persist before Home mounts — refresh in background.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(
          fetchTenderListData({
            page: 1,
            page_size: DEFAULT_PAGE_SIZE,
            forceRefresh: false,
            homeTab: 'All',
          }),
        );
        markTabRefreshed('All');

        dispatch(fetchDropdownData());
        dispatch(fetchresultData({page: 1, page_size: DEFAULT_PAGE_SIZE}));
        dispatch(
          fetchTenderListData({
            page: 1,
            page_size: DEFAULT_PAGE_SIZE,
            forceRefresh: false,
            source: 'PPMO/EGP',
            homeTab: 'PPMO/EGP',
          }),
        );
        dispatch(
          fetchTenderListData({
            page: 1,
            page_size: DEFAULT_PAGE_SIZE,
            forceRefresh: false,
            exclude_source: 'PPMO/EGP',
            homeTab: 'Others',
          }),
        );
        markTabRefreshed('PPMO/EGP');
        markTabRefreshed('Others');
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchInitialData();
  }, [dispatch, markTabRefreshed]);

  // Server-side search function
  const performServerSideSearch = useCallback(
    async (searchQuery, pageNum = 1, tabOverride = null) => {
      if (!isActiveSearch(searchQuery)) {
        return;
      }

      const tab = tabOverride || activeFilter;

      const generation = ++searchGenerationRef.current;

      try {
        setIsSearching(true);
        if (pageNum === 1) {
          setPage(1);
        }

        if (tab === 'Result') {
          await dispatch(
            fetchresultData(
              buildResultSearchParams({
                searchText: searchQuery,
                page: pageNum,
                filters,
                useCustomDate,
                date,
              }),
            ),
          );
        } else {
          await dispatch(
            searchTenderData(
              buildTenderSearchParams({
                searchText: searchQuery,
                page: pageNum,
                tab,
                filters,
                useCustomDate,
                date,
              }),
            ),
          );
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Search Error',
          text2: 'Failed to perform search. Please try again.',
          visibilityTime: 3000,
        });
      } finally {
        if (generation === searchGenerationRef.current) {
          setIsSearching(false);
        }
      }
    },
    [dispatch, activeFilter, filters, useCustomDate, date],
  );

  // Only show Redux rows when they match the current list/search context.
  const displayData = useMemo(() => {
    const searching = isActiveSearch(searchText);
    const isListLoading =
      activeFilter === 'Result' ? resultLoading : cardLoading;
    const listQueryKey =
      activeFilter === 'Result' ? resultListQueryKey : tenderListQueryKey;

    const mapRowsForTab = () => {
      if (activeFilter === 'Result') {
        return mapResultItems(resultData?.data);
      }

      if (activeFilter === 'All') {
        return mapTenderItems(data?.data);
      }

      if (activeFilter === 'PPMO/EGP' || activeFilter === 'Others') {
        return mapTenderItems(data?.data);
      }

      return [];
    };

    const applyEmptyCount = rows => {
      if (!hasActiveFilters && !searching) {
        return rows;
      }
      if (isListLoading) {
        return rows;
      }

      const tenderCount = data?.count ?? 0;
      const resultCount = resultData?.count ?? 0;

      if (activeFilter === 'Result' && resultCount === 0) {
        return [];
      }
      if (activeFilter === 'All' && tenderCount === 0) {
        return [];
      }
      if (
        (activeFilter === 'PPMO/EGP' || activeFilter === 'Others') &&
        tenderCount === 0
      ) {
        return [];
      }

      return rows;
    };

    if (searching) {
      const expectedSearchKey = buildExpectedSearchQueryKey({
        searchText,
        activeFilter,
        filters,
        useCustomDate,
        date,
      });
      const dataMatchesSearch = listQueryKey === expectedSearchKey;

      if (dataMatchesSearch) {
        const rows = applyEmptyCount(mapRowsForTab());
        if (!isListLoading || rows.length > 0) {
          searchSnapshotRef.current = {queryKey: expectedSearchKey, rows};
        }
        return rows;
      }

      if (
        searchSnapshotRef.current.rows.length > 0 &&
        (isSearching || isListLoading)
      ) {
        return searchSnapshotRef.current.rows;
      }

      return [];
    }

    const expectedListKey = buildExpectedListQueryKey({
      activeFilter,
      filters,
      useCustomDate,
      date,
    });
    const listKeyMatches = listQueryKey === expectedListKey;

    if (!listKeyMatches) {
      if (isListLoading) {
        const tabSnapshot = tabDisplaySnapshotRef.current[activeFilter];
        if (tabSnapshot?.length > 0) {
          return tabSnapshot;
        }
      }
      if (!isListLoading) {
        return [];
      }
    }

    const rows = applyEmptyCount(mapRowsForTab());
    if (!hasActiveFilters && rows.length > 0) {
      tabDisplaySnapshotRef.current[activeFilter] = rows;
    }

    return rows;
  }, [
    data?.data,
    resultData?.data,
    resultData?.count,
    activeFilter,
    hasActiveFilters,
    data?.count,
    searchText,
    cardLoading,
    resultLoading,
    tenderListQueryKey,
    resultListQueryKey,
    filters,
    useCustomDate,
    date,
  ]);

  const stableDisplayData = useMemo(() => {
    const isListLoading =
      activeFilter === 'Result' ? resultLoading : cardLoading;
    const searching = isActiveSearch(searchText);

    if (displayData.length > 0) {
      if (!searching) {
        tabDisplaySnapshotRef.current[activeFilter] = displayData;
      }
      return displayData;
    }

    if (searching && (isSearching || isListLoading)) {
      if (searchSnapshotRef.current.rows.length > 0) {
        return searchSnapshotRef.current.rows;
      }
    }

    if (!searching && isListLoading) {
      const tabSnapshot = tabDisplaySnapshotRef.current[activeFilter];
      if (tabSnapshot?.length > 0) {
        return tabSnapshot;
      }
    }

    return displayData;
  }, [
    displayData,
    activeFilter,
    searchText,
    isSearching,
    resultLoading,
    cardLoading,
  ]);

  // API parameters builder - now context-aware based on active filter
  const buildApiParams = useCallback(
    (pageNum = 1, forActiveFilter = null) => {
      const currentFilter = forActiveFilter || activeFilter;
      const apiParams = {
        page: pageNum,
        page_size: DEFAULT_PAGE_SIZE,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          apiParams[key] = value.trim();
        }
      });

      if (currentFilter === 'PPMO/EGP') {
        apiParams.source = 'PPMO/EGP';
      } else if (currentFilter === 'Others') {
        apiParams.exclude_source = 'PPMO/EGP';
      }

      if (useCustomDate) {
        apiParams.published_date = moment(date).format('YYYY-MM-DD');
      }

      if (currentFilter !== 'Result') {
        apiParams.homeTab = currentFilter;
      }

      return apiParams;
    },
    [filters, date, useCustomDate, activeFilter],
  );

  // Fetch the correct API dataset for the active (or overridden) tab.
  const refreshTabData = useCallback(
    (tab, pageNum = 1, {forceRefresh = false} = {}) => {
      if (tab === 'Result') {
        const params = buildApiParams(pageNum, tab);
        return dispatch(fetchresultData(params));
      }

      const params = buildApiParams(pageNum, tab);
      if (forceRefresh) {
        params.forceRefresh = true;
      }
      return dispatch(fetchTenderListData(params));
    },
    [buildApiParams, dispatch],
  );

  // Refresh the current tab when the screen regains focus (throttled).
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          if (hasActiveFilters || filtersJustApplied) {
            return;
          }

          if (skipNextFocusRefreshRef.current) {
            skipNextFocusRefreshRef.current = false;
            return;
          }

          if (Date.now() - homeMountedAtRef.current < 5000) {
            return;
          }

          const refreshKey = buildRefreshKey(activeFilter, {
            search: searchText,
            hasFilters: hasActiveFilters,
          });

          if (!refreshThrottleRef.current.shouldRefresh(refreshKey)) {
            return;
          }

          if (isActiveSearch(searchText)) {
            await performServerSideSearch(searchText, 1);
          } else {
            await refreshTabData(activeFilter, 1, {forceRefresh: false});
          }

          markTabRefreshed(activeFilter);
        } catch (error) {
          // Error handling without console.log
        }
      };

      refreshData();
    }, [
      dispatch,
      activeFilter,
      hasActiveFilters,
      filtersJustApplied,
      searchText,
      performServerSideSearch,
      refreshTabData,
      markTabRefreshed,
    ]),
  );

  const restoreBaseList = useCallback(() => {
    searchSnapshotRef.current = {queryKey: null, rows: []};
    setIsSearching(false);
    setPage(1);
    refreshTabData(activeFilter, 1, {forceRefresh: false});
  }, [activeFilter, refreshTabData]);

  // Debounced server-side search.
  const hadSearchRef = useRef(false);
  useEffect(() => {
    const query = searchText.trim();

    if (!isActiveSearch(query)) {
      if (hadSearchRef.current) {
        hadSearchRef.current = false;
        restoreBaseList();
      }
      return;
    }

    setIsSearching(true);
    hadSearchRef.current = true;

    const delay =
      query.length === MIN_SEARCH_LENGTH ? 0 : SEARCH_DEBOUNCE_MS;

    const timer = setTimeout(() => {
      performServerSideSearch(searchText, 1);
    }, delay);

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
        // Choose the appropriate API calls based on active filter
        const params = buildApiParams(pageNum, activeFilter);

        // Add timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT);
        });

        // Context-aware API calls
        const apiCalls = [];

        if (activeFilter === 'Result') {
          apiCalls.push(
            Promise.race([dispatch(fetchresultData(params)), timeoutPromise]),
          );
        } else {
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
      setFiltersJustApplied(true); // Mark that we just applied filters
      closeModal();
      setPage(1);

      // If there's an active search query, use search API with filters
      if (isActiveSearch(searchText)) {
        if (activeFilter === 'Result') {
          await dispatch(
            fetchresultData(
              buildResultSearchParams({
                searchText,
                page: 1,
                filters,
                useCustomDate,
                date,
              }),
            ),
          );
        } else {
          await dispatch(
            searchTenderData(
              buildTenderSearchParams({
                searchText,
                page: 1,
                tab: activeFilter,
                filters,
                useCustomDate,
                date,
              }),
            ),
          );
        }
      } else {
        await refreshTabData(activeFilter, 1, {forceRefresh: true});
      }

      markTabRefreshed(activeFilter);

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
    refreshTabData,
    markTabRefreshed,
  ]);

  // Simple clear filters handler
  const clearFilters = useCallback(async () => {
    if (isSearching) {
      return;
    }

    try {
      setIsSearching(true);

      setFilters(INITIAL_FILTERS);
      setSearchText('');
      searchSnapshotRef.current = {queryKey: null, rows: []};
      setDate(new Date());
      setUseCustomDate(false);
      setPage(1);
      setFiltersJustApplied(false);
      setModalVisible(false);
      hadSearchRef.current = false;

      await refreshTabData(activeFilter, 1, {forceRefresh: true});
      markTabRefreshed(activeFilter);

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
      setIsSearching(false);
    }
  }, [isSearching, activeFilter, refreshTabData, markTabRefreshed]);

  // Optimized end reached handler
  const handleEndReached = useCallback(() => {
    if (isSearching || isLoadingMore) {
      return;
    }

    const currentData = activeFilter === 'Result' ? resultData : data;
    if (currentData?.total_pages && page < currentData.total_pages) {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      // If there's a search query, use search API for pagination
      if (isActiveSearch(searchText)) {
        if (activeFilter === 'Result') {
          dispatch(
            fetchresultData(
              buildResultSearchParams({
                searchText,
                page: nextPage,
                filters,
                useCustomDate,
                date,
              }),
            ),
          )
            .then(() => {
              setPage(nextPage);
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        } else {
          dispatch(
            searchTenderData(
              buildTenderSearchParams({
                searchText,
                page: nextPage,
                tab: activeFilter,
                filters,
                useCustomDate,
                date,
              }),
            ),
          )
            .then(() => {
              setPage(nextPage);
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        }
      } else {
        const params = buildApiParams(nextPage, activeFilter);
        const requests = [];

        if (activeFilter === 'Result') {
          requests.push(dispatch(fetchresultData(params)));
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
    if (!guardTenderAccess(navigation)) {
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
    if (isLoggedIn) {
      dispatch(getSavedBids());
    } else {
      setSavedPks(new Set());
    }
  }, [isLoggedIn, dispatch]);

  // Navigation handlers
  const handleSaveBids = useCallback(
    pk => {
      if (!guardTenderAccess(navigation)) {
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
    [savedPks, dispatch, navigation],
  );

  const handleDetailNavigation = useCallback(
    pk => {
      const tenderData = stableDisplayData.find(item => item.pk === pk);
      const detailScreen =
        activeFilter === 'Result' ? 'ResultDetails' : 'HomeDetails';
      const redirectAfterLogin = {
        screen: detailScreen,
        params: {id: pk, tenderData},
      };

      if (!guardTenderAccess(navigation, redirectAfterLogin)) {
        return;
      }

      navigation.navigate(detailScreen, {id: pk, tenderData});
    },
    [navigation, activeFilter, stableDisplayData],
  );

  // Date handlers
  const handleDateConfirm = useCallback(selectedDate => {
    setDatepicker(false);
    setDate(selectedDate);
    setUseCustomDate(true);
  }, []);

  // Filter button handler - optimized for instant switching
  const handleFilterPress = useCallback(
    async filterType => {
      setActiveFilter(filterType);
      setPage(1);
      setIsLoadingMore(false);
      setFiltersJustApplied(false);

      const refreshKey = buildRefreshKey(filterType, {
        search: searchText,
        hasFilters: hasActiveFilters,
      });

      if (isActiveSearch(searchText)) {
        await performServerSideSearch(searchText, 1, filterType);
        markTabRefreshed(filterType);
        return;
      }

      if (refreshThrottleRef.current.shouldRefresh(refreshKey)) {
        await refreshTabData(filterType, 1, {forceRefresh: false});
        markTabRefreshed(filterType);
      }
    },
    [
      performServerSideSearch,
      refreshTabData,
      searchText,
      markTabRefreshed,
      hasActiveFilters,
    ],
  );

  // Image icon press handler - viewing the gallery requires login.
  const handleImagePress = useCallback(() => {
    if (!guardTenderAccess(navigation, {screen: 'ImageGallery'})) {
      return;
    }

    try {
      navigation.navigate('ImageGallery');
    } catch (error) {}
  }, [navigation]);

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
    const hasSearch = isActiveSearch(searchText);
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
                    setFiltersJustApplied(false);
                    hadSearchRef.current = false;

                    await refreshTabData(activeFilter, 1, {forceRefresh: true});
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
  }, [hasActiveFilters, searchText, activeFilter, refreshTabData]);

  // Fixed renderItem function with null safety
  const renderItem = useCallback(
    ({item}) => {
      if (!item || !item.pk) {
        return null;
      }

      return (
        <TenderCard
          item={item}
          isResultData={activeFilter === 'Result'}
          isSaved={savedPks.has(item.pk)}
          onImagePress={openImageModal}
          onTitlePress={handleDetailNavigation}
          onSavePress={handleSaveBids}
        />
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

  const handlePullToRefresh = useCallback(async () => {
    if (isSearching || isPullRefreshing) {
      return;
    }

    setPage(1);
    setIsLoadingMore(false);

    if (isLoggedIn) {
      dispatch(getSavedBids());
    }

    try {
      setIsPullRefreshing(true);

      if (isActiveSearch(searchText)) {
        await performServerSideSearch(searchText, 1);
      } else {
        await refreshTabData(activeFilter, 1, {forceRefresh: true});
      }

      markTabRefreshed(activeFilter);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Refresh Failed',
        text2: 'Could not update the list. Please try again.',
        visibilityTime: 3000,
      });
    } finally {
      setIsPullRefreshing(false);
    }
  }, [
    isSearching,
    isPullRefreshing,
    isLoggedIn,
    dispatch,
    searchText,
    performServerSideSearch,
    activeFilter,
    refreshTabData,
    markTabRefreshed,
  ]);

  const handleClearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const listHeaderElement = useMemo(
    () => (
      <HomeListHeader
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        onOpenModal={openModal}
        activeFilter={activeFilter}
        onFilterPress={handleFilterPress}
        onImagePress={handleImagePress}
        isSearching={isSearching && isActiveSearch(searchText)}
      />
    ),
    [
      searchText,
      handleSearchChange,
      handleClearSearch,
      hasActiveFilters,
      activeFilterCount,
      openModal,
      activeFilter,
      handleFilterPress,
      handleImagePress,
      isSearching,
    ],
  );

  // Improved FlatList props with better empty state handling and optimized performance
  const flatListProps = useMemo(
    () => ({
      data: stableDisplayData,
      renderItem,
      keyExtractor: (item, index) => item?.__stableKey || `home-item-${index}`,
      extraData: `${activeFilter}-${savedPks.size}-${isSearching}`,
      onEndReached: handleEndReached,
      onEndReachedThreshold: 0.2,
      removeClippedSubviews: true,
      maxToRenderPerBatch: 12,
      windowSize: 7,
      initialNumToRender: 10,
      updateCellsBatchingPeriod: 50,
      ListEmptyComponent: () => {
        if (stableDisplayData.length > 0) {
          return null;
        }

        const isApiLoading = isPullRefreshing || isSearching;
        const isReduxLoading =
          activeFilter === 'Result' ? resultLoading : cardLoading;
        const hasError =
          activeFilter === 'Result' ? resultError : apiError;
        const hasSearch = isActiveSearch(searchText);
        const hasFilters = hasActiveFilters;

        if (hasError) {
          return <ErrorComponent />;
        }

        if (hasSearch || hasFilters) {
          if (isSearching || isReduxLoading) {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0375B7" />
                <Text style={styles.loadingText}>
                  {hasSearch ? 'Searching...' : 'Loading...'}
                </Text>
              </View>
            );
          }
          return <NoTenderFoundComponent />;
        }

        if (isApiLoading || isReduxLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0375B7" />
              <Text style={styles.loadingText}>Loading tenders...</Text>
            </View>
          );
        }

        return <NoTenderFoundComponent />;
      },
      ListFooterComponent: isLoadingMore ? (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#0375B7" />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      ) : stableDisplayData.length > 0 ? (
        <AdSpace />
      ) : null,
    }),
    [
      stableDisplayData,
      isPullRefreshing,
      activeFilter,
      cardLoading,
      resultLoading,
      isSearching,
      handleEndReached,
      isLoadingMore,
      apiError,
      resultError,
      searchText,
      hasActiveFilters,
      savedPks.size,
      ErrorComponent,
      NoTenderFoundComponent,
      renderItem,
    ],
  );

  return (
    <SafeAreaView style={styles.HomeContainer} edges={['top']}>
      <View style={{flex: 1, paddingBottom: 10}}>
        {listHeaderElement}
        <FlatList
          {...flatListProps}
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 20, flexGrow: 1}}
          refreshControl={
            <RefreshControl
              refreshing={isPullRefreshing}
              onRefresh={handlePullToRefresh}
              colors={['#0375B7']}
              tintColor="#0375B7"
            />
          }
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
