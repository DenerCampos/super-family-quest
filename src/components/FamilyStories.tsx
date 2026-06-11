import { Avatar, Box, Flex, Text, VStack } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { toDisplayableImageUrl } from '../utils/formatString';
import type { MemberSummary } from '../types/familyGroup';

type FamilyStoriesProps = {
  members: MemberSummary[];
  selectedId: string | null;
  onSelect: (memberId: string | null) => void;
};

export const FamilyStories = ({
  members,
  selectedId,
  onSelect,
}: FamilyStoriesProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const isFamilySelected = selectedId === null;

  return (
    <Flex
      overflowX="auto"
      gap={2}
      py={2}
      px={4}
      bg={getColor('background.familyStories.container')}
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <VStack
        spacing={0.5}
        minW="52px"
        cursor="pointer"
        onClick={() => onSelect(null)}
      >
        <Box
          p="2px"
          borderRadius="full"
          bg={
            isFamilySelected
              ? `linear-gradient(135deg, ${getColor('background.familyStories.selected')}, ${getColor('border.familyStories.selected')})`
              : 'transparent'
          }
          border="2px solid"
          borderColor={
            isFamilySelected
              ? 'transparent'
              : getColor('border.familyStories.default')
          }
        >
          <Flex
            w="44px"
            h="44px"
            borderRadius="full"
            bg={getColor('background.familyStories.avatar')}
            border="2px solid"
            borderColor={getColor('background.familyStories.container')}
            align="center"
            justify="center"
          >
            <FaUsers
              size={18}
              color={getColor('text.familyStories.name')}
            />
          </Flex>
        </Box>
        <Text
          fontSize="2xs"
          fontFamily={getFont('body')}
          fontWeight={isFamilySelected ? 'bold' : 'normal'}
          color={
            isFamilySelected
              ? getColor('text.familyStories.selectedName')
              : getColor('text.familyStories.name')
          }
          textAlign="center"
          noOfLines={1}
          maxW="52px"
        >
          {t('home.familyStories.familyLabel')}
        </Text>
      </VStack>

      {members.map((member) => {
        const isSelected = selectedId === member.userId;

        return (
          <VStack
            key={member.userId}
            spacing={0.5}
            minW="52px"
            cursor="pointer"
            onClick={() => onSelect(member.userId)}
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
              borderColor={
                isSelected
                  ? 'transparent'
                  : getColor('border.familyStories.default')
              }
            >
              <Avatar
                boxSize="44px"
                name={member.name}
                src={toDisplayableImageUrl(member.profileImage) || undefined}
                referrerPolicy="no-referrer"
                border="2px solid"
                borderColor={getColor('background.familyStories.container')}
              />
            </Box>
            <Text
              fontSize="2xs"
              fontFamily={getFont('body')}
              fontWeight={isSelected ? 'bold' : 'normal'}
              color={
                isSelected
                  ? getColor('text.familyStories.selectedName')
                  : getColor('text.familyStories.name')
              }
              textAlign="center"
              noOfLines={1}
              maxW="52px"
            >
              {member.name}
            </Text>
          </VStack>
        );
      })}
    </Flex>
  );
};
