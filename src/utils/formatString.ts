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
 * Prioridade:
 *   1. lh3.googleusercontent.com/d/ID  — formato atual (uploads novos)
 *   2. drive.google.com/thumbnail?id=ID — fallback para uploads antigos via uc?export=view
 *   3. URL original — outros domínios passam direto
 */
export function toDisplayableImageUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  // Já está no formato lh3 ou thumbnail — usar diretamente
  if (
    url.includes('lh3.googleusercontent.com/d/') ||
    url.includes('drive.google.com/thumbnail')
  ) {
    return url;
  }

  // Extrair ID de formatos antigos: uc?export=view&id=ID ou file/d/ID
  const idMatch = url.match(
    /(?:drive\.google\.com\/uc\?[^#]*[?&]id=|drive\.google\.com\/file\/d\/)([^/&?#]+)/,
  );
  if (idMatch) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return url;
}
