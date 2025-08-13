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
      bg={getColor('background.primary')}
      p={4}
      justify="space-between"
      align="center"
      boxShadow="md"
    >
      {/* Lado Esquerdo - Brasão e Nome */}
      <Flex align="center" gap={3}>
        <Image
          src={profile?.user.coatOfArms}
          boxSize="40px"
          objectFit="contain"
          alt="Brasão da Família"
        />
        <Heading 
          size="md" 
          color={getColor('text.inverted')}
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
          color={getColor('text.inverted')}
          _hover={{
            bg: getColor('primary.700'),
            color: getColor('text.primary'),
          }}
          onClick={logout}
        />
      </Flex>
    </Flex>
  );
};
