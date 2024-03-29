import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import cardSlice from './cardSlice';
import dropdownSlice from './dropdownSlice';
import resultSlice from './resultSlice';
import privateWorkSlice from './privateWorkSlice';
import priceSlice from './priceSlice';
import noticeSlice from './noticeSlice';
import profileSlice from './profileSlice';
import bazarSlice from './bazarSlice';
import interestSlice from './interestSlice';
import aboutSlice from './aboutSlice';

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
    bazar: bazarSlice,
    interest: interestSlice,
    about: aboutSlice,
  },
});

export default store;
