import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';
import { api } from '../../services';
import { financialQueryKeys } from '../../hooks/financialQueryKeys';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { ExpenseReceipt, ReceiptTarget, RevenueReceipt } from '../../types/financial';
import { formatFinancialReceiptShare } from '../../utils/formatFinancialReceiptShare';
import { ShareTextButton } from '../ShareTextButton';
import { FinancialReceiptView } from './FinancialReceiptView';

type Props = {
  target: ReceiptTarget | null;
  onClose: () => void;
};

export const FinancialReceiptDrawer = ({ target, onClose }: Props) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const { data, isLoading, isError } = useQuery<ExpenseReceipt | RevenueReceipt>({
    queryKey: financialQueryKeys.receipt(target?.type, target?.id),
    queryFn: async () => {
      if (target!.type === 'expense') {
        return api.getExpenseReceipt(target!.id);
      }
      return api.getRevenueReceipt(target!.id);
    },
    enabled: !!target,
  });

  return (
    <Drawer isOpen={!!target} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent bg={getColor('background.primary')}>
        <DrawerHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid"
          borderColor={getColor('border.primary')}
        >
          <Text color={getColor('text.primary')}>
            {t('financialReceipt.title')}
          </Text>
          <Flex align="center" gap={1}>
            {data && (
              <ShareTextButton
                payload={formatFinancialReceiptShare(data, t)}
                color={getColor('text.primary')}
              />
            )}
            <IconButton
              aria-label={t('common.close')}
              icon={<FiX />}
              variant="ghost"
              color={getColor('text.primary')}
              _hover={{ bg: getColor('background.secondary') }}
              onClick={onClose}
            />
          </Flex>
        </DrawerHeader>
        <DrawerBody py={6}>
          {isLoading && <Spinner color={getColor('text.primary')} />}
          {isError && (
            <Text color={getColor('status.error')}>{t('common.error')}</Text>
          )}
          {data && <FinancialReceiptView receipt={data} />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
