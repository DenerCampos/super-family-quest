import { Flex, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useCoinFlight } from '../contexts/CoinFlightContext';
import { useVisualTheme } from '../hooks/useVisualTheme';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

type CoinDisplayProps = {
  coins: number;
};

export const CoinDisplay = ({ coins }: CoinDisplayProps) => {
  const [animate, setAnimate] = useState(false);
  const { registerCoinTarget } = useCoinFlight();
  const coinImgRef = useRef<HTMLImageElement | null>(null);
  const lastCoinsRef = useRef(coins);
  const { getColor, getAsset, getFont } = useVisualTheme();

  useLayoutEffect(() => {
    registerCoinTarget(coinImgRef.current);
    return () => registerCoinTarget(null);
  }, [registerCoinTarget]);

  useEffect(() => {
    if (coins === lastCoinsRef.current) return;
    lastCoinsRef.current = coins;
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 3000);
    return () => clearTimeout(timer);
  }, [coins]);

  const gifSrc = getAsset('images.goldCoin');

  return (
    <Flex
      align="center"
      bg={getColor('background.coin')}
      px={3}
      py={1}
      borderRadius="md"
      borderWidth="1px"
      borderColor={getColor('border.coin')}
    >
      <Image
        ref={coinImgRef}
        src={gifSrc}
        boxSize="25px"
        mr={2}
        animation={animate ? `${pulse} 0.5s ease-in-out` : 'none'}
      />
      <Text 
        color={getColor('text.coin')} 
        fontWeight="bold"
        fontFamily={getFont('heading')}
      >
        {coins}
      </Text>
    </Flex>
  );
};
