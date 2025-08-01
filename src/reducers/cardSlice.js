import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';
import Toast from 'react-native-toast-message';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check cache
const getCachedData = (key) => {
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
    timestamp: Date.now()
  });
};

export const fetchTenderListData = createAsyncThunk(
  'card/fetchTenderListData',
  async (params, {rejectWithValue}) => {
    try {
      const cacheKey = JSON.stringify(params);
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const url = `${BASE_URL}/tender/apis/tender/list/`;
      const response = await axios.get(url, {
        params,
        headers: {
          'accept': 'application/json',
          'X-CSRFToken': 'bwQJROlt74LsvQqQuOi10XS8WEyGPgpVSfLN7HfQbsFEAu5NMRk3KkYuNsIenqFO'
        }
      });

      const responseData = {
        data: response.data.data,
        total_pages: response.data.total_pages,
        current_page: response.data.current_page,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      };

      setCachedData(cacheKey, responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOneTenderData = createAsyncThunk(
  'data/fetchOneTenderData',
  async ({tenderId}) => {
    const response = await axios.get(
      `   ${BASE_URL}/tender/apis/tenders/${tenderId}/`,
    );

    const data = response.data;
    return data;
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
    one: [],
    status: 'idle',
    error: null,
    message: '',
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTenderListData.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTenderListData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTenderListData.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
        console.error('Tender list error in state:', action.payload);
      })
      .addCase(fetchOneTenderData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOneTenderData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.one = action.payload;
      })
      .addCase(fetchOneTenderData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
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

export default cardSlice.reducer;
