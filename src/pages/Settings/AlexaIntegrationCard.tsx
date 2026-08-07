import { Box, Flex, Text, Badge, Button, Divider, Spinner } from '@chakra-ui/react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface AlexaIntegrationCardProps {
  connected: boolean;
  loading: boolean;
  loadingDisconnect: boolean;
  onDisconnect: () => void;
  disconnectDisabled?: boolean;
}

export const AlexaIntegrationCard = ({
  connected,
  loading,
  loadingDisconnect,
  onDisconnect,
  disconnectDisabled = false,
}: AlexaIntegrationCardProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Box
      bg={getColor('background.dashboard.tile')}
      borderRadius="16px"
      border="1.5px solid"
      borderColor={getColor('border.dashboard.tile')}
      overflow="hidden"
    >
      <Box px={4} pt={4} pb={2}>
        <Text
          fontSize="sm"
          fontWeight="bold"
          fontFamily={getFont('heading')}
          color={getColor('text.integrations.title')}
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {t('settings.integrations.title')}
        </Text>
        <Text fontSize="xs" color={getColor('text.integrations.description')} mt={0.5}>
          {t('settings.integrations.description')}
        </Text>
      </Box>

      <Divider borderColor={getColor('border.dashboard.tile')} />

      <Box px={4} pt={4} pb={connected ? 4 : 2}>
        {loading ? (
          <Flex align="center" justify="center" py={4}>
            <Spinner size="sm" color={getColor('text.dashboard.tileIcon')} mr={3} />
            <Text fontSize="sm" color={getColor('text.integrations.description')}>
              {t('settings.integrations.alexa.loadingStatus')}
            </Text>
          </Flex>
        ) : (
          <Flex align="center" justify="space-between" gap={3} flexWrap="wrap">
            <Flex align="center" gap={3} flex={1} minW="0">
              <Flex
                align="center"
                justify="center"
                w="44px"
                h="44px"
                borderRadius="12px"
                bg={
                  connected
                    ? getColor('background.integrations.statusConnected')
                    : getColor('background.integrations.statusDisconnected')
                }
                flexShrink={0}
              >
                {connected ? (
                  <FiWifi
                    size={22}
                    style={{ color: getColor('text.integrations.statusConnected') }}
                  />
                ) : (
                  <FiWifiOff
                    size={22}
                    style={{ color: getColor('text.integrations.statusDisconnected') }}
                  />
                )}
              </Flex>

              <Box minW="0">
                <Flex align="center" gap={2} flexWrap="wrap">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    fontFamily={getFont('body')}
                    color={getColor('text.dashboard.tileTitle')}
                  >
                    {t('settings.integrations.alexa.name')}
                  </Text>
                  <Badge
                    fontSize="2xs"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    bg={
                      connected
                        ? getColor('background.integrations.statusConnected')
                        : getColor('background.integrations.statusDisconnected')
                    }
                    color={
                      connected
                        ? getColor('text.integrations.statusConnected')
                        : getColor('text.integrations.statusDisconnected')
                    }
                    border="1px solid"
                    borderColor={
                      connected
                        ? getColor('border.integrations.statusConnected')
                        : getColor('border.integrations.statusDisconnected')
                    }
                  >
                    {connected
                      ? t('settings.integrations.alexa.statusConnected')
                      : t('settings.integrations.alexa.statusDisconnected')}
                  </Badge>
                </Flex>
                <Text
                  fontSize="xs"
                  color={getColor('text.integrations.description')}
                  mt={0.5}
                  noOfLines={2}
                >
                  {t('settings.integrations.alexa.description')}
                </Text>
              </Box>
            </Flex>

            {connected && (
              <Button
                size="sm"
                variant="outline"
                borderColor={getColor('border.integrations.statusDisconnected')}
                color={getColor('text.integrations.statusDisconnected')}
                fontFamily={getFont('body')}
                isLoading={loadingDisconnect}
                loadingText={t('settings.integrations.alexa.loadingDisconnect')}
                onClick={onDisconnect}
                isDisabled={disconnectDisabled}
                flexShrink={0}
                _hover={{
                  bg: getColor('background.integrations.statusDisconnected'),
                }}
              >
                {t('settings.integrations.alexa.disconnect')}
              </Button>
            )}
          </Flex>
        )}
      </Box>
    </Box>
  );
};
