import { Flex, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
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
  const { getColor, getAsset, getFont } = useVisualTheme();

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
      bg={getColor('background.coin')}
      px={3}
      py={1}
      borderRadius="md"
      position="relative"
      borderWidth="1px"
      borderColor={getColor('border.coin')}
    >
      <Image
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

      {animate && (
        <Text
          color={getColor('status.success')}
          fontWeight="bold"
          fontFamily={getFont('heading')}
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
