import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './apiUrl';

// Common headers for API calls
const API_HEADERS = {
  'accept': 'application/json',
  'X-CSRFToken': 'bwQJROlt74LsvQqQuOi10XS8WEyGPgpVSfLN7HfQbsFEAu5NMRk3KkYuNsIenqFO'
};

// Common error handler
const handleApiError = (error) => {
  console.error('API Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });

  if (error.response?.status === 404) {
    return {
      message: 'Tender not found',
      status: 404
    };
  }

  return {
    message: error.response?.data?.message || 'Failed to fetch data',
    status: error.response?.status || 500,
    response: error.response?.data
  };
};

// Fetch list of tender results
export const fetchresultData = createAsyncThunk(
  'result/fetchresultData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/tender/apis/tender-awarded-to/`, { 
        params,
        headers: API_HEADERS
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch single tender result
export const fetchOneResultData = createAsyncThunk(
  'result/fetchOneResultData',
  async ({ tenderId }, { rejectWithValue }) => {
    try {
      console.log('Fetching tender details for ID:', tenderId);
      let foundTender = null;
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage && !foundTender) {
        const response = await axios.get(`${BASE_URL}/tender/apis/tender-awarded-to/`, {
          params: { page: currentPage },
          headers: API_HEADERS
        });
        
        console.log(`Fetching page ${currentPage}`);
        
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
        console.error('Tender not found with ID:', tenderId);
        return rejectWithValue({
          message: 'Tender not found',
          status: 404
        });
      }
      
      console.log('Found tender:', foundTender);
      return foundTender;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState = {
  data: null,
  one: null,
  error: null,
  loading: false,
  currentId: null,
};

// Create the slice
const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = null;
      state.one = null;
      state.currentId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchresultData
      .addCase(fetchresultData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchresultData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
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
        state.loading = false;
        state.one = action.payload;
        state.error = null;
      })
      .addCase(fetchOneResultData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.one = null;
        state.currentId = null;
      });
  },
});

export const { clearError, clearData } = resultSlice.actions;
export default resultSlice.reducer;