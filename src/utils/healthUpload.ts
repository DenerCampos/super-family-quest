import {
  HEALTH_ALLOWED_UPLOAD_EXTENSIONS,
  HEALTH_ALLOWED_UPLOAD_MIME,
  HEALTH_MAX_UPLOAD_BYTES,
} from './healthConstants';

export type HealthUploadValidationResult =
  | { ok: true; files: File[] }
  | { ok: false; reason: 'empty' | 'type' | 'size'; fileName?: string };

function hasAllowedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return HEALTH_ALLOWED_UPLOAD_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isAllowedFileType(file: File): boolean {
  if (file.type && (HEALTH_ALLOWED_UPLOAD_MIME as readonly string[]).includes(file.type)) {
    return true;
  }
  return hasAllowedExtension(file.name);
}

export function validateHealthUploadFiles(files: File[]): HealthUploadValidationResult {
  if (files.length === 0) {
    return { ok: false, reason: 'empty' };
  }

  for (const file of files) {
    if (!isAllowedFileType(file)) {
      return { ok: false, reason: 'type', fileName: file.name };
    }
    if (file.size > HEALTH_MAX_UPLOAD_BYTES) {
      return { ok: false, reason: 'size', fileName: file.name };
    }
  }

  return { ok: true, files };
}

export function formatHealthMaxUploadMb(): number {
  return HEALTH_MAX_UPLOAD_BYTES / (1024 * 1024);
}
