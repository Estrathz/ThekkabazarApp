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

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check cache
const getCachedData = key => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Helper function to set cache
const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const buildQueryKey = params => {
  const queryParams = {...(params || {})};
  delete queryParams.page;
  delete queryParams.forceRefresh;
  return JSON.stringify(queryParams);
};

const TENDER_LIST_HEADERS = API_HEADERS;

const NEWSPAPER_LIST_URL = `${BASE_URL}/tender/apis/tender/list/`;
const NEWSPAPER_PAGE_SIZE = 100;
const NEWSPAPER_MAX_PAGES_PER_DAY = 50;
const NEWSPAPER_REQUEST_TIMEOUT = 20000;

// Fetch every page for a single published_date. Resilient: a failed page
// (network/404/timeout) stops that day cleanly instead of throwing, so one
// bad request never wipes out the whole newspaper dataset.
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
        headers: TENDER_LIST_HEADERS,
        timeout: NEWSPAPER_REQUEST_TIMEOUT,
      });

      const batch = response.data?.data || [];
      totalPages = response.data?.total_pages || 1;
      collected.push(...batch);
      page += 1;
    } catch (error) {
      // Out-of-range pages return 404; any transient failure should just
      // stop pagination for this day and keep whatever we already collected.
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

      // allSettled so a single failed day doesn't reject the whole fetch.
      const dayResults = await Promise.allSettled(
        dateStrings.map(dateStr => fetchTendersForPublishedDate(dateStr)),
      );

      const collected = dayResults.flatMap(result =>
        result.status === 'fulfilled' ? result.value : [],
      );

      // Server already filters by published_date + excludes PPMO, so trust it
      // and only dedupe. No client-side date re-filtering (avoids dropping
      // items at timezone/day boundaries).
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

      // Only cache a meaningful result; never overwrite good cache with empty.
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

// New server-side search function
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

      // Build search parameters
      const params = {
        page,
        page_size,
      };

      // Add search text if provided
      if (searchText && searchText.trim() !== '') {
        params.search = searchText.trim();
      }

      // Add filter parameters
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

      // Handle source filtering based on active filter
      if (activeFilter === 'PPMO/EGP') {
        params.source = 'PPMO/EGP';
      } else if (activeFilter === 'Others') {
        // For "Others", we'll need to handle this on the server side
        // or implement a workaround
        params.exclude_source = 'PPMO/EGP';
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
        searchParams: searchParams, // Store search params for reference
      };

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
      console.log('Fetching tender details for ID:', tenderId);
      const response = await axios.get(
        `${BASE_URL}/tender/apis/tenders/${tenderId}/`,
        {
          headers: API_HEADERS,
        },
      );

      const data = response.data;
      console.log('Tender details fetched:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);

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
    console.log('savebid', id);
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
      const data = response.data;
      return data.message;
    } catch (error) {
      console.error('Error while saving bid:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  },
);

const cardSlice = createSlice({
  name: 'card',
  initialState: {
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
    },
    clearData: state => {
      state.data = null;
      state.one = null;
      state.currentId = null;
      state.listQueryKey = null;
    },
    clearSingleTender: state => {
      state.one = null;
      state.currentId = null;
      // Don't clear state.data to preserve the list
    },
    hydrateTenderListFromCache: (state, action) => {
      if (action.payload?.data && Array.isArray(action.payload.data)) {
        state.data = action.payload;
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
      .addCase(fetchTenderListData.pending, state => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTenderListData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        const page = Number(action.meta.arg?.page || 1);
        const queryKey = buildQueryKey(action.meta.arg);
        const incomingData = action.payload?.data || [];

        if (
          page > 1 &&
          state.listQueryKey === queryKey &&
          Array.isArray(state.data?.data)
        ) {
          const merged = [...state.data.data, ...incomingData];
          const uniqueByPk = new Map();
          merged.forEach(item => {
            const key =
              item?.pk ?? item?.id ?? `${item?.title}-${item?.published_date}`;
            uniqueByPk.set(key, item);
          });

          state.data = {
            ...action.payload,
            data: Array.from(uniqueByPk.values()),
          };
        } else {
          state.data = action.payload;
        }

        state.listQueryKey = queryKey;
      })
      .addCase(fetchTenderListData.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
        console.error('Tender list error in state:', action.payload);
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
      .addCase(searchTenderData.pending, state => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchTenderData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        const page = Number(action.meta.arg?.page || 1);
        const queryKey = `search:${buildQueryKey(action.meta.arg)}`;
        const incomingData = action.payload?.data || [];

        if (
          page > 1 &&
          state.listQueryKey === queryKey &&
          Array.isArray(state.data?.data)
        ) {
          const merged = [...state.data.data, ...incomingData];
          const uniqueByPk = new Map();
          merged.forEach(item => {
            const key =
              item?.pk ?? item?.id ?? `${item?.title}-${item?.published_date}`;
            uniqueByPk.set(key, item);
          });

          state.data = {
            ...action.payload,
            data: Array.from(uniqueByPk.values()),
          };
        } else {
          state.data = action.payload;
        }

        state.listQueryKey = queryKey;
      })
      .addCase(searchTenderData.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
        console.error('Tender search error in state:', action.payload);
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

export const {
  clearError,
  clearData,
  clearSingleTender,
  hydrateTenderListFromCache,
  hydrateNewspaperFromCache,
} = cardSlice.actions;

export default cardSlice.reducer;
