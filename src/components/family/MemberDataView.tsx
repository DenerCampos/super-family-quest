import {
  VStack,
  Text,
  Flex,
  Badge,
  Box,
  Spinner,
  Avatar,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { formatCurrencyBRL } from '../../utils/formatCurrency';
import { formatDateToBR } from '../../utils/formatDate';
import type { MemberDataDto } from '../../types/familyGroup';
import { useAuth } from '../../contexts/AuthContext';

type MemberDataViewProps = {
  data: MemberDataDto | null;
  isLoading: boolean;
};

export const MemberDataView = ({ data, isLoading }: MemberDataViewProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { showValues } = useAuth();

  if (isLoading) {
    return (
      <Flex justify="center" py={6}>
        <Spinner color={getColor('text.familyGroup.primary')} />
      </Flex>
    );
  }

  if (!data) return null;

  return (
    <VStack spacing={4} align="stretch">
      <Flex align="center" gap={3} mb={2}>
        <Avatar
          size="md"
          name={data.name}
          src={data.profileImage || undefined}
        />
        <Box>
          <Text
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.familyGroup.title')}
          >
            {data.name}
          </Text>
          <Flex gap={4} fontSize="sm" fontFamily={getFont('body')}>
            <Text color="green.600">
              {t('familyGroup.revenues')}: {showValues ? formatCurrencyBRL(data.totalRevenues) : '••••••'}
            </Text>
            <Text color="red.600">
              {t('familyGroup.expenses')}: {showValues ? formatCurrencyBRL(data.totalExpenses) : '••••••'}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {data.revenues.length > 0 && (
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            mb={2}
            color={getColor('text.familyGroup.primary')}
            fontFamily={getFont('heading')}
          >
            {t('familyGroup.revenues')}
          </Text>
          <VStack spacing={2} align="stretch">
            {data.revenues.map((rev) => (
              <Flex
                key={rev.id}
                justify="space-between"
                align="center"
                bg={getColor('background.lastRegistrations.revenue')}
                p={2}
                borderRadius="md"
                borderLeftWidth="3px"
                borderLeftColor={getColor('border.lastRegistrations.revenue')}
              >
                <Box>
                  <Text fontSize="sm" fontFamily={getFont('body')} color={getColor('text.familyGroup.primary')}>
                    {rev.name}
                  </Text>
                  <Text fontSize="xs" color={getColor('text.familyGroup.secondary')}>
                    {formatDateToBR(rev.date)}
                  </Text>
                </Box>
                <Badge colorScheme="green" fontSize="sm">
                  + {showValues ? formatCurrencyBRL(rev.value) : '••••••'}
                </Badge>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {data.expenses.length > 0 && (
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            mb={2}
            color={getColor('text.familyGroup.primary')}
            fontFamily={getFont('heading')}
          >
            {t('familyGroup.expenses')}
          </Text>
          <VStack spacing={2} align="stretch">
            {data.expenses.map((exp) => (
              <Flex
                key={exp.id}
                justify="space-between"
                align="center"
                bg={getColor('background.lastRegistrations.expense')}
                p={2}
                borderRadius="md"
                borderLeftWidth="3px"
                borderLeftColor={getColor('border.lastRegistrations.expense')}
              >
                <Box>
                  <Text fontSize="sm" fontFamily={getFont('body')} color={getColor('text.familyGroup.primary')}>
                    {exp.name}
                  </Text>
                  <Text fontSize="xs" color={getColor('text.familyGroup.secondary')}>
                    {formatDateToBR(exp.date)}
                  </Text>
                </Box>
                <Badge colorScheme="red" fontSize="sm">
                  - {showValues ? formatCurrencyBRL(exp.value) : '••••••'}
                </Badge>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {data.revenues.length === 0 && data.expenses.length === 0 && (
        <Text
          textAlign="center"
          color={getColor('text.familyGroup.secondary')}
          fontFamily={getFont('body')}
          py={4}
        >
          {t('familyGroup.noData')}
        </Text>
      )}
    </VStack>
  );
};
