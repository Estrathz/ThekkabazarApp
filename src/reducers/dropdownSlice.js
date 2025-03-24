import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';

export const fetchDropdownData = createAsyncThunk(
  'dropdown/fetchDropdownData',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/tender/apis/master/list/`;
      
      const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'X-CSRFToken': 'bwQJROlt74LsvQqQuOi10XS8WEyGPgpVSfLN7HfQbsFEAu5NMRk3KkYuNsIenqFO'
        }
      });
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: {
    dropdowndata: null,
    dropdownerror: null,
    status: 'idle',
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownData.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.dropdownerror = null;
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.dropdowndata = action.payload;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.dropdownerror = action.payload;
      });
  },
});

export default dropdownSlice.reducer;