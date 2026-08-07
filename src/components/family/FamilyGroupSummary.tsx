import {
  VStack,
  Text,
  Flex,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import type { FamilyStoryGroup } from '../../hooks/useFamilyGroup';
import { formatCurrencyBRL } from '../../utils/formatCurrency';
import { FamilyStories } from '../FamilyStories';
import type { FamilyGroupSummaryDto } from '../../types/familyGroup';

type FamilyGroupSummaryProps = {
  summary: FamilyGroupSummaryDto | null;
  isLoading: boolean;
  familyStoryGroups: FamilyStoryGroup[];
  selectedFamilyGroupId: string | null;
  onSelectFamily: (familyGroupId: string) => void;
  selectedMemberId: string | null;
  onSelectMember: (userId: string | null) => void;
};

export const FamilyGroupSummary = ({
  summary,
  isLoading,
  familyStoryGroups,
  selectedFamilyGroupId,
  onSelectFamily,
  selectedMemberId,
  onSelectMember,
}: FamilyGroupSummaryProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { showValues } = useAuth();

  if (isLoading || !summary) {
    return (
      <Flex justify="center" py={6}>
        <Spinner color={getColor('text.familyGroup.primary')} />
      </Flex>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <FamilyStories
        familyGroups={familyStoryGroups}
        selectedFamilyGroupId={selectedFamilyGroupId}
        onSelectFamily={onSelectFamily}
        members={summary.members}
        selectedMemberId={selectedMemberId}
        onSelectMember={onSelectMember}
      />

      <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
        <Box
          flex={1}
          p={3}
          bg={getColor('background.summaryCard.revenue')}
          borderRadius="md"
          borderLeftWidth="4px"
          borderLeftColor={getColor('border.summaryCard.revenue')}
        >
          <Text fontSize="xs" color={getColor('text.summaryCard.revenue')} fontFamily={getFont('body')} fontWeight="bold">
            {t('familyGroup.totalRevenues')}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={getColor('text.summaryCard.revenue')} fontFamily={getFont('mono')}>
            {showValues ? formatCurrencyBRL(summary.totalRevenues) : '••••••••'}
          </Text>
        </Box>
        <Box
          flex={1}
          p={3}
          bg={getColor('background.summaryCard.expense')}
          borderRadius="md"
          borderLeftWidth="4px"
          borderLeftColor={getColor('border.summaryCard.expense')}
        >
          <Text fontSize="xs" color={getColor('text.summaryCard.expense')} fontFamily={getFont('body')} fontWeight="bold">
            {t('familyGroup.totalExpenses')}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={getColor('text.summaryCard.expense')} fontFamily={getFont('mono')}>
            {showValues ? formatCurrencyBRL(summary.totalExpenses) : '••••••••'}
          </Text>
        </Box>
      </Flex>

      <Box
        p={3}
        bg={getColor('background.familyGroup.card')}
        borderRadius="md"
        borderWidth="1px"
        borderColor={getColor('border.familyGroup.card')}
      >
        <Text fontSize="xs" color={getColor('text.familyGroup.secondary')} fontFamily={getFont('body')} fontWeight="bold">
          {t('familyGroup.balance')}
        </Text>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={summary.balance >= 0 ? getColor('text.summaryCard.revenue') : getColor('text.summaryCard.expense')}
          fontFamily={getFont('mono')}
        >
          {showValues ? formatCurrencyBRL(summary.balance) : '••••••••'}
        </Text>
      </Box>
    </VStack>
  );
};
