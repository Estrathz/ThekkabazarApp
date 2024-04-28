import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';

export const fetchbanner = createAsyncThunk(
  'data/fetchbanner',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/thekkabazar/apis/mobile-banner`,
    );
    const data = response.data;
    
    return data;
  },
);

const bannerSlice = createSlice({
  name: 'data',
  initialState: {
    bannerdata: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchbanner.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchbanner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bannerdata = action.payload;
      })
      .addCase(fetchbanner.rejected, (state, action) => {
        state.status = 'failed';
        state.interesterror = action.error.message;
      });
  },
});

export default bannerSlice.reducer;
