import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchresultData = createAsyncThunk(
  'result/fetchresultData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/results', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const resultSlice = createSlice({
  name: 'result',
  initialState: {
    data: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default resultSlice.reducer;