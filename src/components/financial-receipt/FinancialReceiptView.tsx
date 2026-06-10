import {
  Box,
  Divider,
  Flex,
  Grid,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { formatCurrencyBRL } from '../../utils/formatCurrency';
import { formatDateToBR } from '../../utils/formatDate';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { ExpenseReceipt, RevenueReceipt } from '../../types/financial';
import { InstallmentBadge } from './InstallmentBadge';
import { ImageLightboxModal } from './ImageLightboxModal';
import { toDisplayableImageUrl } from '../../utils/formatString';

type Props = {
  receipt: ExpenseReceipt | RevenueReceipt;
};

export const FinancialReceiptView = ({ receipt }: Props) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const isExpense = receipt.type === 'expense';
  const accent = isExpense
    ? getColor('border.lastRegistrations.expense')
    : getColor('border.lastRegistrations.revenue');

  return (
    <VStack align="stretch" spacing={4} fontFamily={getFont('body')}>
      <Box
        borderLeft="4px solid"
        borderColor={accent}
        pl={4}
      >
        <Flex justify="space-between" align="start" gap={2}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color={getColor('text.primary')}>
              {isExpense ? (receipt as ExpenseReceipt).store?.name : receipt.name}
            </Text>
            <Text fontSize="sm" color={getColor('text.muted')}>
              {formatDateToBR(receipt.date)}
            </Text>
          </Box>
          <InstallmentBadge
            label={receipt.installment?.installmentLabel}
            variant={receipt.type}
          />
        </Flex>
      </Box>

      <Divider borderColor={getColor('border.tertiary')} />

      {isExpense && (
        <>
          <Grid templateColumns="repeat(4, 1fr)" gap={1} fontSize="xs" color={getColor('text.muted')}>
            <Text>{t('modals.expense.code')}</Text>
            <Text>{t('modals.expense.name')}</Text>
            <Text textAlign="right">{t('modals.expense.quantity')}</Text>
            <Text textAlign="right">{t('modals.expense.unitValue')}</Text>
          </Grid>
          {(receipt as ExpenseReceipt).items?.map((item, i) => (
            <Grid
              key={`${item.code}-${i}`}
              templateColumns="repeat(4, 1fr)"
              gap={1}
              fontSize="sm"
              color={getColor('text.primary')}
              py={1}
              borderBottom="1px dashed"
              borderColor={getColor('border.tertiary')}
            >
              <Text>{item.code}</Text>
              <Text noOfLines={2}>{item.name}</Text>
              <Text textAlign="right">
                {item.quantity} {item.unit}
              </Text>
              <Text textAlign="right">{formatCurrencyBRL(item.value)}</Text>
              {item.warrantyDuration && item.warrantyUnit && (
                <Text gridColumn="1 / -1" fontSize="xs" color={getColor('text.muted')}>
                  {t('financialSteps.warranty.label', {
                    duration: item.warrantyDuration,
                    unit: t(`financialSteps.recurrence.${item.warrantyUnit}`),
                  })}
                </Text>
              )}
            </Grid>
          ))}
          <Text fontSize="sm" color={getColor('text.primary')}>
            {t('modals.expense.payment')}: {(receipt as ExpenseReceipt).payment?.name}
          </Text>
        </>
      )}

      {!isExpense && (
        <Text fontSize="md" color={getColor('text.primary')}>
          {receipt.name}
        </Text>
      )}

      {receipt.photos?.length > 0 && (
        <Box>
          <Text fontWeight="semibold" mb={2} color={getColor('text.primary')}>
            {t('financialSteps.photos.title')}
          </Text>
          <Flex wrap="wrap" gap={2}>
            {receipt.photos.map((url) => (
              <Image
                key={url}
                src={toDisplayableImageUrl(url)}
                alt=""
                w="72px"
                h="72px"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
                onClick={() => setLightboxUrl(url)}
              />
            ))}
          </Flex>
        </Box>
      )}

      <Box
        mt="auto"
        pt={4}
        borderTop="2px solid"
        borderColor={accent}
        textAlign="right"
      >
        {receipt.installment?.isInstallment ? (
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color={getColor('text.muted')}>
                {t('financialReceipt.installmentValue')}
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color={getColor('text.primary')}>
                {formatCurrencyBRL(receipt.installmentValue ?? receipt.value)}
              </Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color={getColor('text.muted')}>
                {t('financialReceipt.totalValue')}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={getColor('text.primary')}>
                {formatCurrencyBRL(receipt.totalValue ?? receipt.value)}
              </Text>
            </Flex>
          </VStack>
        ) : (
          <>
            <Text fontSize="xs" color={getColor('text.muted')}>
              {t('financialReceipt.total')}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={getColor('text.primary')}>
              {formatCurrencyBRL(receipt.value)}
            </Text>
          </>
        )}
      </Box>

      {lightboxUrl && (
        <ImageLightboxModal
          url={lightboxUrl}
          isOpen={!!lightboxUrl}
          onClose={() => setLightboxUrl(null)}
        />
      )}
    </VStack>
  );
};
