import {
  VStack,
  Text,
  Flex,
  Box,
  Spinner,
  Avatar,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrencyBRL } from '../../utils/formatCurrency';
import type { FamilyGroupSummaryDto, MemberSummary } from '../../types/familyGroup';

type FamilyGroupSummaryProps = {
  summary: FamilyGroupSummaryDto | null;
  isLoading: boolean;
  selectedMemberId: string | null;
  onSelectMember: (userId: string | null) => void;
};

export const FamilyGroupSummary = ({
  summary,
  isLoading,
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

  const isAllSelected = selectedMemberId === null;

  return (
    <VStack spacing={4} align="stretch">
      {/* Stories dos membros */}
      <Flex
        overflowX="auto"
        gap={3}
        py={3}
        px={1}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {/* Todos */}
        <VStack
          spacing={1}
          minW="68px"
          cursor="pointer"
          onClick={() => onSelectMember(null)}
        >
          <Box
            p="2px"
            borderRadius="full"
            bg={
              isAllSelected
                ? `linear-gradient(135deg, ${getColor('background.familyStories.selected')}, ${getColor('border.familyStories.selected')})`
                : 'transparent'
            }
            border="2px solid"
            borderColor={isAllSelected ? 'transparent' : getColor('border.familyStories.default')}
          >
            <Flex
              w="56px"
              h="56px"
              borderRadius="full"
              bg={getColor('background.familyStories.avatar')}
              border="2px solid"
              borderColor={getColor('background.familyStories.container')}
              align="center"
              justify="center"
            >
              <FaUsers size={24} color={getColor('text.familyStories.name')} />
            </Flex>
          </Box>
          <Text
            fontSize="xs"
            fontFamily={getFont('body')}
            fontWeight={isAllSelected ? 'bold' : 'normal'}
            color={isAllSelected ? getColor('text.familyStories.selectedName') : getColor('text.familyStories.name')}
            textAlign="center"
            noOfLines={1}
            maxW="68px"
          >
            {t('home.familyStories.familyLabel')}
          </Text>
        </VStack>

        {summary.members.map((member: MemberSummary) => {
          const isSelected = selectedMemberId === member.userId;
          return (
            <VStack
              key={member.userId}
              spacing={1}
              minW="68px"
              cursor="pointer"
              onClick={() => onSelectMember(member.userId)}
            >
              <Box
                p="2px"
                borderRadius="full"
                bg={
                  isSelected
                    ? `linear-gradient(135deg, ${getColor('background.familyStories.selected')}, ${getColor('border.familyStories.selected')})`
                    : 'transparent'
                }
                border="2px solid"
                borderColor={isSelected ? 'transparent' : getColor('border.familyStories.default')}
              >
                <Avatar
                  size="md"
                  name={member.name}
                  src={member.profileImage || undefined}
                  border="2px solid"
                  borderColor={getColor('background.familyStories.container')}
                />
              </Box>
              <Text
                fontSize="xs"
                fontFamily={getFont('body')}
                fontWeight={isSelected ? 'bold' : 'normal'}
                color={isSelected ? getColor('text.familyStories.selectedName') : getColor('text.familyStories.name')}
                textAlign="center"
                noOfLines={1}
                maxW="68px"
              >
                {member.name}
              </Text>
            </VStack>
          );
        })}
      </Flex>

      {/* Cards de resumo */}
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
          color={summary.balance >= 0 ? 'green.600' : 'red.600'}
          fontFamily={getFont('mono')}
        >
          {showValues ? formatCurrencyBRL(summary.balance) : '••••••••'}
        </Text>
      </Box>
    </VStack>
  );
};
