import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from './apiUrl';

export const fetchresultData = createAsyncThunk(
  'data/fetchresultData',
  async ({
    organization_sector,
    location,
    project_type,
    procurement_type,
    date,
    category,
    page,
  } = {}) => {
    const params = new URLSearchParams();

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
    const response = await axios.get(
      `${BASE_URL}/tender/apis/tender-awarded-to/?${params.toString()}`,
    );
    const data = response.data;
    return data;
  },
);
export const fetchOneResultData = createAsyncThunk(
  'data/fetchOneResultData',
  async ({tenderId}) => {
    const response = await axios.get(
      `${BASE_URL}/tender/apis/tender-awarded-to/${tenderId}/`,
    );

    const data = response.data;
    return data;
  },
);
const resultSlice = createSlice({
  name: 'result',
  initialState: {
    data: [],
    one: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchresultData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchresultData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchresultData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOneResultData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOneResultData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.one = action.payload;
      })
      .addCase(fetchOneResultData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export default resultSlice.reducer;
