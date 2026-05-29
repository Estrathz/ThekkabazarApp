export const BASE_URL = 'https://thekkabazar.com';

// CSRF token used by the public tender/list endpoints. Centralized here (and
// overridable at build time via the API_CSRF_TOKEN env var) so it can be
// rotated in one place instead of being duplicated across slices.
export const API_CSRF_TOKEN =
  process.env.API_CSRF_TOKEN ||
  'bwQJROlt74LsvQqQuOi10XS8WEyGPgpVSfLN7HfQbsFEAu5NMRk3KkYuNsIenqFO';

// Shared headers for the unauthenticated list/master endpoints.
export const API_HEADERS = {
  accept: 'application/json',
  'X-CSRFToken': API_CSRF_TOKEN,
};
