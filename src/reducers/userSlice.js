import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const login = createAsyncThunk(
  'users/login',
  async ({username, password}) => {
    try {
      const response = await axios.post(
        'https://thekkabazar.itnepalsolutions.com/accounts/apis/usermanagement/login/',
        {username, password},
      );
      const data = response.data;
      const token = data.access_token;
      if (token) {
        await AsyncStorage.setItem('access_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else throw new Error();
      return data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
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
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.access_token = action.payload.access_token;
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: '',
          visibilityTime: 2000,
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Username and Password incorrect',
          visibilityTime: 3000,
        });
      });
  },
});

export default usersSlice.reducer;
