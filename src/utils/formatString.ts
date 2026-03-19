export const capitalizeFirstLetter = (str: string): string => {
  return str
    .toLowerCase()
    .replace(
      /^(\**)(\w)/,
      (match: string) => {
        return match.toUpperCase();
      },
    );
};

/**
 * Converte URLs do Google Drive para formato que funcione em <img src>.
 * O endpoint /uc?export=view retorna 403 desde jan/2024 quando usado de outro domínio.
 */
export function toDisplayableImageUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  if (url.includes('drive.google.com/thumbnail')) return url;

  const idMatch = url.match(/(?:drive\.google\.com\/uc\?[^#]*[?&]id=|drive\.google\.com\/file\/d\/)([^/&?#]+)/);
  if (idMatch) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
  }

  return url;
}
