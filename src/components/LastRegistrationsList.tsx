import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Spinner,
  VStack,
  Badge,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaStore } from 'react-icons/fa';
import { api } from '../services';
import { formatCurrencyBRL } from '../utils/formatCurrency';
import { formatDateToBR } from '../utils/formatDate';
import { capitalizeFirstLetter } from '../utils/formatString';
import type { Registration } from '../services/user';

const MotionBox = motion(Box);

export const LastRegistrationsList = ({
  newRegistrationAdded,
  setNewRegistrationAdded,
}: {
  newRegistrationAdded: boolean;
  setNewRegistrationAdded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bgColorExpense = useColorModeValue('red.50', 'gray.700');
  const bgColorRevenue = useColorModeValue('green.50', 'gray.700');

  const fetchLastRegistrations = async () => {
    try {
      setLoading(true);
      const data = await api.getLatestRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError('Erro ao carregar despesas recentes');
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
  }, [newRegistrationAdded]);

  if (loading) {
    return (
      <Flex justify="center" py={6}>
        <Spinner color="purple.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py={4} textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (registrations.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Text color="gray.500">Nenhuma despasa cadastrada ainda</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={3} align="stretch" mt={4}>
      <Text fontSize="lg" fontWeight="bold" color="purple.800">
        Últimas Despesas
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
              registration.type === 'expense' ? 'red.400' : 'green.400'
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
                <Icon as={FaStore} color="purple.500" mr={2} />
                <Text fontWeight="medium">
                  {capitalizeFirstLetter(registration.name) ||
                    'Loja desconhecida'}
                </Text>
              </Flex>

              <Badge
                colorScheme={registration.type === 'expense' ? 'red' : 'green'}
                fontSize="sm"
              >
                {registration.type === 'expense' ? '-' : '+'}{' '}
                {formatCurrencyBRL(registration.value)}
              </Badge>
            </Flex>

            <Flex mt={2} justify="space-between" color="gray.500" fontSize="sm">
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
