import imageCompression from 'browser-image-compression';
import type { Options } from 'browser-image-compression';

/** Meta de tamanho para compressão; o mesmo valor é reexportado em `chore-occurrence-photo-constants` como `CHORE_PHOTO_MAX_BYTES`. */
export const IMAGE_COMPRESS_MAX_SIZE_MB = 1;
export const IMAGE_COMPRESS_MAX_BYTES = IMAGE_COMPRESS_MAX_SIZE_MB * 1024 * 1024;

const MAX_WIDTH_OR_HEIGHT = 1920;

/**
 * Reduz dimensão e peso da imagem (`maxSizeMB` ≈ {@link IMAGE_COMPRESS_MAX_SIZE_MB}).
 * Quem precisa de teto rígido deve validar `file.size` após retornar (ex.: chores, perfil).
 * GIF e outros formatos: `fileType` omitido para a biblioteca decidir o fluxo.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const options: Options = {
    maxSizeMB: IMAGE_COMPRESS_MAX_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
  };

  if (
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.type === 'image/png' ||
    file.type === 'image/webp'
  ) {
    options.fileType =
      file.type === 'image/jpg' ? 'image/jpeg' : file.type;
  }

  const compressed = await imageCompression(file, options);
  return new File([compressed], file.name, { type: compressed.type });
}
