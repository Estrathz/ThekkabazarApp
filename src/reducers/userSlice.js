import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {BASE_URL} from './apiUrl';

export const login = createAsyncThunk(
  'users/login',
  async ({username, password}, {rejectWithValue}) => {
    try {
      console.log('Attempting login with:', username);
      const response = await axios.post(
        `${BASE_URL}/accounts/apis/usermanagement/login/`,
        {username, password},
      );
      const data = response.data;
      const token = data.access_token;
      if (token) {
        await AsyncStorage.setItem('access_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Login successful, token stored');
      } else {
        throw new Error('No access token received');
      }
      return data;
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.message || 
        'Login failed'
      );
    }
  },
);

export const logout = createAsyncThunk(
  'users/logout',
  async (_, {rejectWithValue}) => {
    try {
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem('access_token');
      
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
      
      console.log('Logout successful, token cleared');
      return true;
    } catch (error) {
      console.log('Logout error:', error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const register = createAsyncThunk(
  'data/register',
  async ({
    username,
    fullname,
    password,
    email,
    password2,
    phone_number,
    company_name,
  }, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/accounts/apis/usermanagement/create/user/`,
        {
          username,
          fullname,
          password,
          email,
          password2,
          phone_number,
          company_name,
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log('Registration error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.message || 
        'Registration failed'
      );
    }
  },
);

// Check if user is already logged in
export const checkAuthStatus = createAsyncThunk(
  'users/checkAuthStatus',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { access_token: token };
      }
      return rejectWithValue('No token found');
    } catch (error) {
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
    loading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.access_token = '';
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      // Login cases
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.isAuthenticated = true;
        state.access_token = action.payload.access_token;
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
          visibilityTime: 2000,
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: action.payload || 'Please check your credentials',
          visibilityTime: 3000,
        });
      })
      // Logout cases
      .addCase(logout.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.loading = false;
        state.isAuthenticated = false;
        state.access_token = '';
        state.error = null;
        Toast.show({
          type: 'success',
          text1: 'Logout Successful',
          text2: 'You have been logged out',
          visibilityTime: 2000,
        });
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: 'error',
          text1: 'Logout Failed',
          text2: action.payload || 'Please try again',
          visibilityTime: 3000,
        });
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.isAuthenticated = true;
        state.access_token = action.payload.access_token;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.status = 'idle';
        state.loading = false;
        state.isAuthenticated = false;
        state.access_token = '';
      })
      // Register cases
      .addCase(register.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Please login with your credentials',
          visibilityTime: 3000,
        });
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: action.payload || 'Please try again',
          visibilityTime: 3000,
        });
      });
  },
});

export const { clearError, resetAuthState } = usersSlice.actions;
export default usersSlice.reducer;
