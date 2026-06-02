import { Flex, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoinFlight } from '../contexts/CoinFlightContext';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { useThemedTranslation } from '../hooks/useThemedTranslation';

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
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

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
      as="button"
      type="button"
      align="center"
      bg={getColor('background.coin')}
      px={3}
      py={1}
      borderRadius="md"
      borderWidth="1px"
      borderColor={getColor('border.coin')}
      cursor="pointer"
      onClick={() => navigate('/dashboard/coinStatement')}
      aria-label={t('reports.coinStatement.openFromHeader')}
      _hover={{ opacity: 0.9 }}
      _active={{ transform: 'scale(0.98)' }}
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
