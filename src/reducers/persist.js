import AsyncStorage from '@react-native-async-storage/async-storage';

// Bump this when the persisted shape changes to invalidate old snapshots.
const PERSIST_VERSION = 'v1';
const PERSIST_KEY = `redux:persist:${PERSIST_VERSION}`;
export const REHYDRATE = 'persist/REHYDRATE';

// Only persist lightweight, cross-screen "display" data so the UI can render
// instantly from the previous session. Transient fields (status/loading/error)
// are intentionally excluded so screens never rehydrate into a stuck spinner.
// Large/param-specific lists (tender/result/newspaper) keep their own dedicated
// AsyncStorage caches elsewhere.
const PERSIST_CONFIG = {
  banner: ['bannerdata'],
  bazar: ['data'],
  dropdown: ['dropdowndata'],
  userprofile: ['data', 'savedBids', 'userInterest'],
  interest: ['interestdata'],
  about: ['data'],
  notice: ['data'],
  price: ['data'],
  privateWork: ['data'],
};

const WRITE_THROTTLE_MS = 1500;

export const loadPersistedState = async () => {
  try {
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const buildSnapshot = state => {
  const snapshot = {};
  Object.entries(PERSIST_CONFIG).forEach(([sliceKey, fields]) => {
    const sliceState = state?.[sliceKey];
    if (!sliceState) {
      return;
    }
    const sliceSnapshot = {};
    fields.forEach(field => {
      if (sliceState[field] !== undefined) {
        sliceSnapshot[field] = sliceState[field];
      }
    });
    if (Object.keys(sliceSnapshot).length > 0) {
      snapshot[sliceKey] = sliceSnapshot;
    }
  });
  return snapshot;
};

let writeTimer = null;

export const createPersistMiddleware = () => store => next => action => {
  const result = next(action);

  if (action?.type === REHYDRATE) {
    return result;
  }

  if (writeTimer) {
    clearTimeout(writeTimer);
  }
  writeTimer = setTimeout(() => {
    try {
      const snapshot = buildSnapshot(store.getState());
      AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(snapshot)).catch(
        () => {},
      );
    } catch {
      // Never let persistence crash the app.
    }
  }, WRITE_THROTTLE_MS);

  return result;
};

// Merge persisted slice data into the freshly-initialized state.
export const mergePersistedState = (state, payload) => {
  if (!payload || typeof payload !== 'object') {
    return state;
  }
  const merged = {...state};
  Object.entries(payload).forEach(([sliceKey, fields]) => {
    if (merged[sliceKey] && fields && typeof fields === 'object') {
      merged[sliceKey] = {...merged[sliceKey], ...fields};
    }
  });
  return merged;
};
