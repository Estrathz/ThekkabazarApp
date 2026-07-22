// Centralized tender image resolution so every list/detail screen behaves the
// same. PPMO/EGP tenders have no scanned image, so they use a dedicated default
// image; all other sources keep the original generic placeholder.
const GENERIC_DEFAULT_IMAGE = require('../assets/dummy-image.png');
const PPMO_DEFAULT_IMAGE = require('../assets/default.jpg');

export const getTenderDefaultImage = item =>
  item?.source === 'PPMO/EGP' ? PPMO_DEFAULT_IMAGE : GENERIC_DEFAULT_IMAGE;

const hasValidImage = item =>
  typeof item?.image === 'string' &&
  item.image.trim() !== '' &&
  item.image !== 'null';

// Returns the real tender image when available, otherwise a source-based
// default. Use this for lists that display the actual tender image.
export const getTenderImageSource = item =>
  hasValidImage(item) ? {uri: item.image} : getTenderDefaultImage(item);

export const resolveFastImageSource = (item, FastImage) => {
  const source = getTenderImageSource(item);
  if (typeof source === 'number') {
    return source;
  }
  return {
    uri: source.uri,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  };
};

export const resolveUriFastImageSource = (uri, FastImage) => ({
  uri,
  priority: FastImage.priority.normal,
  cache: FastImage.cacheControl.immutable,
});
