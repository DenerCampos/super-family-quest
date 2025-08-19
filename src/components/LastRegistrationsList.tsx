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

export const LastRegistrationsList = ({
  newRegistrationAdded,
  setNewRegistrationAdded,
}: {
  newRegistrationAdded: boolean;
  setNewRegistrationAdded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { showValues } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();

  const bgColorExpense = getColor('background.tertiary');
  const bgColorRevenue = getColor('background.tertiary');

  const fetchLastRegistrations = async () => {
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
    fetchLastRegistrations();
  }, []);

  useEffect(() => {
    if (newRegistrationAdded) {
      // Recarregar cupons
      fetchLastRegistrations();
      setNewRegistrationAdded(false);

      // Adicionar animação de destaque
      const timer = setTimeout(() => {
        // Resetar estado
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [newRegistrationAdded, fetchLastRegistrations, setNewRegistrationAdded]);

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
          color={getColor('text.primary')}
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
        color={getColor('text.primary')}
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
                <Icon as={FaStore} color={getColor('text.primary')} mr={2} />
                <Text fontWeight="medium" fontFamily={getFont('body')} color={getColor('text.primary')}>
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
                bg={getColor('background.secondary')}
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
              color={getColor('text.tertiary')}
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
