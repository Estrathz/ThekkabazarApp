import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import cardSlice from './cardSlice';

const store = configureStore({
  reducer: {
    users: userSlice,
    card: cardSlice,
  },
});

export default store;
