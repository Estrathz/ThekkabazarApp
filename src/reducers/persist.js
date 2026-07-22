import AsyncStorage from '@react-native-async-storage/async-storage';

// Bump when persisted shape changes to invalidate old snapshots.
const PERSIST_VERSION = 'v2';
const PERSIST_KEY = `redux:persist:${PERSIST_VERSION}`;
const PERSIST_KEY_V1 = 'redux:persist:v1';
export const REHYDRATE = 'persist/REHYDRATE';

const LEGACY_HOME_TAB_CACHE_KEYS = {
  All: 'home:tender:all:v2',
  'PPMO/EGP': 'home:tender:ppmo:v2',
  Others: 'home:tender:others:v2',
};
const LEGACY_HOME_TENDER_CACHE_KEY = 'home:tender:list:v1';
const LEGACY_HOME_RESULT_CACHE_KEY = 'home:result:list:v1';

// Simple field copies — transient fields (loading/error/status) are excluded.
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

const serializeCardTabLists = sliceState => {
  const tabLists = {};
  Object.entries(sliceState?.tabLists || {}).forEach(([tab, bucket]) => {
    if (Array.isArray(bucket?.data?.data) && bucket.data.data.length > 0) {
      tabLists[tab] = {
        data: bucket.data,
        listQueryKey: bucket.listQueryKey ?? null,
      };
    }
  });
  return Object.keys(tabLists).length > 0 ? {tabLists} : null;
};

const serializeResultList = sliceState => {
  if (!Array.isArray(sliceState?.data?.data) || sliceState.data.data.length === 0) {
    return null;
  }
  return {
    data: sliceState.data,
    listQueryKey: sliceState.listQueryKey ?? null,
  };
};

const deserializeCardTabLists = (sliceState, persisted) => {
  if (!persisted?.tabLists) {
    return sliceState;
  }

  const tabLists = {...sliceState.tabLists};
  Object.entries(persisted.tabLists).forEach(([tab, saved]) => {
    tabLists[tab] = {
      data: saved.data,
      loading: false,
      error: null,
      listQueryKey: saved.listQueryKey ?? null,
    };
  });

  const allData = tabLists.All?.data ?? sliceState.data;

  return {
    ...sliceState,
    tabLists,
    data: allData,
    status: allData ? 'succeeded' : sliceState.status,
    loading: false,
    error: null,
  };
};

const deserializeResultList = (sliceState, persisted) => {
  if (!persisted?.data) {
    return sliceState;
  }

  return {
    ...sliceState,
    data: persisted.data,
    listQueryKey: persisted.listQueryKey ?? null,
    loading: false,
    error: null,
  };
};

const SLICE_SERIALIZERS = {
  card: serializeCardTabLists,
  result: serializeResultList,
};

const SLICE_DESERIALIZERS = {
  card: deserializeCardTabLists,
  result: deserializeResultList,
};

const WRITE_THROTTLE_MS = 1500;

const readJson = async key => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const loadLegacyHomeCaches = async () => {
  const [allCache, ppmoCache, othersCache, resultCache] = await Promise.all([
    readJson(LEGACY_HOME_TAB_CACHE_KEYS.All).then(
      cached => cached || readJson(LEGACY_HOME_TENDER_CACHE_KEY),
    ),
    readJson(LEGACY_HOME_TAB_CACHE_KEYS['PPMO/EGP']),
    readJson(LEGACY_HOME_TAB_CACHE_KEYS.Others),
    readJson(LEGACY_HOME_RESULT_CACHE_KEY),
  ]);

  const tabLists = {};
  if (allCache?.data?.length) {
    tabLists.All = {data: allCache, listQueryKey: null};
  }
  if (ppmoCache?.data?.length) {
    tabLists['PPMO/EGP'] = {data: ppmoCache, listQueryKey: null};
  }
  if (othersCache?.data?.length) {
    tabLists.Others = {data: othersCache, listQueryKey: null};
  }

  const snapshot = {};
  if (Object.keys(tabLists).length > 0) {
    snapshot.card = {tabLists};
  }
  if (resultCache?.data?.length) {
    snapshot.result = {data: resultCache, listQueryKey: null};
  }

  return Object.keys(snapshot).length > 0 ? snapshot : null;
};

export const loadPersistedState = async () => {
  try {
    let raw = await AsyncStorage.getItem(PERSIST_KEY);
    if (!raw) {
      raw = await AsyncStorage.getItem(PERSIST_KEY_V1);
    }

    let parsed = null;

    if (raw) {
      parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        parsed = null;
      }
    }

    if (!parsed?.card?.tabLists && !parsed?.result?.data) {
      const legacy = await loadLegacyHomeCaches();
      if (legacy) {
        parsed = {...(parsed || {}), ...legacy};
      }
    }

    return parsed;
  } catch {
    return loadLegacyHomeCaches();
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

  Object.entries(SLICE_SERIALIZERS).forEach(([sliceKey, serialize]) => {
    const sliceSnapshot = serialize(state?.[sliceKey]);
    if (sliceSnapshot) {
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

export const mergePersistedState = (state, payload) => {
  if (!payload || typeof payload !== 'object') {
    return state;
  }

  const merged = {...state};

  Object.entries(PERSIST_CONFIG).forEach(([sliceKey, fields]) => {
    if (!merged[sliceKey] || !payload[sliceKey]) {
      return;
    }
    const fieldsToMerge = {};
    fields.forEach(field => {
      if (payload[sliceKey][field] !== undefined) {
        fieldsToMerge[field] = payload[sliceKey][field];
      }
    });
    merged[sliceKey] = {...merged[sliceKey], ...fieldsToMerge};
  });

  Object.entries(SLICE_DESERIALIZERS).forEach(([sliceKey, deserialize]) => {
    if (payload[sliceKey] && merged[sliceKey]) {
      merged[sliceKey] = deserialize(merged[sliceKey], payload[sliceKey]);
    }
  });

  return merged;
};
