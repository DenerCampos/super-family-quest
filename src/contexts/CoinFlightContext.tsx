import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CoinFlightPortal } from '../components/CoinFlightPortal';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { normalizeCoinDelta } from '../utils/coinsNumber';
import { useAuth } from './AuthContext';

export type PlayCoinRewardOpts = {
  delta: number;
  /** Centro da viewport é o default; passe para originar num botão/card. */
  from?: { x: number; y: number };
};

export type FlightSession = {
  key: string;
  delta: number;
  startCx: number;
  startCy: number;
  endCx: number;
  endCy: number;
  coinW: number;
  coinH: number;
};

type CoinFlightContextValue = {
  registerCoinTarget: (el: HTMLElement | null) => void;
  getCoinTargetRect: () => DOMRect | null;
  /**
   * Dispara moeda até o GIF do header. O delta em `profile.coins` só é aplicado quando a animação termina —
   * reconcile com `loadProfile` quando necessário para bater com o servidor.
   */
  playReward: (opts: PlayCoinRewardOpts) => void;
};

const CoinFlightContext = createContext<CoinFlightContextValue | null>(null);

function prefersReducedMotion(): boolean {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function newSessionKey() {
  return `coin-flight-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function computeSession(opts: PlayCoinRewardOpts, rect: DOMRect): FlightSession {
  const vw =
    typeof globalThis.window !== 'undefined'
      ? globalThis.window.innerWidth
      : 480;
  const vh =
    typeof globalThis.window !== 'undefined'
      ? globalThis.window.innerHeight
      : 800;

  const startCx = opts.from?.x ?? vw / 2;
  const startCy = opts.from?.y ?? vh / 2;

  return {
    key: newSessionKey(),
    delta: opts.delta,
    startCx,
    startCy,
    endCx: rect.left + rect.width / 2,
    endCy: rect.top + rect.height / 2,
    coinW: rect.width,
    coinH: rect.height,
  };
}

export function CoinFlightProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const targetRef = useRef<HTMLElement | null>(null);
  const queueRef = useRef<PlayCoinRewardOpts[]>([]);
  const playingRef = useRef(false);
  const { applyCoinsDelta } = useAuth();
  const { getAsset } = useVisualTheme();

  const [session, setSession] = useState<FlightSession | null>(null);

  const registerCoinTarget = useCallback((el: HTMLElement | null) => {
    targetRef.current = el;
  }, []);

  const getCoinTargetRect = useCallback((): DOMRect | null => {
    return targetRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const applyWithoutAnimation = useCallback(
    (delta: number) => {
      const n = normalizeCoinDelta(delta);
      if (n == null || n === 0) return;
      applyCoinsDelta(n);
    },
    [applyCoinsDelta],
  );

  const tryStartNext = useCallback(() => {
    const next = queueRef.current.shift();
    const delta = next ? normalizeCoinDelta(next.delta) : null;
    if (!next || delta == null || delta <= 0) {
      playingRef.current = false;
      return;
    }

    const normalized = { ...next, delta };

    if (prefersReducedMotion()) {
      applyWithoutAnimation(delta);
      tryStartNext();
      return;
    }

    const rect = targetRef.current?.getBoundingClientRect() ?? null;
    if (!rect || rect.width < 2 || rect.height < 2) {
      if (import.meta.env.DEV) {
        console.warn(
          '[CoinFlight] Sem alvo no DOM; aplicando delta sem animação.',
        );
      }
      applyWithoutAnimation(delta);
      tryStartNext();
      return;
    }

    playingRef.current = true;
    setSession(computeSession(normalized, rect));
  }, [applyWithoutAnimation]);

  const playReward = useCallback(
    (opts: PlayCoinRewardOpts) => {
      const delta = normalizeCoinDelta(opts.delta);
      if (delta == null || delta <= 0) return;

      const normalized: PlayCoinRewardOpts = {
        ...opts,
        delta,
      };

      if (playingRef.current) {
        queueRef.current.push(normalized);
        return;
      }

      if (prefersReducedMotion()) {
        applyWithoutAnimation(delta);
        return;
      }

      const rect = targetRef.current?.getBoundingClientRect() ?? null;
      if (!rect || rect.width < 2 || rect.height < 2) {
        if (import.meta.env.DEV) {
          console.warn(
            '[CoinFlight] Sem alvo no DOM; aplicando delta sem animação.',
          );
        }
        applyWithoutAnimation(delta);
        return;
      }

      playingRef.current = true;
      setSession(computeSession(normalized, rect));
    },
    [applyWithoutAnimation],
  );

  const handleLayerComplete = useCallback((delta: number) => {
    setSession(null);
    playingRef.current = false;
    queueMicrotask(() => {
      const n = normalizeCoinDelta(delta);
      if (n != null && n !== 0) applyCoinsDelta(n);
      tryStartNext();
    });
  }, [applyCoinsDelta, tryStartNext]);

  const value = useMemo(
    (): CoinFlightContextValue => ({
      registerCoinTarget,
      getCoinTargetRect,
      playReward,
    }),
    [registerCoinTarget, getCoinTargetRect, playReward],
  );

  const coinSrc = getAsset('images.goldCoin');

  return (
    <CoinFlightContext.Provider value={value}>
      {children}
      <CoinFlightPortal
        session={session}
        coinSrc={coinSrc}
        onComplete={handleLayerComplete}
      />
    </CoinFlightContext.Provider>
  );
}

export function useCoinFlight(): CoinFlightContextValue {
  const ctx = useContext(CoinFlightContext);
  if (!ctx) {
    throw new Error('useCoinFlight must be used within a CoinFlightProvider');
  }
  return ctx;
}
