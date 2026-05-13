import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiChevronsRight } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { formatCurrency } from '../../utils/formatCurrency';
import { resolveChakraColor } from '../../utils/resolveColor';
import type { ChoreOccurrenceResponseDto } from '../../types/chore';

const OccurrenceCard = ({
  item,
  showStart,
  onStart,
  onOpen,
  isStarting,
  inCarousel = false,
}: {
  item: ChoreOccurrenceResponseDto;
  showStart: boolean;
  onStart: (id: string) => void;
  onOpen: (item: ChoreOccurrenceResponseDto) => void;
  isStarting: boolean;
  inCarousel?: boolean;
}) => {
  const { getColor, getFont, theme } = useVisualTheme();
  const { t } = useThemedTranslation();
  const reward =
    item.snapshotRewardMoney ?? item.definition.rewardValue;
  const carouselShadow =
    inCarousel === true
      ? resolveChakraColor(theme.colors.background.familyGroup.elevatedShadow)
      : undefined;
  return (
    <Box
      h="100%"
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={getColor('border.familyGroup.card')}
      bg={getColor('background.familyGroup.card')}
      onClick={() => onOpen(item)}
      cursor="pointer"
      boxShadow={carouselShadow}
    >
      <Text
        fontWeight="bold"
        fontFamily={getFont('body')}
        color={getColor('text.familyGroup.title')}
        mb={2}
        noOfLines={2}
      >
        {item.definition.title}
      </Text>
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={getColor('text.familyGroup.title')}
        mb={2}
      >
        {formatCurrency(reward)}
      </Text>
      <VStack align="stretch" spacing={2}>
        {item.definition.requirePhoto ? (
          <Badge
            w="fit-content"
            px={2}
            py={0.5}
            borderWidth="1px"
            borderColor={getColor('border.primary')}
            bg={getColor('background.familyGroup.memberCard')}
            color={getColor('text.familyGroup.title')}
            textTransform="none"
            fontSize="xs"
            fontWeight="semibold"
          >
            {t('chores.badgeRequiresPhoto')}
          </Badge>
        ) : null}
        {item.status === 'WAITING_APPROVAL' ? (
          <Badge
            w="fit-content"
            bg={getColor('background.familyGroup.badge.pending')}
            color={getColor('text.familyGroup.badge.pending')}
          >
            {t('chores.statusWaitingApproval')}
          </Badge>
        ) : null}
        {item.status === 'IN_PROGRESS' ? (
          <Badge
            w="fit-content"
            bg={getColor('background.familyGroup.badge.admin')}
            color={getColor('text.familyGroup.badge.admin')}
          >
            {t('chores.statusInProgress')}
          </Badge>
        ) : null}
        {showStart && item.status === 'OPEN' ? (
          <Button
            size="sm"
            mt={2}
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            isLoading={isStarting}
            onClick={(e) => {
              e.stopPropagation();
              onStart(item.id);
            }}
          >
            {t('chores.startTask')}
          </Button>
        ) : null}
        {(item.status === 'IN_PROGRESS' ||
          item.status === 'WAITING_APPROVAL') && (
          <Button
            size="sm"
            variant="outline"
            borderColor={getColor('border.primary')}
            color={getColor('text.familyGroup.title')}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(item);
            }}
          >
            {t('chores.openDetails')}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export const OccurrenceCarousel = ({
  ariaLabel,
  rows,
  showStart,
  isStarting,
  onStart,
  onOpen,
}: {
  ariaLabel: string;
  rows: ChoreOccurrenceResponseDto[];
  showStart: boolean;
  isStarting: boolean;
  onStart: (id: string) => void;
  onOpen: (item: ChoreOccurrenceResponseDto) => void;
}) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  return (
    <>
      {rows.length > 1 ? (
        <HStack
          spacing={2}
          mb={2}
          justify="flex-start"
          color={getColor('text.familyGroup.primary')}
        >
          <Icon as={FiChevronsRight} boxSize={5} aria-hidden />
          <Text fontSize="xs" fontWeight="medium">
            {t('chores.swipeForMore')}
          </Text>
        </HStack>
      ) : null}
      <Flex
        role="region"
        aria-label={ariaLabel}
        gap={3}
        overflowX="auto"
        overflowY="hidden"
        pb={2}
        mx={-1}
        px={1}
        sx={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-thumb': {
            background: getColor('border.primary'),
            borderRadius: '999px',
          },
        }}
      >
        {rows.map((item) => (
          <Box
            key={item.id}
            flex="0 0 min(88%, 320px)"
            maxW="min(88%, 320px)"
            scrollSnapAlign="start"
          >
            <OccurrenceCard
              item={item}
              showStart={showStart}
              inCarousel
              isStarting={isStarting}
              onStart={onStart}
              onOpen={onOpen}
            />
          </Box>
        ))}
      </Flex>
    </>
  );
};
