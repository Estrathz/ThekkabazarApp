import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
  'users/login',
  async ({username, password}) => {
    try {
      const response = await axios.post(
        'https://thekkabazar.itnepalsolutions.com/accounts/apis/usermanagement/login/',
        {username, password},
      );
      console.log(response.data);
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    access_token: '',
    isAuthenticated: false,
    status: 'idle',
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.access_token = action.payload.access_token;
      })
      .addCase(login.rejected, state => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isAuthenticated = false;
      });
  },
});

export default usersSlice.reducer;
