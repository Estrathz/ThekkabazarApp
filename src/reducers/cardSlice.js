import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import {BASE_URL, API_HEADERS} from './apiUrl';
import Toast from 'react-native-toast-message';
import {
  NEWSPAPER_DAYS_WINDOW,
  dedupeTendersByPk,
} from '../utils/newspaperTenders';

export const HOME_TENDER_TABS = ['All', 'PPMO/EGP', 'Others'];

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = key => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const emptyTabBucket = () => ({
  data: null,
  loading: false,
  error: null,
  listQueryKey: null,
});

const createInitialTabLists = () =>
  HOME_TENDER_TABS.reduce((acc, tab) => {
    acc[tab] = emptyTabBucket();
    return acc;
  }, {});

export const resolveHomeTab = (params = {}) => {
  if (params.homeTab && HOME_TENDER_TABS.includes(params.homeTab)) {
    return params.homeTab;
  }
  if (params.activeFilter && HOME_TENDER_TABS.includes(params.activeFilter)) {
    return params.activeFilter;
  }
  if (params.source === 'PPMO/EGP') {
    return 'PPMO/EGP';
  }
  if (params.exclude_source === 'PPMO/EGP') {
    return 'Others';
  }
  return 'All';
};

const shouldStoreInTabLists = params => params?.storeInTabLists !== false;

const buildQueryKey = (params, {isSearch = false} = {}) => {
  const queryParams = {...(params || {})};
  delete queryParams.page;
  delete queryParams.forceRefresh;
  delete queryParams.homeTab;
  delete queryParams.storeInTabLists;
  const tab = resolveHomeTab(params);
  const prefix = isSearch ? 'search' : 'list';
  return `${tab}:${prefix}:${JSON.stringify(queryParams)}`;
};

export const buildHomeTabQueryKey = (params, options) =>
  buildQueryKey(params, options);

const mergeListPayload = (existingData, payload, incomingData) => {
  const merged = [...(existingData || []), ...incomingData];
  const uniqueByPk = new Map();
  merged.forEach(item => {
    const key = item?.pk ?? item?.id ?? `${item?.title}-${item?.published_date}`;
    uniqueByPk.set(key, item);
  });
  return {
    ...payload,
    data: Array.from(uniqueByPk.values()),
  };
};

const ensureTabBucket = (state, tabKey) => {
  if (!state.tabLists[tabKey]) {
    state.tabLists[tabKey] = emptyTabBucket();
  }
  return state.tabLists[tabKey];
};

const NEWSPAPER_LIST_URL = `${BASE_URL}/tender/apis/tender/list/`;
const NEWSPAPER_PAGE_SIZE = 100;
const NEWSPAPER_MAX_PAGES_PER_DAY = 50;
const NEWSPAPER_REQUEST_TIMEOUT = 20000;

const fetchTendersForPublishedDate = async publishedDate => {
  const collected = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= NEWSPAPER_MAX_PAGES_PER_DAY) {
    try {
      const response = await axios.get(NEWSPAPER_LIST_URL, {
        params: {
          page,
          page_size: NEWSPAPER_PAGE_SIZE,
          exclude_source: 'PPMO/EGP',
          published_date: publishedDate,
        },
        headers: API_HEADERS,
        timeout: NEWSPAPER_REQUEST_TIMEOUT,
      });

      const batch = response.data?.data || [];
      totalPages = response.data?.total_pages || 1;
      collected.push(...batch);
      page += 1;
    } catch (error) {
      break;
    }
  }

  return collected;
};

