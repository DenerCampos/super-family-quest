export const CHORE_PHOTO_ACCEPT_LIST = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const CHORE_PHOTO_ACCEPT_ATTR = CHORE_PHOTO_ACCEPT_LIST.join(',');

export const CHORE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
