import { Flex, Image, Heading, IconButton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { CoinDisplay } from './CoinDisplay';

export const Header = () => {
  const { logout, user } = useAuth();

  return (
    <Flex
      bg="purple.800"
      p={4}
      justify="space-between"
      align="center"
      mb={6}
      boxShadow="md"
    >
      {/* Lado Esquerdo - Brasão e Nome */}
      <Flex align="center" gap={3}>
        <Image
          src="/assets/images/coat_of_arms_solare.png"
          boxSize="40px"
          objectFit="contain"
          alt="Brasão da Família"
        />
        <Heading size="md" color="white" fontFamily="Press Start 2P">
          {user?.family}
        </Heading>
      </Flex>

      {/* Lado Direito - Moedas e Logout */}
      <Flex align="center" gap={4}>
        <CoinDisplay coins={user?.coins || 0} />

        <IconButton
          icon={<FiLogOut />}
          aria-label="Sair"
          colorScheme="purple"
          variant="ghost"
          color="white"
          onClick={logout}
        />
      </Flex>
    </Flex>
  );
};
