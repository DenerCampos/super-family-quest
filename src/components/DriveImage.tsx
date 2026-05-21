import { Box, Image } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

const RETRY_DELAYS_MS = [2000, 4000, 8000];

interface DriveImageProps {
  src: string | undefined;
  alt?: string;
  fallback?: React.ReactElement;
  fallbackSrc?: string;
  [key: string]: unknown;
}

/**
 * Wrapper sobre <Image> que retenta o carregamento automaticamente quando
 * o Google Drive CDN (lh3.googleusercontent.com) ainda não propagou o arquivo
 * recém-enviado. Usa backoff crescente: 2s → 4s → 8s (3 tentativas).
 */
export const DriveImage = ({
  src,
  alt = '',
  fallback,
  fallbackSrc,
  ...rest
}: DriveImageProps) => {
  const [attempt, setAttempt] = useState(0);
  const [key, setKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reinicia tentativas quando a src muda
  useEffect(() => {
    setAttempt(0);
    setKey((k) => k + 1);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [src]);

  const handleError = () => {
    if (attempt >= RETRY_DELAYS_MS.length) return;
    const delay = RETRY_DELAYS_MS[attempt];
    timerRef.current = setTimeout(() => {
      setAttempt((a) => a + 1);
      setKey((k) => k + 1);
    }, delay);
  };

  if (!src) {
    return fallback ? fallback : <Box {...(rest as object)} />;
  }

  // Cache-bust na URL para forçar nova requisição após cada tentativa
  const bustedSrc = attempt > 0 ? `${src}${src.includes('?') ? '&' : '?'}_r=${attempt}` : src;

  return (
    <Image
      key={key}
      src={bustedSrc}
      alt={alt}
      onError={handleError}
      fallback={fallback}
      fallbackSrc={fallbackSrc}
      {...rest}
    />
  );
};
