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

const AVATAR_SIZE = 44;
const SELECTED_AVATAR_EXTRA = 12;
const AVATAR_SLOT_HEIGHT = AVATAR_SIZE + SELECTED_AVATAR_EXTRA + 8;

function getAvatarSize(isSelected: boolean) {
  return isSelected ? AVATAR_SIZE + SELECTED_AVATAR_EXTRA : AVATAR_SIZE;
}

function getRingBorderColor(isSelected: boolean, getColor: (token: string) => string) {
  return isSelected ? getColor('border.familyStories.default') : 'transparent';
}

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
      align="flex-start"
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
        <Flex
          h={`${AVATAR_SLOT_HEIGHT}px`}
          align="center"
          justify="center"
        >
          <Box
            p="2px"
            borderRadius="full"
            border="2px solid"
            borderColor={getRingBorderColor(isFamilySelected, getColor)}
            transition="all 0.2s ease"
          >
            <Flex
              w={`${getAvatarSize(isFamilySelected)}px`}
              h={`${getAvatarSize(isFamilySelected)}px`}
              borderRadius="full"
              bg={getColor('background.familyStories.avatar')}
              border="2px solid"
              borderColor={getColor('background.familyStories.container')}
              align="center"
              justify="center"
              transition="width 0.2s ease, height 0.2s ease"
            >
              <FaUsers
                size={isFamilySelected ? 22 : 18}
                color={getColor('text.familyStories.name')}
              />
            </Flex>
          </Box>
        </Flex>
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
            <Flex
              h={`${AVATAR_SLOT_HEIGHT}px`}
              align="center"
              justify="center"
            >
              <Box
                p="2px"
                borderRadius="full"
                border="2px solid"
                borderColor={getRingBorderColor(isSelected, getColor)}
                transition="all 0.2s ease"
              >
                <Avatar
                  boxSize={`${getAvatarSize(isSelected)}px`}
                  name={member.name}
                  src={toDisplayableImageUrl(member.profileImage) || undefined}
                  referrerPolicy="no-referrer"
                  border="2px solid"
                  borderColor={getColor('background.familyStories.container')}
                  transition="width 0.2s ease, height 0.2s ease"
                />
              </Box>
            </Flex>
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
