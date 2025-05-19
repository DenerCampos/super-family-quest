import { Flex, Image, Heading, IconButton, Text } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { logout, user } = useAuth();

  return (
    <Flex
      bg="purple.800"
      p={4}
      justify="space-between"
      align="center"
      borderRadius="lg"
      mb={6}
      boxShadow="md"
    >
      {/* Lado Esquerdo - Brasão e Nome */}
      <Flex align="center" gap={3}>
        <Image
          src="/assets/images/coat_of_arms_family.png"
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
        <Flex align="center" bg="purple.700" px={3} py={1} borderRadius="md">
          <Image src="/assets/images/gold-coin.gif" boxSize="25px" mr={2} />
          <Text color="yellow.400" fontWeight="bold">
            {user?.coins}
          </Text>
        </Flex>

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
