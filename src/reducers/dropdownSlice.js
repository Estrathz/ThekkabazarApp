import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDropdownData = createAsyncThunk(
  'dropdown/fetchDropdownData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/dropdown');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: {
    dropdowndata: null,
    dropdownerror: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownData.pending, (state) => {
        state.loading = true;
        state.dropdownerror = null;
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.loading = false;
        state.dropdowndata = action.payload;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.loading = false;
        state.dropdownerror = action.payload;
      });
  },
});

export default dropdownSlice.reducer;