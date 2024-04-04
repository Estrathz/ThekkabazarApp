import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';

export const fetchDropdownData = createAsyncThunk(
  'data/fetchDropdownData',
  async () => {
    const response = await axios.get(`${BASE_URL}/tender/apis/master/list/`);
    const data = response.data;
    return data.data;
  },
);

const dropDownSlice = createSlice({
  name: 'data',
  initialState: {
    dropdowndata: [],
    status: 'idle',
    dropdownerror: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDropdownData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dropdowndata = action.payload;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dropDownSlice.reducer;
