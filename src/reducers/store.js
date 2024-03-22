import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import cardSlice from './cardSlice';
import dropdownSlice from './dropdownSlice';
import resultSlice from './resultSlice';
import privateWorkSlice from './privateWorkSlice';

const store = configureStore({
  reducer: {
    users: userSlice,
    card: cardSlice,
    dropdown: dropdownSlice,
    result: resultSlice,
    privateWork: privateWorkSlice,
  },
});

export default store;
