import moment from 'moment';

export const NEWSPAPER_DAYS_WINDOW = 5;
export const GALLERY_DAYS_WINDOW = NEWSPAPER_DAYS_WINDOW;
export const NEWSPAPER_CACHE_KEY = 'home:newspaper:5days:v1';

export const getNewspaperStartDate = (days = NEWSPAPER_DAYS_WINDOW) =>
  moment().subtract(days, 'days').startOf('day');

export const parsePublishedDate = value => {
  if (!value) {
    return null;
  }

  const iso = moment(value, moment.ISO_8601, true);
  if (iso.isValid()) {
    return iso;
  }

  const commonFormats = moment(
    value,
    ['YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY'],
    true,
  );
  if (commonFormats.isValid()) {
    return commonFormats;
  }

  const loose = moment(value);
  return loose.isValid() ? loose : null;
};

export const isNewspaperTender = (item, days = NEWSPAPER_DAYS_WINDOW) => {
  if (!item || item?.source === 'PPMO/EGP' || !item?.published_date) {
    return false;
  }

  const publishedMoment = parsePublishedDate(item.published_date);
  if (!publishedMoment) {
    return false;
  }

  const startDate = getNewspaperStartDate(days);
  const endDate = moment().endOf('day');
  return (
    publishedMoment.isSameOrAfter(startDate) &&
    publishedMoment.isSameOrBefore(endDate)
  );
};

export const filterNewspaperTenders = (items, days = NEWSPAPER_DAYS_WINDOW) =>
  (items || []).filter(item => isNewspaperTender(item, days));

export const dedupeTendersByPk = items => {
  const uniqueByPk = new Map();
  (items || []).forEach(item => {
    const key =
      item?.pk ?? item?.id ?? `${item?.title}-${item?.published_date}`;
    uniqueByPk.set(key, item);
  });
  return Array.from(uniqueByPk.values());
};

export const tenderHasGalleryImage = tender =>
  Boolean(
    tender?.image && tender.image.trim() !== '' && tender.image !== 'null',
  );
