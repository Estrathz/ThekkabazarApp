import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';

export const fetchDropdownData = createAsyncThunk(
  'dropdown/fetchDropdownData',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/tender/apis/master/list/`;
      console.log('Fetching dropdown data from:', url);
      
      const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'X-CSRFToken': 'bwQJROlt74LsvQqQuOi10XS8WEyGPgpVSfLN7HfQbsFEAu5NMRk3KkYuNsIenqFO'
        }
      });
      
      console.log('Dropdown API Response:', response.data);
      
      // Return the data object from the response
      return response.data.data;
    } catch (error) {
      console.error('Dropdown API Error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
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
        console.log('Dropdown data updated in state:', action.payload);
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.dropdownerror = action.payload;
        console.error('Dropdown error in state:', action.payload);
      });
  },
});

export default dropdownSlice.reducer;