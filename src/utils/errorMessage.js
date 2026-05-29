// Safely turn any error value (string, Error, Axios error, or the raw JSON
// body returned by the backend) into a display string. Rendering a non-string
// error object directly inside a <Text> throws "Objects are not valid as a
// React child" and crashes the screen, so all error UI should go through this.
export const getErrorMessage = (
  error,
  fallback = 'Something went wrong. Please try again.',
) => {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string') {
    return error.trim() || fallback;
  }

  // Axios-style error or our rejectWithValue payloads.
  const candidate =
    error.message ||
    error.detail ||
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.data?.message ||
    error.data?.detail;

  if (typeof candidate === 'string' && candidate.trim() !== '') {
    return candidate;
  }

  // Some DRF validation errors come back as {field: ["msg"]}. Surface the
  // first readable string instead of stringifying the whole object.
  if (typeof error === 'object') {
    for (const value of Object.values(error)) {
      if (typeof value === 'string' && value.trim() !== '') {
        return value;
      }
      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
    }
  }

  return fallback;
};

export default getErrorMessage;
