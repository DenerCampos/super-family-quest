import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Spinner,
  VStack,
  Badge,
  Icon,

} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaStore } from 'react-icons/fa';
import { api } from '../services';
import { formatCurrencyBRL } from '../utils/formatCurrency';
import { formatDateToBR } from '../utils/formatDate';
import { capitalizeFirstLetter } from '../utils/formatString';
import type { Registration } from '../services/profile';
import { useAuth } from '../contexts/AuthContext';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';

const MotionBox = motion(Box);

type LastRegistrationsListProps = {
  newRegistrationAdded: boolean;
  setNewRegistrationAdded: React.Dispatch<React.SetStateAction<boolean>>;
  externalRegistrations?: Registration[];
};

export const LastRegistrationsList = ({
  newRegistrationAdded,
  setNewRegistrationAdded,
  externalRegistrations,
}: LastRegistrationsListProps) => {
  const { showValues } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(!externalRegistrations);
  const [error, setError] = useState('');
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();

  const bgColorExpense = getColor('background.lastRegistrations.expense');
  const bgColorRevenue = getColor('background.lastRegistrations.revenue');

  const useExternal = externalRegistrations !== undefined;

  const fetchLastRegistrations = async () => {
    if (useExternal) return;
    try {
      setLoading(true);
      const data = await api.getLatestRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(t('lastRegistrationsList.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useExternal) {
      setRegistrations(externalRegistrations);
      setLoading(false);
    } else {
      fetchLastRegistrations();
    }
  }, [externalRegistrations, useExternal]);

  useEffect(() => {
    if (newRegistrationAdded && !useExternal) {
      fetchLastRegistrations();
      setNewRegistrationAdded(false);

      const timer = setTimeout(() => {
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [newRegistrationAdded, fetchLastRegistrations, setNewRegistrationAdded, useExternal]);

  if (loading) {
    return (
      <Flex justify="center" py={6}>
        <Spinner color={getColor('text.primary')} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py={4} textAlign="center">
        <Text 
          color={getColor('status.error')}
          fontFamily={getFont('body')}
        >
          {error}
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

      <AnimatePresence>
        {registrations.map((registration, index) => (
          <MotionBox
            key={registration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
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
              <Flex align="center">
                <Icon as={FaStore} color={getColor('text.lastRegistrations.icon')} mr={2} />
                <Text fontWeight="medium" fontFamily={getFont('body')} color={getColor('text.lastRegistrations.title')}>
                  {capitalizeFirstLetter(registration.name) ||
                    'Loja desconhecida'}
                </Text>
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
              color={getColor('text.lastRegistrations.neutral')}
              fontSize="sm"
              fontFamily={getFont('body')}
            >
              <Text>{formatDateToBR(registration.date)}</Text>
              <Flex align="center">
                <Icon as={FaCoins} mr={1} />
                <Text>{registration.coins}</Text>
              </Flex>
            </Flex>
          </MotionBox>
        ))}
      </AnimatePresence>
    </VStack>
  );
};
