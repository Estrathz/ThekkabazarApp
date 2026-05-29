import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL, API_HEADERS} from './apiUrl';

const MAX_DETAIL_PAGES = 25;

const buildQueryKey = params => {
  const queryParams = {...(params || {})};
  delete queryParams.page;
  return JSON.stringify(queryParams);
};

// Common error handler
const handleApiError = error => {
  console.error('API Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });

  if (error.response?.status === 404) {
    return {
      message: 'Tender not found',
      status: 404,
    };
  }

  return {
    message: error.response?.data?.message || 'Failed to fetch data',
    status: error.response?.status || 500,
    response: error.response?.data,
  };
};

// Fetch list of tender results
export const fetchresultData = createAsyncThunk(
  'result/fetchresultData',
  async (params, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tender/apis/tender-awarded-to/`,
        {
          params,
          headers: API_HEADERS,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// Fetch single tender result
export const fetchOneResultData = createAsyncThunk(
  'result/fetchOneResultData',
  async ({tenderId}, {rejectWithValue}) => {
    try {
      let foundTender = null;
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage && !foundTender && currentPage <= MAX_DETAIL_PAGES) {
        const response = await axios.get(
          `${BASE_URL}/tender/apis/tender-awarded-to/`,
          {
            params: {page: currentPage},
            headers: API_HEADERS,
          },
        );

        // Validate response data
        if (!response.data?.data || response.data.data.length === 0) {
          break;
        }

        // Find the specific tender by ID
        foundTender = response.data.data.find(item => item.pk === tenderId);

        // Check if we need to fetch the next page
        hasNextPage = !!response.data.next;
        currentPage++;
      }

      if (!foundTender) {
        return rejectWithValue({
          message:
            currentPage > MAX_DETAIL_PAGES
              ? 'Unable to find tender details. Please try again.'
              : 'Tender not found',
          status: 404,
        });
      }

      return foundTender;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// Initial state
const initialState = {
  data: null,
  one: null,
  error: null,
  loading: false,
  currentId: null,
  listQueryKey: null,
};

// Create the slice
const resultSlice = createSlice({
  name: 'result',
  initialState,
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
    clearSingleResult: state => {
      state.one = null;
      state.currentId = null;
      // Don't clear state.data to preserve the list
    },
    hydrateResultListFromCache: (state, action) => {
      if (action.payload?.data && Array.isArray(action.payload.data)) {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Handle fetchresultData
      .addCase(fetchresultData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchresultData.fulfilled, (state, action) => {
        state.loading = false;
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
      .addCase(fetchresultData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchOneResultData
      .addCase(fetchOneResultData.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentId = action.meta.arg.tenderId;
      })
      .addCase(fetchOneResultData.fulfilled, (state, action) => {
        if (action.meta.arg.tenderId !== state.currentId) {
          return;
        }
        state.loading = false;
        state.one = action.payload;
        state.error = null;
      })
      .addCase(fetchOneResultData.rejected, (state, action) => {
        if (action.meta.arg.tenderId !== state.currentId) {
          return;
        }
        state.loading = false;
        state.error = action.payload;
        state.one = null;
        state.currentId = null;
      });
  },
});

export const {
  clearError,
  clearData,
  clearSingleResult,
  hydrateResultListFromCache,
} = resultSlice.actions;
export default resultSlice.reducer;
