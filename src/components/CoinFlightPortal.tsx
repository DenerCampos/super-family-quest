import { createPortal } from 'react-dom';
import type { FlightSession } from '../contexts/CoinFlightContext';
import { FlyingCoinRewardLayer } from './FlyingCoinRewardLayer';

export type CoinFlightPortalProps = {
  session: FlightSession | null;
  coinSrc: string;
  onComplete: (delta: number, skipBalanceUpdate: boolean) => void;
};

/** Portal + camada visual da moeda; mantém `CoinFlightContext` só com orquestração de estado. */
export function CoinFlightPortal({
  session,
  coinSrc,
  onComplete,
}: CoinFlightPortalProps) {
  if (!session || typeof document === 'undefined') return null;

  return createPortal(
    <FlyingCoinRewardLayer
      sessionKey={session.key}
      delta={session.delta}
      startCx={session.startCx}
      startCy={session.startCy}
      endCx={session.endCx}
      endCy={session.endCy}
      coinW={session.coinW}
      coinH={session.coinH}
      coinSrc={coinSrc}
      onComplete={(delta) =>
        onComplete(delta, session.skipBalanceUpdate)
      }
    />,
    document.body,
  );
}
