import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { formatDateToBR } from '../../utils/formatDate';
import type { WarrantyItem } from '../../types/warrantyItems';

type TFunction = ReturnType<typeof useThemedTranslation>['t'];

function formatWarrantyDuration(
  duration: number,
  unit: WarrantyItem['warrantyUnit'],
  t: TFunction,
): string {
  const key =
    unit === 'days'
      ? 'reports.warrantyItems.durationDays'
      : unit === 'months'
        ? 'reports.warrantyItems.durationMonths'
        : 'reports.warrantyItems.durationYears';

  return t(key, { count: duration });
}

function getDaysRemainingLabel(item: WarrantyItem, t: TFunction): string {
  if (item.daysRemaining > 1) {
    return t('reports.warrantyItems.daysRemaining', { count: item.daysRemaining });
  }
  if (item.daysRemaining === 1) {
    return t('reports.warrantyItems.oneDayRemaining');
  }
  if (item.daysRemaining === 0) {
    return t('reports.warrantyItems.expiresToday');
  }
  return t('reports.warrantyItems.expiredDaysAgo', {
    count: Math.abs(item.daysRemaining),
  });
}

function getUrgencyColor(
  item: WarrantyItem,
  getColor: ReturnType<typeof useVisualTheme>['getColor'],
): string {
  if (item.isExpired || item.daysRemaining <= 7) {
    return getColor('status.error');
  }
  if (item.daysRemaining <= 30) {
    return getColor('status.warning');
  }
  return getColor('status.success');
}

type Props = {
  item: WarrantyItem;
  showMemberName: boolean;
  isFirst: boolean;
  onOpen: (type: 'expense', id: string) => void;
};

export function WarrantyItemRow({ item, showMemberName, isFirst, onOpen }: Props) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Box>
      {!isFirst && <Divider borderColor={getColor('border.dashboard.tile')} />}
      <Box
        as="button"
        type="button"
        w="full"
        textAlign="left"
        p={4}
        _hover={{ bg: getColor('button.hover.background') }}
        onClick={() => onOpen('expense', item.expenseId)}
      >
        <Flex justify="space-between" align="flex-start" gap={3}>
          <Box flex={1} minW={0}>
            <Text
              fontWeight="bold"
              fontSize="sm"
              color={getColor('text.dashboard.tileTitle')}
              fontFamily={getFont('body')}
              noOfLines={2}
            >
              {item.name}
            </Text>
            {showMemberName && (
              <Text
                fontSize="xs"
                color={getColor('text.dashboard.tileSubtitle')}
                mt={0.5}
              >
                {item.userName}
              </Text>
            )}
            <Text
              fontSize="xs"
              color={getColor('text.dashboard.tileSubtitle')}
              mt={1}
            >
              {item.expenseName}
              {item.storeName ? ` · ${item.storeName}` : ''}
            </Text>
          </Box>
          {item.isExpired && (
            <Box
              bg={getColor('status.error')}
              color="white"
              borderRadius="sm"
              px={2}
              py="2px"
              fontSize="xs"
              fontWeight="semibold"
              flexShrink={0}
              lineHeight="tall"
            >
              {t('reports.warrantyItems.expiredBadge')}
            </Box>
          )}
        </Flex>

        <Box
          mt={3}
          p={3}
          borderRadius="md"
          bg={getColor('background.dashboard.primary')}
          border="1px solid"
          borderColor={getColor('border.dashboard.tile')}
        >
          <Text
            fontSize="xs"
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            {t('reports.warrantyItems.expiresAt')}
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            color={getUrgencyColor(item, getColor)}
            fontFamily={getFont('heading')}
          >
            {formatDateToBR(item.warrantyExpiresAt)}
          </Text>
          <Text
            fontSize="sm"
            color={getUrgencyColor(item, getColor)}
            fontFamily={getFont('body')}
            mt={0.5}
          >
            {getDaysRemainingLabel(item, t)}
          </Text>
        </Box>

        <Flex
          mt={3}
          gap={4}
          wrap="wrap"
          fontSize="xs"
          color={getColor('text.dashboard.tileSubtitle')}
          fontFamily={getFont('body')}
        >
          <Text>
            {t('reports.warrantyItems.purchaseDate')}:{' '}
            {formatDateToBR(item.purchaseDate)}
          </Text>
          <Text>
            {t('reports.warrantyItems.warranty')}:{' '}
            {formatWarrantyDuration(item.warrantyDuration, item.warrantyUnit, t)}
          </Text>
          <Text>
            {t('reports.warrantyItems.quantity')}: {item.quantity}
          </Text>
        </Flex>

        <Text
          fontSize="xs"
          color={getColor('text.dashboard.filterLabel')}
          mt={2}
        >
          {t('reports.warrantyItems.tapToViewReceipt')}
        </Text>
      </Box>
    </Box>
  );
}
