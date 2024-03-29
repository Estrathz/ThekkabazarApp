import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = 'https://thekkabazar.itnepalsolutions.com';

export const fetchInterestData = createAsyncThunk(
  'data/fetchInterestData',
  async ({access_token}) => {
    console.log(access_token, 'sdfvkajsdvfkajsdv');
    const response = await axios.get(
      `${BASE_URL}/accounts/apis/usermanagement/intrest/`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const data = response.data;
    return data;
  },
);

const interestSlice = createSlice({
  name: 'data',
  initialState: {
    interestdata: [],
    status: 'idle',
    interesterror: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInterestData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchInterestData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interestdata = action.payload;
      })
      .addCase(fetchInterestData.rejected, (state, action) => {
        state.status = 'failed';
        state.interesterror = action.error.message;
      });
  },
});

export default interestSlice.reducer;
