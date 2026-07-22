import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {BASE_URL} from './apiUrl';

const clearStoredSession = async () => {
  await AsyncStorage.removeItem('access_token');
  delete axios.defaults.headers.common.Authorization;
};

const applyAuthToken = async token => {
  if (!token) {
    return;
  }
  await AsyncStorage.setItem('access_token', token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const login = createAsyncThunk(
  'users/login',
  async ({username, password}, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/accounts/apis/usermanagement/login/`,
        {username, password},
      );
      const data = response.data;
      const token = data.access_token;
      if (!token) {
        throw new Error('No access token received');
      }
      await applyAuthToken(token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          'Login failed',
      );
    }
  },
);

export const logout = createAsyncThunk(
  'users/logout',
  async (_, {rejectWithValue}) => {
    try {
      await clearStoredSession();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const register = createAsyncThunk(
  'data/register',
  async (
    {
      username,
      fullname,
      password,
      email,
      password2,
      phone_number,
      company_name,
    },
    {rejectWithValue},
  ) => {
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
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          'Registration failed',
      );
    }
  },
);

// Validate stored token against the profile API (not just AsyncStorage presence).
export const checkAuthStatus = createAsyncThunk(
  'users/checkAuthStatus',
  async (_options = {}, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      await axios.get(
        `${BASE_URL}/accounts/apis/usermanagement/view/profile/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {access_token: token};
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        await clearStoredSession();
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          'Session expired',
      );
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
    clearError: state => {
      state.error = null;
    },
    resetAuthState: state => {
      state.isAuthenticated = false;
      state.access_token = '';
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.loading = true;
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
      .addCase(logout.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(logout.fulfilled, state => {
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
      .addCase(checkAuthStatus.pending, (state, action) => {
        if (!action.meta.arg?.silent) {
          state.status = 'loading';
          state.loading = true;
        }
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.isAuthenticated = true;
        state.access_token = action.payload.access_token;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, state => {
        state.status = 'idle';
        state.loading = false;
        state.isAuthenticated = false;
        state.access_token = '';
      })
      .addCase(register.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(register.fulfilled, state => {
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

export const {clearError, resetAuthState} = usersSlice.actions;
export default usersSlice.reducer;
