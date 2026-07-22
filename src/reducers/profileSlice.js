import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';
import Toast from 'react-native-toast-message';
import {logout} from './userSlice';

export const getProfile = createAsyncThunk(
  'data/getProfile',
  async (_, {getState}) => {
    const state = getState();
    const token = state.users.access_token;

    if (!token) {
      throw new Error('No access token available');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${BASE_URL}/accounts/apis/usermanagement/view/profile/`,
      config,
    );
    return response.data;
  },
);

export const changePassword = createAsyncThunk(
  'data/changePassword',
  async ({old_password, new_password, confirm_password}, {getState, rejectWithValue}) => {
    try {
      const token = getState().users.access_token;

      if (!token) {
        throw new Error('No access token available');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/accounts/apis/usermanagement/changepassword/`,
        {old_password, new_password, confirm_password},
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          'Failed to change password',
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  'data/updateProfile',
  async (
    {
      fullname,
      company_name,
      office_name,
      office_contact_number,
      website_url,
      district,
      municipality,
      phone_number,
      gender,
    },
    {getState},
  ) => {
    const state = getState();
    const token = state.users.access_token;

    if (!token) {
      throw new Error('No access token available');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(
      `${BASE_URL}/accounts/apis/usermanagement/update/profile/`,
      {
        fullname,
        company_name,
        office_name,
        office_contact_number,
        website_url,
        district,
        municipality,
        phone_number,
        gender,
      },
      config,
    );
    return response.data;
  },
);

export const getSavedBids = createAsyncThunk(
  'data/getSavedBids',
  async (_, {getState}) => {
    const state = getState();
    const token = state.users.access_token;

    if (!token) {
      throw new Error('No access token available');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${BASE_URL}/tender/apis/saved-tender/`,
      config,
    );
    return response.data;
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    error: null,
    message: '',
    userInterest: [],
    updateSuccess: false,
    savedBids: null,
    profileLoading: false,
    savedBidsLoading: false,
    updateLoading: false,
    changePasswordLoading: false,
  },
  reducers: {
    clearProfileState: state => {
      state.data = null;
      state.error = null;
      state.message = '';
      state.userInterest = [];
      state.updateSuccess = false;
      state.savedBids = null;
      state.profileLoading = false;
      state.savedBidsLoading = false;
      state.updateLoading = false;
      state.changePasswordLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getProfile.pending, state => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.error.message;
      })
      .addCase(changePassword.pending, state => {
        state.changePasswordLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePasswordLoading = false;
        state.message = action.payload?.message || 'Password changed successfully';
        Toast.show({
          type: 'success',
          text1: 'Password Updated',
          text2: state.message,
          visibilityTime: 2500,
        });
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.error = action.payload;
        Toast.show({
          type: 'error',
          text1: 'Password Change Failed',
          text2: action.payload || 'Please try again',
          visibilityTime: 3000,
        });
      })
      .addCase(updateProfile.pending, state => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.data = {
          ...(state.data || {}),
          ...(action.payload || {}),
        };
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully',
          visibilityTime: 2000,
        });
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message;
        state.updateSuccess = false;
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: action.error.message || 'Could not update profile',
          visibilityTime: 3000,
        });
      })
      .addCase(getSavedBids.pending, state => {
        state.savedBidsLoading = true;
        state.error = null;
      })
      .addCase(getSavedBids.fulfilled, (state, action) => {
        state.savedBidsLoading = false;
        state.savedBids = action.payload;
      })
      .addCase(getSavedBids.rejected, (state, action) => {
        state.savedBidsLoading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, state => {
        state.data = null;
        state.error = null;
        state.message = '';
        state.userInterest = [];
        state.updateSuccess = false;
        state.savedBids = null;
        state.profileLoading = false;
        state.savedBidsLoading = false;
        state.updateLoading = false;
        state.changePasswordLoading = false;
      });
  },
});

export const {clearProfileState} = profileSlice.actions;
export default profileSlice.reducer;
