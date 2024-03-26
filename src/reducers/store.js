import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import cardSlice from './cardSlice';
import dropdownSlice from './dropdownSlice';
import resultSlice from './resultSlice';
import privateWorkSlice from './privateWorkSlice';
import priceSlice from './priceSlice';
import noticeSlice from './noticeSlice';
import profileSlice from './profileSlice';

const store = configureStore({
  reducer: {
    users: userSlice,
    card: cardSlice,
    dropdown: dropdownSlice,
    result: resultSlice,
    privateWork: privateWorkSlice,
    price: priceSlice,
    notice: noticeSlice,
    userprofile: profileSlice,
  },
});

export default store;
