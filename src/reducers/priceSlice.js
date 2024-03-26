// dataSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = 'https://thekkabazar.itnepalsolutions.com';

export const fetchPriceData = createAsyncThunk(
  'data/fetchPriceData',
  async () => {
    const response = await axios.get(`${BASE_URL}/thekkabazar/apis/pricing/`);
    const data = response.data;
    console.log(data);
    return data;
  },
);

const priceSlice = createSlice({
  name: 'data',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPriceData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPriceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPriceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default priceSlice.reducer;
