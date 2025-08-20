import { Flex, Image, Heading, IconButton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { CoinDisplay } from './CoinDisplay';
import { useVisualTheme } from '../hooks/useVisualTheme';

export const Header = () => {
  const { logout, profile } = useAuth();
  const { getColor, getFont } = useVisualTheme();

  return (
    <Flex
      bg={getColor('background.header')}
      borderBottomWidth="1px"
      borderBottomColor={getColor('border.primary')}
      p={4}
      justify="space-between"
      align="center"
      boxShadow="lg"
    >
      {/* Lado Esquerdo - Brasão e Nome */}
      <Flex align="center" gap={3}>
        <Image
          src={profile?.user.coatOfArms}
          boxSize="40px"
          objectFit="contain"
          alt="Brasão da Família"
          borderRadius="md"
          borderWidth="2px"
          borderColor={getColor('border.secondary')}
          p={1}
          bg={getColor('background.secondary')}
        />
        <Heading
          size="md"
          color={getColor('text.header')}
          fontFamily={getFont('heading')}
        >
          {profile?.user.family}
        </Heading>
      </Flex>

      {/* Lado Direito - Moedas e Logout */}
      <Flex align="center" gap={4}>
        <CoinDisplay coins={profile?.coins || 0} />
        <IconButton
          icon={<FiLogOut />}
          aria-label="Sair"
          variant="ghost"
          color={getColor('text.header')}
          _hover={{
            bg: getColor('background.tertiary'),
            color: getColor('text.accent')
          }}
          colorScheme="gray"
          onClick={logout}
        />
      </Flex>
    </Flex>
  );
};
