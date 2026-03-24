import { useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Spinner,
  VStack,
  Badge,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaStore } from 'react-icons/fa';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyBRL } from '../utils/formatCurrency';
import { formatDateToBR } from '../utils/formatDate';
import { capitalizeFirstLetter } from '../utils/formatString';
import { useAuth } from '../contexts/AuthContext';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';
import { useGetLastRegistration } from '../hooks/useGetLastRegistration';
import UserBadge from './resources/UserBadge';

const MotionBox = motion(Box);

type LastRegistrationsListProps = {
  newRegistrationAdded: boolean;
  setNewRegistrationAdded: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: string, type: 'expense' | 'revenue') => Promise<void>;
};

export const LastRegistrationsList = ({
  newRegistrationAdded,
  setNewRegistrationAdded,
  onDelete,
}: LastRegistrationsListProps) => {
  const { showValues, profile } = useAuth();
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();
  const navigate = useNavigate();

  const {
    registrations,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchLastRegistration,
  } = useGetLastRegistration();

  const handleEdit = (id: string, type: 'expense' | 'revenue') => {
    navigate(type === 'expense' ? `/expense/${id}` : `/revenue/${id}`);
  };

  const handleDelete = async (id: string, type: 'expense' | 'revenue') => {
    const confirmMsg =
      type === 'expense'
        ? t('resources.expense.deleteConfirm')
        : t('resources.revenue.deleteConfirm');

    if (!globalThis.confirm(confirmMsg)) return;

    await onDelete(id, type);
    refetchLastRegistration();
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: scrollContainerRef.current,
      rootMargin: '100px',
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [handleIntersect]);

  useEffect(() => {
    if (newRegistrationAdded) {
      refetchLastRegistration();
      setNewRegistrationAdded(false);
    }
  }, [newRegistrationAdded, refetchLastRegistration, setNewRegistrationAdded]);

  const bgColorExpense = getColor('background.lastRegistrations.expense');
  const bgColorRevenue = getColor('background.lastRegistrations.revenue');

  if (isLoading) {
    return (
      <Flex justify="center" py={6}>
        <Spinner color={getColor('text.primary')} />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Box py={4} textAlign="center">
        <Text
          color={getColor('status.error')}
          fontFamily={getFont('body')}
        >
          {t('lastRegistrationsList.error')}
        </Text>
      </Box>
    );
  }

  if (registrations.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Text
          color={getColor('text.lastRegistrations.title')}
          fontFamily={getFont('body')}
        >
          {t('lastRegistrationsList.noData')}
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={3} align="stretch" mt={4}>
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={getColor('text.lastRegistrations.title')}
        fontFamily={getFont('heading')}
      >
        {t('lastRegistrationsList.title')}
      </Text>

      <Box
        ref={scrollContainerRef}
        maxH="350px"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: getColor('border.secondary'),
            borderRadius: '4px',
          },
        }}
      >
        <VStack spacing={3} align="stretch" pr={1}>
          <AnimatePresence>
            {registrations.map((registration, index) => (
              <MotionBox
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{
                  duration: 0.3,
                  delay: index < 5 ? index * 0.1 : 0,
                  type: 'spring',
                  stiffness: 300,
                }}
                borderLeftWidth="4px"
                borderLeftColor={
                  registration.type === 'expense'
                    ? getColor('border.lastRegistrations.expense')
                    : getColor('border.lastRegistrations.revenue')
                }
                bg={
                  registration.type === 'expense' ? bgColorExpense : bgColorRevenue
                }
                borderRadius="md"
                p={3}
                boxShadow="sm"
              >
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={1}>
                    <Icon as={FaStore} color={getColor('text.lastRegistrations.icon')} mr={1} />
                    <Text fontWeight="medium" fontFamily={getFont('body')} color={getColor('text.lastRegistrations.title')}>
                      {capitalizeFirstLetter(registration.name) || t('lastRegistrationsList.unknownStore')}
                    </Text>
                    {registration.user && registration.user.id !== profile?.user.id && (
                      <UserBadge user={registration.user} />
                    )}
                  </Flex>

                  <Badge
                    color={
                      registration.type === 'expense'
                        ? getColor('text.lastRegistrations.expense')
                        : getColor('text.lastRegistrations.revenue')
                    }
                    bg={
                      registration.type === 'expense'
                        ? getColor('background.lastRegistrations.badge.expense')
                        : getColor('background.lastRegistrations.badge.revenue')
                    }
                    borderRadius="md"
                    fontSize="sm"
                    fontFamily={getFont('body')}
                  >
                    {registration.type === 'expense' ? '-' : '+'}{' '}
                    {showValues ? formatCurrencyBRL(registration.value) : '••••••'}
                  </Badge>
                </Flex>

                <Flex
                  mt={2}
                  justify="space-between"
                  align="center"
                  color={getColor('text.lastRegistrations.neutral')}
                  fontSize="sm"
                  fontFamily={getFont('body')}
                >
                  <Text>{formatDateToBR(registration.date)}</Text>
                  <Flex align="center" gap={1}>
                    <IconButton
                      aria-label={t('resources.expense.edit')}
                      icon={<FiEdit />}
                      size="xs"
                      variant="ghost"
                      color={getColor('text.lastRegistrations.icon')}
                      _hover={{
                        bg: getColor('button.hover.background.inverse'),
                        color: getColor('button.hover.text.inverse'),
                      }}
                      onClick={() => handleEdit(registration.id, registration.type)}
                    />
                    <IconButton
                      aria-label={t('resources.expense.delete')}
                      icon={<FiTrash2 />}
                      size="xs"
                      variant="ghost"
                      color={getColor('text.lastRegistrations.expense')}
                      _hover={{
                        bg: getColor('background.lastRegistrations.badge.expense'),
                      }}
                      onClick={() => handleDelete(registration.id, registration.type)}
                    />
                    <Icon as={FaCoins} mr={1} />
                    <Text>{registration.coins}</Text>
                  </Flex>
                </Flex>
              </MotionBox>
            ))}
          </AnimatePresence>

          <Box ref={sentinelRef} h="1px" />

          {isFetchingNextPage && (
            <Flex justify="center" py={4}>
              <Spinner size="sm" color={getColor('text.primary')} />
            </Flex>
          )}

          {!hasNextPage && registrations.length > 0 && (
            <Text
              textAlign="center"
              fontSize="sm"
              color={getColor('text.lastRegistrations.neutral')}
              fontFamily={getFont('body')}
              py={2}
            >
              {t('lastRegistrationsList.noMore')}
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};