export const fetchNewspaperTenderList = createAsyncThunk(
  'card/fetchNewspaperTenderList',
  async (params = {}, {rejectWithValue}) => {
    try {
      const forceRefresh = !!params.forceRefresh;
      const days = params.days ?? NEWSPAPER_DAYS_WINDOW;
      const cacheKey = `newspaper:${days}days:by-date`;
      const cachedData = getCachedData(cacheKey);

      if (!forceRefresh && cachedData) {
        return cachedData;
      }

      const dateStrings = Array.from({length: days}, (_, i) =>
        moment().subtract(i, 'days').format('YYYY-MM-DD'),
      );

      const dayResults = await Promise.allSettled(
        dateStrings.map(dateStr => fetchTendersForPublishedDate(dateStr)),
      );

      const collected = dayResults.flatMap(result =>
        result.status === 'fulfilled' ? result.value : [],
      );

      const deduped = dedupeTendersByPk(collected).filter(
        item => item?.source !== 'PPMO/EGP',
      );

      deduped.sort(
        (a, b) =>
          moment(b?.published_date).valueOf() -
          moment(a?.published_date).valueOf(),
      );

      const responseData = {
        data: deduped,
        count: deduped.length,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null,
      };

      if (deduped.length > 0) {
        setCachedData(cacheKey, responseData);
      }
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchTenderListData = createAsyncThunk(
  'card/fetchTenderListData',
  async (params, {rejectWithValue}) => {
    try {
      const requestParams = {...(params || {})};
      const forceRefresh = !!requestParams.forceRefresh;
      delete requestParams.forceRefresh;
      delete requestParams.homeTab;
      delete requestParams.storeInTabLists;
      const cacheKey = JSON.stringify(requestParams);
      const cachedData = getCachedData(cacheKey);

      if (!forceRefresh && cachedData) {
        return cachedData;
      }

      const url = `${BASE_URL}/tender/apis/tender/list/`;
      const response = await axios.get(url, {
        params: requestParams,
        headers: API_HEADERS,
      });

      const responseData = {
        data: response.data.data,
        total_pages: response.data.total_pages,
        current_page: response.data.current_page,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      };

      setCachedData(cacheKey, responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const searchTenderData = createAsyncThunk(
  'card/searchTenderData',
  async (searchParams, {rejectWithValue}) => {
    try {
      const {
        searchText,
        page = 1,
        page_size = 50,
        organization_sector,
        category,
        district,
        project_type,
        procurement_type,
        source,
        published_date,
        activeFilter,
      } = searchParams;

      const params = {
        page,
        page_size,
      };

      if (searchText && searchText.trim() !== '') {
        params.search = searchText.trim();
      }
      if (organization_sector) {
        params.organization_sector = organization_sector;
      }
      if (category) {
        params.category = category;
      }
      if (district) {
        params.district = district;
      }
      if (project_type) {
        params.project_type = project_type;
      }
      if (procurement_type) {
        params.procurement_type = procurement_type;
      }
      if (source) {
        params.source = source;
      }
      if (published_date) {
        params.published_date = published_date;
      }

      if (activeFilter === 'PPMO/EGP') {
        params.source = 'PPMO/EGP';
      } else if (activeFilter === 'Others') {
        params.exclude_source = 'PPMO/EGP';
      }

      const cacheKey = `search:${buildQueryKey(searchParams, {isSearch: true})}`;
      if (page === 1) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          return {...cachedData, searchParams};
        }
      }

      const url = `${BASE_URL}/tender/apis/tender/list/`;
      const response = await axios.get(url, {
        params,
        headers: API_HEADERS,
      });

      const responseData = {
        data: response.data.data,
        total_pages: response.data.total_pages,
        current_page: response.data.current_page,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        searchParams,
      };

      if (page === 1) {
        setCachedData(cacheKey, responseData);
      }

      return responseData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchOneTenderData = createAsyncThunk(
  'data/fetchOneTenderData',
  async ({tenderId}, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tender/apis/tenders/${tenderId}/`,
        {
          headers: API_HEADERS,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: 'Tender not found',
          status: 404,
        });
      }

      return rejectWithValue({
        message:
          error.response?.data?.message || 'Failed to fetch tender details',
        status: error.response?.status || 500,
        response: error.response?.data,
      });
    }
  },
);

export const savebid = createAsyncThunk(
  'data/savebid',
  async ({id}, {getState}) => {
    const state = getState();
    const token = state.users.access_token;

    if (!token) {
      throw new Error('No access token available');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/tender/apis/tender-save-or-unsave/${id}/`,
        null,
        config,
      );
      return response.data.message;
    } catch (error) {
      throw error;
    }
  },
);

const applyListToTab = (state, action, {isSearch = false} = {}) => {
  const arg = action.meta.arg || {};
  if (!shouldStoreInTabLists(arg)) {
    return;
  }

  const tabKey = resolveHomeTab(arg);
  const bucket = ensureTabBucket(state, tabKey);
  const page = Number(arg.page || 1);
  const queryKey = buildQueryKey(arg, {isSearch});
  const incomingData = action.payload?.data || [];

  bucket.loading = false;
  bucket.error = null;

  if (
    page > 1 &&
    bucket.listQueryKey === queryKey &&
    Array.isArray(bucket.data?.data)
  ) {
    bucket.data = mergeListPayload(bucket.data.data, action.payload, incomingData);
  } else {
    bucket.data = action.payload;
  }

  bucket.listQueryKey = queryKey;
  state.data = bucket.data;
  state.error = null;
};

const cardSlice = createSlice({
  name: 'card',
  initialState: {
    tabLists: createInitialTabLists(),
    data: null,
    newspaperData: null,
    one: null,
    status: 'idle',
    newspaperStatus: 'idle',
    error: null,
    newspaperError: null,
    message: '',
    loading: false,
    newspaperLoading: false,
    currentId: null,
    listQueryKey: null,
  },
  reducers: {
    clearError: state => {
      state.error = null;
      Object.values(state.tabLists).forEach(bucket => {
        bucket.error = null;
      });
    },
    clearData: state => {
      state.tabLists = createInitialTabLists();
      state.data = null;
      state.one = null;
      state.currentId = null;
      state.listQueryKey = null;
    },
    clearSingleTender: state => {
      state.one = null;
      state.currentId = null;
    },
    hydrateTenderListFromCache: (state, action) => {
      if (action.payload?.data && Array.isArray(action.payload.data)) {
        const bucket = ensureTabBucket(state, 'All');
        bucket.data = action.payload;
        bucket.loading = false;
        bucket.error = null;
        state.data = action.payload;
        state.status = 'succeeded';
        state.loading = false;
        state.error = null;
      }
    },
    hydrateHomeTabFromCache: (state, action) => {
      const {tab, payload} = action.payload || {};
      if (!tab || !HOME_TENDER_TABS.includes(tab)) {
        return;
      }
      if (!payload?.data || !Array.isArray(payload.data)) {
        return;
      }
      const bucket = ensureTabBucket(state, tab);
      bucket.data = payload;
      bucket.loading = false;
      bucket.error = null;
      if (tab === 'All') {
        state.data = payload;
        state.status = 'succeeded';
        state.loading = false;
        state.error = null;
      }
    },
    hydrateNewspaperFromCache: (state, action) => {
      if (action.payload?.data && Array.isArray(action.payload.data)) {
        state.newspaperData = action.payload;
        state.newspaperStatus = 'succeeded';
        state.newspaperLoading = false;
        state.newspaperError = null;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTenderListData.pending, (state, action) => {
        if (!shouldStoreInTabLists(action.meta.arg)) {
          return;
        }
        const tabKey = resolveHomeTab(action.meta.arg);
        const bucket = ensureTabBucket(state, tabKey);
        const forceRefresh = !!action.meta.arg?.forceRefresh;
        const hasExistingData =
          Array.isArray(bucket.data?.data) && bucket.data.data.length > 0;
        if (!forceRefresh && hasExistingData) {
          bucket.error = null;
          return;
        }
        bucket.loading = true;
        bucket.error = null;
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTenderListData.fulfilled, (state, action) => {
        applyListToTab(state, action);
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(fetchTenderListData.rejected, (state, action) => {
        if (!shouldStoreInTabLists(action.meta.arg)) {
          return;
        }
        const tabKey = resolveHomeTab(action.meta.arg);
        const bucket = ensureTabBucket(state, tabKey);
        bucket.loading = false;
        bucket.error = action.payload;
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchNewspaperTenderList.pending, (state, action) => {
        const days = action.meta.arg?.days ?? NEWSPAPER_DAYS_WINDOW;
        if (days === NEWSPAPER_DAYS_WINDOW) {
          state.newspaperLoading = true;
          state.newspaperStatus = 'loading';
          state.newspaperError = null;
        }
      })
      .addCase(fetchNewspaperTenderList.fulfilled, (state, action) => {
        state.newspaperLoading = false;
        state.newspaperStatus = 'succeeded';
        const days = action.meta.arg?.days ?? NEWSPAPER_DAYS_WINDOW;
        if (days === NEWSPAPER_DAYS_WINDOW) {
          state.newspaperData = action.payload;
        }
      })
      .addCase(fetchNewspaperTenderList.rejected, (state, action) => {
        const days = action.meta.arg?.days ?? NEWSPAPER_DAYS_WINDOW;
        if (days === NEWSPAPER_DAYS_WINDOW) {
          state.newspaperLoading = false;
          state.newspaperStatus = 'failed';
          state.newspaperError = action.payload;
        }
      })
      .addCase(searchTenderData.pending, (state, action) => {
        if (!shouldStoreInTabLists(action.meta.arg)) {
          return;
        }
        const tabKey = resolveHomeTab(action.meta.arg);
        const bucket = ensureTabBucket(state, tabKey);
        const page = Number(action.meta.arg?.page || 1);
        const hasExistingData =
          page === 1 &&
          Array.isArray(bucket.data?.data) &&
          bucket.data.data.length > 0;
        if (hasExistingData) {
          bucket.error = null;
          return;
        }
        bucket.loading = true;
        bucket.error = null;
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchTenderData.fulfilled, (state, action) => {
        applyListToTab(state, action, {isSearch: true});
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(searchTenderData.rejected, (state, action) => {
        if (!shouldStoreInTabLists(action.meta.arg)) {
          return;
        }
        const tabKey = resolveHomeTab(action.meta.arg);
        const bucket = ensureTabBucket(state, tabKey);
        bucket.loading = false;
        bucket.error = action.payload;
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchOneTenderData.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.currentId = action.meta.arg.tenderId;
      })
      .addCase(fetchOneTenderData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.one = action.payload;
        state.error = null;
      })
      .addCase(fetchOneTenderData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.one = null;
        state.currentId = null;
      })
      .addCase(savebid.pending, state => {
        state.status = 'loading';
      })
      .addCase(savebid.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload;
        Toast.show({
          type: 'success',
          text1: action.payload,
          visibilityTime: 2000,
        });
      })
      .addCase(savebid.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectHomeTabBucket = (state, tab) =>
  state.card.tabLists?.[tab] || emptyTabBucket();

export const {
  clearError,
  clearData,
  clearSingleTender,
  hydrateTenderListFromCache,
  hydrateHomeTabFromCache,
  hydrateNewspaperFromCache,
} = cardSlice.actions;

export default cardSlice.reducer;
