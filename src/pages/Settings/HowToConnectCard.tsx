import { Box, Text, OrderedList, ListItem } from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

export const HowToConnectCard = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Box
      mt={4}
      bg={getColor('background.dashboard.tile')}
      borderRadius="16px"
      border="1.5px solid"
      borderColor={getColor('border.dashboard.tile')}
      px={4}
      py={4}
    >
      <Text
        fontSize="sm"
        fontWeight="bold"
        fontFamily={getFont('heading')}
        color={getColor('text.integrations.title')}
        mb={2}
      >
        {t('settings.integrations.alexa.howToConnect')}
      </Text>
      <OrderedList spacing={2} pl={1} stylePosition="inside">
        <ListItem
          fontSize="xs"
          color={getColor('text.integrations.description')}
          fontFamily={getFont('body')}
        >
          {t('settings.integrations.alexa.howToConnectStep1')}
        </ListItem>
        <ListItem
          fontSize="xs"
          color={getColor('text.integrations.description')}
          fontFamily={getFont('body')}
        >
          {t('settings.integrations.alexa.howToConnectStep2')}
        </ListItem>
        <ListItem
          fontSize="xs"
          color={getColor('text.integrations.description')}
          fontFamily={getFont('body')}
        >
          {t('settings.integrations.alexa.howToConnectStep3')}
        </ListItem>
      </OrderedList>
    </Box>
  );
};
