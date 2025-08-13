import { Flex, Image, Text, keyframes } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
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
  const [prevCoins, setPrevCoins] = useState(coins);
  const [animate, setAnimate] = useState(false);
  const { getColor, getAsset } = useVisualTheme();

  useEffect(() => {
    if (coins !== prevCoins) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 3000);
      setPrevCoins((value) => {      
        return coins - value;
      });
      return () => clearTimeout(timer);
    }
  }, [coins]);

  const gifSrc = getAsset('images.goldCoin');

  return (
    <Flex
      align="center"
      bg={getColor('primary.700')}
      px={3}
      py={1}
      borderRadius="md"
      position="relative"
    >
      <Image
        src={gifSrc}
        boxSize="25px"
        mr={2}
        animation={animate ? `${pulse} 0.5s ease-in-out` : 'none'}
      />
      <Text color={getColor('text.gold')} fontWeight="bold">
        {coins}
      </Text>

      {animate && (
        <Text
          color={getColor('text.emerald')}
          fontWeight="bold"
          position="absolute"
          right="-20px"
          top="-10px"
          animation={`${pulse} 0.5s`}
        >
          +{prevCoins}
        </Text>
      )}
    </Flex>
  );
};
