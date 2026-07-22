const DEFAULT_STALE_MS = 3 * 60 * 1000;

export const createRefreshThrottle = (staleMs = DEFAULT_STALE_MS) => {
  const lastRefreshByKey = new Map();

  return {
    shouldRefresh(key, {force = false} = {}) {
      if (force) {
        return true;
      }
      const last = lastRefreshByKey.get(key) || 0;
      return Date.now() - last >= staleMs;
    },
    markRefreshed(key) {
      lastRefreshByKey.set(key, Date.now());
    },
    reset(key) {
      if (key) {
        lastRefreshByKey.delete(key);
      } else {
        lastRefreshByKey.clear();
      }
    },
  };
};

export const buildRefreshKey = (tab, {search = '', hasFilters = false} = {}) => {
  const query = search.trim();
  if (query.length >= 2) {
    return `${tab}:search:${query}`;
  }
  if (hasFilters) {
    return `${tab}:filters`;
  }
  return tab;
};
