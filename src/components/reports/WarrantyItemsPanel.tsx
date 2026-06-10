import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FinancialReceiptDrawer } from '../financial-receipt/FinancialReceiptDrawer';
import { useFinancialReceiptDrawer } from '../../hooks/useFinancialReceiptDrawer';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useWarrantyItems } from '../../hooks/useWarrantyItems';
import { WarrantyItemRow } from './WarrantyItemRow';

type Props = {
  year: number;
  userId?: string;
  showMemberName: boolean;
  page: number;
  onPageChange: (page: number) => void;
};

export function WarrantyItemsPanel({
  year,
  userId,
  showMemberName,
  page,
  onPageChange,
}: Props) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { target, openReceipt, closeReceipt } = useFinancialReceiptDrawer();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [includeExpired, setIncludeExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    onPageChange(1);
  }, [debouncedSearch, includeExpired, year, userId, onPageChange]);

  const { data, isLoading, isError } = useWarrantyItems({
    year,
    userId,
    search: debouncedSearch,
    includeExpired,
    page,
  });

  const cardStyle = {
    borderRadius: 'lg',
    bg: getColor('background.dashboard.filterBar'),
    border: '1px solid',
    borderColor: getColor('border.dashboard.tile'),
  };

  return (
    <>
      <VStack align="stretch" spacing={3}>
        <Box {...cardStyle} p={3}>
          <Flex gap={2} align="center">
            <Box position="relative" flex={1}>
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('reports.warrantyItems.searchPlaceholder')}
                size="sm"
                pl={9}
                borderRadius="md"
                fontFamily={getFont('body')}
                bg={getColor('background.dashboard.filterBar')}
                color={getColor('text.dashboard.filterLabel')}
                borderColor={getColor('border.dashboard.tile')}
                _placeholder={{ color: getColor('text.dashboard.tileSubtitle') }}
                _hover={{ borderColor: getColor('border.dashboard.tileActive') }}
                _focus={{ borderColor: getColor('border.dashboard.tileActive') }}
              />
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color={getColor('text.dashboard.tileSubtitle')}
              >
                <FiSearch size={14} />
              </Box>
            </Box>
          </Flex>

          <Select
            mt={3}
            size="sm"
            value={includeExpired ? 'all' : 'active'}
            onChange={(e) => setIncludeExpired(e.target.value === 'all')}
            borderColor={getColor('border.dashboard.tile')}
            bg={getColor('background.dashboard.filterBar')}
            color={getColor('text.dashboard.filterLabel')}
            fontFamily={getFont('body')}
          >
            <option value="active">{t('reports.warrantyItems.filterActive')}</option>
            <option value="all">{t('reports.warrantyItems.filterIncludeExpired')}</option>
          </Select>
        </Box>

        {isLoading && (
          <Flex justify="center" py={8}>
            <Spinner color={getColor('text.dashboard.title')} />
          </Flex>
        )}

        {isError && (
          <Text
            color={getColor('status.error')}
            textAlign="center"
            fontFamily={getFont('body')}
          >
            {t('reports.warrantyItems.error')}
          </Text>
        )}

        {!isLoading && !isError && data && (
          <Box {...cardStyle} overflow="hidden">
            {data.data.length === 0 ? (
              <Text
                p={6}
                textAlign="center"
                color={getColor('text.dashboard.tileSubtitle')}
                fontFamily={getFont('body')}
              >
                {t('reports.warrantyItems.noData')}
              </Text>
            ) : (
              data.data.map((item, index) => (
                <WarrantyItemRow
                  key={item.id}
                  item={item}
                  showMemberName={showMemberName}
                  isFirst={index === 0}
                  onOpen={openReceipt}
                />
              ))
            )}
          </Box>
        )}

        {data && data.meta.totalPages > 1 && (
          <Flex justify="center" align="center" gap={4} py={2}>
            <Button
              size="sm"
              variant="outline"
              isDisabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              borderColor={getColor('border.dashboard.tile')}
              color={getColor('text.dashboard.filterLabel')}
            >
              {t('reports.warrantyItems.previous')}
            </Button>
            <Text
              fontSize="sm"
              color={getColor('text.dashboard.tileSubtitle')}
              fontFamily={getFont('body')}
            >
              {t('reports.warrantyItems.pageOf', {
                current: data.meta.currentPage,
                total: data.meta.totalPages,
              })}
            </Text>
            <Button
              size="sm"
              variant="outline"
              isDisabled={page >= data.meta.totalPages}
              onClick={() => onPageChange(page + 1)}
              borderColor={getColor('border.dashboard.tile')}
              color={getColor('text.dashboard.filterLabel')}
            >
              {t('reports.warrantyItems.next')}
            </Button>
          </Flex>
        )}
      </VStack>

      <FinancialReceiptDrawer target={target} onClose={closeReceipt} />
    </>
  );
}
