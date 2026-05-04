import { Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useVisualTheme } from '../hooks/useVisualTheme';

/** Tempo parado na posição inicial antes de voar até o alvo (header). */
export const FLYING_COIN_INITIAL_HOLD_S = 2;
export const FLYING_COIN_DURATION_S = 0.65;

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const START_SCALE = 2.75;

export type FlyingCoinRewardLayerProps = {
  sessionKey: string;
  delta: number;
  startCx: number;
  startCy: number;
  endCx: number;
  endCy: number;
  coinW: number;
  coinH: number;
  coinSrc: string;
  onComplete: (delta: number) => void;
};

export function FlyingCoinRewardLayer({
  sessionKey,
  delta,
  startCx,
  startCy,
  endCx,
  endCy,
  coinW,
  coinH,
  coinSrc,
  onComplete,
}: FlyingCoinRewardLayerProps) {
  const { getColor, getFont } = useVisualTheme();
  const finishedRef = useRef(false);

  const notifyComplete = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete(delta);
  };

  const startLeft = startCx - coinW / 2;
  const startTop = startCy - coinH / 2;
  const endLeft = endCx - coinW / 2;
  const endTop = endCy - coinH / 2;

  const originY = coinH / 2;

  return (
    <motion.div
      key={sessionKey}
      layout={false}
      initial={{
        left: startLeft,
        top: startTop,
        scale: START_SCALE,
      }}
      animate={{
        left: endLeft,
        top: endTop,
        scale: 1,
      }}
      transition={{
        delay: FLYING_COIN_INITIAL_HOLD_S,
        duration: FLYING_COIN_DURATION_S,
        ease: EASE,
      }}
      style={{
        position: 'fixed',
        width: coinW,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'none',
        zIndex: 1350,
        transformOrigin: `${coinW / 2}px ${originY}px`,
      }}
      onAnimationComplete={notifyComplete}
    >
      <img
        src={coinSrc}
        alt=""
        width={coinW}
        height={coinH}
        style={{ display: 'block' }}
      />
      <Text
        fontWeight="extrabold"
        fontFamily={getFont('heading')}
        color={getColor('status.success')}
        fontSize="lg"
        lineHeight="1"
      >
        +{delta}
      </Text>
    </motion.div>
  );
}
