import { useEffect, useRef, useState } from 'react';

/** Alinhado à cadeia de visão na API (~2 tentativas por modelo + latência). */
export const AI_VISION_LOADING_STEP_MS = 4000;

/**
 * Avança o texto do loading a cada intervalo enquanto `active`.
 * Para no último item (não volta ao primeiro).
 */
export function useCyclingLoadingText(
  active: boolean,
  texts: string[],
  intervalMs = AI_VISION_LOADING_STEP_MS,
): string {
  const [index, setIndex] = useState(0);
  const textsRef = useRef(texts);
  textsRef.current = texts;

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }

    setIndex(0);
    if (textsRef.current.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) =>
        Math.min(current + 1, textsRef.current.length - 1),
      );
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [active, intervalMs]);

  if (texts.length === 0) return '';
  return texts[Math.min(index, texts.length - 1)];
}
