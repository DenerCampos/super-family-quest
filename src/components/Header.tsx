import { Avatar, Flex, Heading, IconButton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { toDisplayableImageUrl } from '../utils/formatString';
import { CoinDisplay } from './CoinDisplay';
import { NotificationBell } from './notifications/NotificationBell';
import { useVisualTheme } from '../hooks/useVisualTheme';

export const Header = () => {
  const { logout, profile } = useAuth();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const avatarSrc = toDisplayableImageUrl(profile?.user.profileImage) || profile?.user.coatOfArms;

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
      <Flex align="center" gap={3} minW={0} flex="1" overflow="hidden" mr={2}>
        <Avatar
          size="sm"
          name={profile?.user.name}
          src={avatarSrc}
          referrerPolicy="no-referrer"
          borderWidth="2px"
          borderColor={getColor('border.header')}
          flexShrink={0}
        />
        <Heading
          size="md"
          color={getColor('text.header')}
          fontFamily={getFont('heading')}
          noOfLines={1}
          minW={0}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          title={profile?.user.family}
        >
          {profile?.user.family}
        </Heading>
      </Flex>

      {/* Lado Direito - Notificações, Moedas e Logout */}
      <Flex align="center" gap={4} flexShrink={0}>
        <NotificationBell />
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
