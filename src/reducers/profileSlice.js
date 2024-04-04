import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';
import Toast from 'react-native-toast-message';

export const getProfile = createAsyncThunk(
  'data/getProfile',
  async ({access_token}) => {
    console.log(access_token, 'sdfvkajsdvfkajsdv');
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    try {
      const response = await axios.get(
        `${BASE_URL}/accounts/apis/usermanagement/view/profile/`,
        {
          Authorization: `Bearer ${access_token}`,
        },
      );
      const data = response.data;
      return data;
    } catch (error) {
      // console.error('Error fetching profile:', error);
      throw error;
    }
  },
);

export const changePassword = createAsyncThunk(
  'data/changePassword',
  async ({access_token, old_password, new_password, confirm_password}) => {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const response = await axios.post(
      `${BASE_URL}/accounts/apis/usermanagement/changepassword/`,
      {old_password, new_password, confirm_password},
      config,
    );
    const data = response.data;
    return data;
  },
);

export const updateProfile = createAsyncThunk(
  'data/updateProfile',
  async ({
    access_token,
    fullname,
    company_name,
    office_name,
    office_contact_number,
    website_url,
    district,
    municipality,
    phone_number,
    gender,
  }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
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
    const data = response.data;
    return data;
  },
);

export const getUserInterest = createAsyncThunk(
  'data/getUserInterest',
  async ({access_token}) => {
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    const response = await axios.get(
      `${BASE_URL}/accounts/apis/usermanagement/intrest/`,
      config,
    );
    return response.data;
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    message: '',
    userInterest: [],
    updateSuccess: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProfile.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(changePassword.pending, state => {
        state.status = 'loading';
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, state => {
        state.status = 'loading';
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.updateSuccess = true;
        Toast.show({
          type: 'success',
          text1: 'Success!!!',
          text2: 'Profile Updated Successful',
          visibilityTime: 2000,
        });
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.updateSuccess = false;
      })
      .addCase(getUserInterest.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserInterest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInterest = action.payload;
      })
      .addCase(getUserInterest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default profileSlice.reducer;
