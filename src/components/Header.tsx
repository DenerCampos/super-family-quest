import { Avatar, Flex, Heading, IconButton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { CoinDisplay } from './CoinDisplay';
import { useVisualTheme } from '../hooks/useVisualTheme';

export const Header = () => {
  const { logout, profile } = useAuth();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const avatarSrc = profile?.user.profileImage || profile?.user.coatOfArms;

  return (
    <Flex
      bg={getColor('background.header')}
      borderBottomWidth="1px"
      borderBottomColor={getColor('border.header')}
      p={4}
      justify="space-between"
      align="center"
      boxShadow="lg"
    >
      <Flex align="center" gap={3}>
        <Avatar
          size="sm"
          name={profile?.user.name}
          src={avatarSrc}
          borderWidth="2px"
          borderColor={getColor('border.header')}
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
          aria-label={t('auth.logout')}
          variant="ghost"
          bg={getColor('button.background.primary')}
          color={getColor('text.header')}
          _hover={{
            bg: getColor('button.hover.background.inverse'),
            color: getColor('button.hover.text.inverse')
          }}
          onClick={logout}
        />
      </Flex>
    </Flex>
  );
};
