import { Avatar, Box, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import type { FamilyStoryGroup } from '../hooks/useFamilyGroup';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { toDisplayableImageUrl } from '../utils/formatString';
import type { MemberSummary } from '../types/familyGroup';

type FamilyStoriesProps = {
  familyGroups: FamilyStoryGroup[];
  selectedFamilyGroupId: string | null;
  onSelectFamily: (familyGroupId: string) => void;
  members: MemberSummary[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
};

const PRIMARY_SIZE = 56;
const SECONDARY_SIZE = 44;
const MEMBER_SIZE = 40;
const SELECTED_MEMBER_EXTRA = 8;
const AVATAR_SLOT_HEIGHT = PRIMARY_SIZE + 8;

function getMemberSize(isSelected: boolean) {
  return isSelected ? MEMBER_SIZE + SELECTED_MEMBER_EXTRA : MEMBER_SIZE;
}

function getRingBorderColor(
  isSelected: boolean,
  getColor: (token: string) => string,
) {
  return isSelected ? getColor('border.familyStories.default') : 'transparent';
}

function FamilyCircleIcon({
  size,
  image,
  getColor,
}: {
  size: number;
  image?: string | null;
  getColor: (token: string) => string;
}) {
  const src = toDisplayableImageUrl(image) || undefined;

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        boxSize={`${size}px`}
        borderRadius="full"
        objectFit="cover"
        border="2px solid"
        borderColor={getColor('background.familyStories.container')}
      />
    );
  }

  return (
    <Flex
      w={`${size}px`}
      h={`${size}px`}
      borderRadius="full"
      bg={getColor('background.familyStories.avatar')}
      border="2px solid"
      borderColor={getColor('background.familyStories.container')}
      align="center"
      justify="center"
      transition="width 0.2s ease, height 0.2s ease"
    >
      <FaUsers
        size={size >= PRIMARY_SIZE ? 22 : 18}
        color={getColor('text.familyStories.name')}
      />
    </Flex>
  );
}

export const FamilyStories = ({
  familyGroups,
  selectedFamilyGroupId,
  onSelectFamily,
  members,
  selectedMemberId,
  onSelectMember,
}: FamilyStoriesProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const selectedFamily =
    familyGroups.find((g) => g.id === selectedFamilyGroupId) ??
    familyGroups[0] ??
    null;

  const otherAdminFamilies = familyGroups.filter(
    (g) => g.isAdmin && g.id !== selectedFamily?.id,
  );

  const isFamilyView = selectedMemberId === null;

  if (!selectedFamily) {
    return null;
  }

  const primaryLabel = selectedFamily.isOwner
    ? t('home.familyStories.familyLabel')
    : selectedFamily.name;

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
        minW="56px"
        cursor="pointer"
        onClick={() => {
          onSelectFamily(selectedFamily.id);
          onSelectMember(null);
        }}
      >
        <Flex h={`${AVATAR_SLOT_HEIGHT}px`} align="center" justify="center">
          <Box
            p="2px"
            borderRadius="full"
            border="2px solid"
            borderColor={getRingBorderColor(isFamilyView, getColor)}
            transition="all 0.2s ease"
          >
            <FamilyCircleIcon
              size={PRIMARY_SIZE}
              image={selectedFamily.image}
              getColor={getColor}
            />
          </Box>
        </Flex>
        <Text
          fontSize="2xs"
          fontFamily={getFont('body')}
          fontWeight={isFamilyView ? 'bold' : 'normal'}
          color={
            isFamilyView
              ? getColor('text.familyStories.selectedName')
              : getColor('text.familyStories.name')
          }
          textAlign="center"
          noOfLines={1}
          maxW="56px"
        >
          {primaryLabel}
        </Text>
      </VStack>

      {otherAdminFamilies.map((group) => (
        <VStack
          key={group.id}
          spacing={0.5}
          minW="52px"
          cursor="pointer"
          onClick={() => onSelectFamily(group.id)}
        >
          <Flex h={`${AVATAR_SLOT_HEIGHT}px`} align="center" justify="center">
            <Box
              p="2px"
              borderRadius="full"
              border="2px solid"
              borderColor="transparent"
              transition="all 0.2s ease"
            >
              <FamilyCircleIcon
                size={SECONDARY_SIZE}
                image={group.image}
                getColor={getColor}
              />
            </Box>
          </Flex>
          <Text
            fontSize="2xs"
            fontFamily={getFont('body')}
            fontWeight="normal"
            color={getColor('text.familyStories.name')}
            textAlign="center"
            noOfLines={1}
            maxW="52px"
          >
            {group.name}
          </Text>
        </VStack>
      ))}

      {members.map((member) => {
        const isSelected = selectedMemberId === member.userId;

        return (
          <VStack
            key={member.userId}
            spacing={0.5}
            minW="52px"
            cursor="pointer"
            onClick={() => onSelectMember(member.userId)}
          >
            <Flex h={`${AVATAR_SLOT_HEIGHT}px`} align="center" justify="center">
              <Box
                p="2px"
                borderRadius="full"
                border="2px solid"
                borderColor={getRingBorderColor(isSelected, getColor)}
                transition="all 0.2s ease"
              >
                <Avatar
                  boxSize={`${getMemberSize(isSelected)}px`}
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
