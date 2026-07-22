import {API_CSRF_TOKEN as SECRETS_CSRF_TOKEN} from './secrets';

export const BASE_URL = 'https://thekkabazar.com';

// Public list endpoints require a CSRF header. Value lives in secrets.js
// (see secrets.example.js). Override at build time with API_CSRF_TOKEN if set.
export const API_CSRF_TOKEN =
  (typeof process !== 'undefined' && process.env.API_CSRF_TOKEN) ||
  SECRETS_CSRF_TOKEN;

export const API_HEADERS = {
  accept: 'application/json',
  'X-CSRFToken': API_CSRF_TOKEN,
};
