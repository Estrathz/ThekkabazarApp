import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';
import Toast from 'react-native-toast-message';

export const fetchTenderListData = createAsyncThunk(
  'data/fetchTenderListData',
  async ({
    organization_sector,
    location,
    project_type,
    procurement_type,
    published_date,
    category,
    page,
    search,
  } = {}) => {
    const params = new URLSearchParams();

    console.log('organ', organization_sector);

    if (organization_sector) {
      params.append('organization_sector', organization_sector);
    }

    if (location) {
      params.append('district', location);
    }

    if (project_type) {
      params.append('loproject_typeation', project_type);
    }

    if (procurement_type) {
      params.append('procurement_type', procurement_type);
    }
    if (category) {
      params.append('category', category);
    }
    if (page) {
      params.append('page', page);
    }
    if (search) {
      params.append('search', search);
    }

    if (published_date) {
      params.append('published_date', published_date);
    }
    const response = await axios.get(
      ` ${BASE_URL}/tender/apis/tender/list/?${params.toString()}`,
    );
    const data = response.data;
    return data;
  },
);

export const fetchOneTenderData = createAsyncThunk(
  'data/fetchOneTenderData',
  async ({tenderId}) => {
    const response = await axios.get(
      `   ${BASE_URL}/tender/apis/tenders/${tenderId}/`,
    );

    const data = response.data;
    return data;
  },
);

export const savebid = createAsyncThunk(
  'data/savebid',
  async ({id, access_token}) => {
    console.log('savebid', id, access_token);
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/tender/apis/tender-save-or-unsave/${id}/`,
        null,
        config,
      );
      const data = response.data;
      return data.message;
    } catch (error) {
      console.error('Error while saving bid:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  },
);

const cardSlice = createSlice({
  name: 'card',
  initialState: {
    data: [],
    one: [],
    status: 'idle',
    error: null,
    message: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTenderListData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTenderListData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTenderListData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOneTenderData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOneTenderData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.one = action.payload;
      })
      .addCase(fetchOneTenderData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(savebid.pending, state => {
        state.status = 'loading';
      })
      .addCase(savebid.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload;
        Toast.show({
          type: 'success',
          text1: action.payload,
          visibilityTime: 2000,
        });
      })
      .addCase(savebid.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default cardSlice.reducer;
