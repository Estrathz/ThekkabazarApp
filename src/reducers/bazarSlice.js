import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {createAction} from '@reduxjs/toolkit';
// const BASE_URL = 'https://thekkabazar.itnepalsolutions.com';
import {BASE_URL} from './apiUrl';

export const fetchbazarData = createAsyncThunk(
  'data/fetchbazarData',
  async () => {
    const response = await axios.get(
      ` ${BASE_URL}/products/apis/products/category/list/`,
    );
    const data = response.data;
    return data.data;
  },
);

export const updateSearchQuery = createAction('data/updateSearchQuery');

export const fetchproductListData = createAsyncThunk(
  'data/fetchproductListData',
  async ({mainCategory, businessType, location, subcategory, page, search}) => {
    const params = new URLSearchParams();

    if (mainCategory) {
      params.append('maincategory', mainCategory);
    }

    if (businessType) {
      params.append('businesstype', businessType);
    }

    if (location) {
      params.append('location', location);
    }

    if (subcategory) {
      params.append('subcategory', subcategory);
    }

    if (page) {
      params.append('page', page);
    }

    if (search) {
      params.append('search', search);
    }

    const response = await axios.get(
      `${BASE_URL}/products/apis/products/list/?${params.toString()}`,
    );

    const data = response.data;
    return data;
  },
);

const bazarSlice = createSlice({
  name: 'data',
  initialState: {
    data: [],
    productList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchbazarData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchbazarData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchbazarData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchproductListData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchproductListData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productList = action.payload;
      })
      .addCase(fetchproductListData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default bazarSlice.reducer;
