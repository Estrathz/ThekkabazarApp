import {configureStore, combineReducers} from '@reduxjs/toolkit';
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
import bannerSlice from './bannerSlice';
import {
  REHYDRATE,
  createPersistMiddleware,
  loadPersistedState,
  mergePersistedState,
} from './persist';

const appReducer = combineReducers({
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
  banner: bannerSlice,
});

const rootReducer = (state, action) => {
  if (action.type === REHYDRATE) {
    return mergePersistedState(appReducer(state, action), action.payload);
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(createPersistMiddleware()),
});

// Loads last-session display data (including Home tabLists) and merges it into
// the store so screens can render instantly while fresh data is fetched.
export const hydrateStore = async () => {
  const persisted = await loadPersistedState();
  if (persisted) {
    store.dispatch({type: REHYDRATE, payload: persisted});
  }
};

export default store;
