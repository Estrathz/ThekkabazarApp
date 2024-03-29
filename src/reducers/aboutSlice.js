import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = 'https://thekkabazar.itnepalsolutions.com';
import Toast from 'react-native-toast-message';

export const aboutUsform = createAsyncThunk(
  'data/aboutUsform',
  async ({name, email, phone_number, subject, message}) => {
    console.log(name, email, phone_number, subject, message);
    const response = await axios.post(
      `${BASE_URL}/thekkabazar/apis/contactus/`,
      {name, email, phone_number, subject, message},
    );
    const data = response.message;
    return data;
  },
);

export const aboutUsdata = createAsyncThunk('data/aboutUsdata', async () => {
  try {
    const response = await axios.get(`${BASE_URL}/thekkabazar/apis/aboutus/`);
    const data = response.data;
    return data;
  } catch (error) {
    throw error.message || 'Something went wrong!';
  }
});

const aboutUsSlice = createSlice({
  name: 'data',
  initialState: {
    message: '',
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(aboutUsform.pending, state => {
        state.status = 'loading';
      })
      .addCase(aboutUsform.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Message Sent SuccessFully',
          visibilityTime: 3000,
          autoHide: true,
        });
      })
      .addCase(aboutUsform.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(aboutUsdata.pending, state => {
        state.status = 'loading';
      })
      .addCase(aboutUsdata.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(aboutUsdata.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export default aboutUsSlice.reducer;
