import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { useVisualTheme } from '../../hooks/useVisualTheme';

const MotionBox = motion(Box);

interface ReportTileProps {
  icon: IconType;
  title: string;
  subtitle: string;
  isActive: boolean;
  onClick: () => void;
}

export const ReportTile = ({
  icon: Icon,
  title,
  subtitle,
  isActive,
  onClick,
}: ReportTileProps) => {
  const { getColor, getFont } = useVisualTheme();

  return (
    <MotionBox
      as="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      bg={isActive ? getColor('background.dashboard.tileActive') : getColor('background.dashboard.tile')}
      border="1.5px solid"
      borderColor={isActive ? getColor('border.dashboard.tileActive') : getColor('border.dashboard.tile')}
      borderRadius="16px"
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap={2}
      cursor="pointer"
      boxShadow={isActive ? 'md' : 'sm'}
      backdropFilter="blur(8px)"
      _hover={{
        boxShadow: 'md',
        borderColor: getColor('border.dashboard.tileActive'),
      }}
      width="100%"
      minH="90px"
    >
      <Flex
        align="center"
        justify="center"
        w="36px"
        h="36px"
        borderRadius="10px"
        bg={isActive ? getColor('border.dashboard.tileActive') : getColor('border.dashboard.tile')}
      >
        <Icon
          size={20}
          style={{
            color: isActive ? getColor('text.primary') : getColor('text.dashboard.tileIcon'),
          }}
        />
      </Flex>
      <Box>
        <Text
          fontSize="sm"
          fontWeight="bold"
          fontFamily={getFont('body')}
          color={getColor('text.dashboard.tileTitle')}
          textAlign="left"
          lineHeight="short"
        >
          {title}
        </Text>
        <Text
          fontSize="xs"
          fontFamily={getFont('body')}
          color={getColor('text.dashboard.tileSubtitle')}
          textAlign="left"
          lineHeight="short"
          mt={0.5}
        >
          {subtitle}
        </Text>
      </Box>
    </MotionBox>
  );
};
