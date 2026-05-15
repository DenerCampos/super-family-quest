export const CHORE_PHOTO_ACCEPT_LIST = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const CHORE_PHOTO_ACCEPT_ATTR = CHORE_PHOTO_ACCEPT_LIST.join(',');

export { IMAGE_COMPRESS_MAX_BYTES as CHORE_PHOTO_MAX_BYTES } from './compressImage';
