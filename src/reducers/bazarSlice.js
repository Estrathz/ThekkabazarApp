import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAction } from '@reduxjs/toolkit';
import { BASE_URL } from './apiUrl';

// Fetch bazar categories data
export const fetchbazarData = createAsyncThunk(
  'bazar/fetchbazarData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching bazar data from:', `${BASE_URL}/products/apis/products/category/list/`);
      const response = await axios.get(
        `${BASE_URL}/products/apis/products/category/list/`,
      );
      const data = response.data;
      console.log('Bazar data response:', data);
      return data.data;
    } catch (error) {
      console.error('Bazar data fetch error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch categories');
    }
  },
);

// Fetch product list data
export const fetchproductListData = createAsyncThunk(
  'bazar/fetchproductListData',
  async ({ mainCategory, businessType, location, subcategory, page, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Validate and add parameters
      if (mainCategory && mainCategory.trim() !== '') {
        params.append('maincategory', mainCategory.trim());
      }

      if (businessType && businessType.trim() !== '') {
        params.append('businesstype', businessType.trim());
      }

      if (location && location.trim() !== '') {
        params.append('location', location.trim());
      }

      if (subcategory && subcategory.trim() !== '') {
        params.append('subcategory', subcategory.trim());
      }

      if (page && page > 0) {
        params.append('page', page.toString());
      }

      if (search && search.trim() !== '') {
        params.append('search', search.trim());
      }

      const url = `${BASE_URL}/products/apis/products/list/?${params.toString()}`;
      console.log('Fetching product list from:', url);
      console.log('Parameters:', { mainCategory, businessType, location, subcategory, page, search });
      
      const response = await axios.get(url);
      const data = response.data;
      
      console.log('Product list response:', data);
      return data;
    } catch (error) {
      console.error('Product list fetch error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
    }
  },
);

// Action creators
export const updateSearchQuery = createAction('bazar/updateSearchQuery');
export const clearBazarError = createAction('bazar/clearError');
export const resetBazarState = createAction('bazar/resetState');

const bazarSlice = createSlice({
  name: 'bazar',
  initialState: {
    // Categories data
    data: [],
    categoriesStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    categoriesError: null,
    
    // Product list data
    productList: [],
    productListStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    productListError: null,
    
    // General state
    status: 'idle', // Legacy status for backward compatibility
    error: null, // Legacy error for backward compatibility
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.categoriesError = null;
      state.productListError = null;
    },
    resetState: (state) => {
      state.data = [];
      state.productList = [];
      state.categoriesStatus = 'idle';
      state.productListStatus = 'idle';
      state.status = 'idle';
      state.categoriesError = null;
      state.productListError = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Categories data cases
      .addCase(fetchbazarData.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.status = 'loading'; // Legacy
        state.categoriesError = null;
        state.error = null; // Legacy
      })
      .addCase(fetchbazarData.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.status = 'succeeded'; // Legacy
        state.data = action.payload;
        state.categoriesError = null;
        state.error = null; // Legacy
      })
      .addCase(fetchbazarData.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.status = 'failed'; // Legacy
        state.categoriesError = action.payload || action.error.message;
        state.error = action.payload || action.error.message; // Legacy
      })
      
      // Product list data cases
      .addCase(fetchproductListData.pending, (state) => {
        state.productListStatus = 'loading';
        state.status = 'loading'; // Legacy
        state.productListError = null;
        state.error = null; // Legacy
      })
      .addCase(fetchproductListData.fulfilled, (state, action) => {
        state.productListStatus = 'succeeded';
        state.status = 'succeeded'; // Legacy
        state.productList = action.payload;
        state.productListError = null;
        state.error = null; // Legacy
      })
      .addCase(fetchproductListData.rejected, (state, action) => {
        state.productListStatus = 'failed';
        state.status = 'failed'; // Legacy
        state.productListError = action.payload || action.error.message;
        state.error = action.payload || action.error.message; // Legacy
      })
      
      // Action creators
      .addCase(clearBazarError, (state) => {
        state.error = null;
        state.categoriesError = null;
        state.productListError = null;
      })
      .addCase(resetBazarState, (state) => {
        state.data = [];
        state.productList = [];
        state.categoriesStatus = 'idle';
        state.productListStatus = 'idle';
        state.status = 'idle';
        state.categoriesError = null;
        state.productListError = null;
        state.error = null;
      });
  },
});

export default bazarSlice.reducer;
