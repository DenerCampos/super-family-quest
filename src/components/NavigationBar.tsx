import { Flex, IconButton, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPieChart, FiPlusSquare, FiUser } from 'react-icons/fi';
import { GrResources } from 'react-icons/gr';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';

export const NavigationBar = () => {
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();

  return (
    <Flex
      justify="space-around"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={getColor('background.navigation')}
      p={2}
      boxShadow="lg"
      borderTopWidth="1px"
      borderTopColor={getColor('border.primary')}
    >
      <NavLink to="/home">
        {({ isActive }) => (
          <Flex direction="column" align="center" gap={1} flexGrow={1}>
            <IconButton
              icon={<FiHome />}
              aria-label="Home"
              variant="ghost"
              color={
                isActive ? getColor('text.accent') : getColor('text.navigation')
              }
              fontSize="24px"
              isActive={isActive}
              _hover={{
                color: getColor('text.link'),
              }}
            />
            <Text
              fontSize="xs"
              color={
                isActive
                  ? getColor('text.navigation')
                  : getColor('text.navigation')
              }
              fontFamily={getFont('body')}
            >
              {t('navigationBar.home')}
            </Text>
          </Flex>
        )}
      </NavLink>

      <NavLink to="/dashboard">
        {({ isActive }) => (
          <Flex direction="column" align="center" gap={1} flexGrow={1}>
            <IconButton
              icon={<FiPieChart />}
              aria-label="Dashboard"
              variant="ghost"
              color={
                isActive ? getColor('text.accent') : getColor('text.navigation')
              }
              fontSize="24px"
              isActive={isActive}
              _hover={{
                color: getColor('text.link'),
              }}
            />
            <Text
              fontSize="xs"
              color={
                isActive
                  ? getColor('text.navigation')
                  : getColor('text.navigation')
              }
              fontFamily={getFont('body')}
            >
              {t('navigationBar.dashboard')}
            </Text>
          </Flex>
        )}
      </NavLink>

      <NavLink to="/new-resources">
        {({ isActive }) => (
          <Flex direction="column" align="center" gap={1} flexGrow={1}>
            <IconButton
              icon={<GrResources />}
              aria-label="Novo recurso"
              variant="ghost"
              color={
                isActive ? getColor('text.accent') : getColor('text.navigation')
              }
              fontSize="24px"
              isActive={isActive}
              _hover={{
                color: getColor('text.link'),
              }}
            />
            <Text
              fontSize="xs"
              color={
                isActive
                  ? getColor('text.navigation')
                  : getColor('text.navigation')
              }
              fontFamily={getFont('body')}
            >
              {t('navigationBar.resources')}
            </Text>
          </Flex>
        )}
      </NavLink>

      <NavLink to="/new-challenge">
        {({ isActive }) => (
          <Flex direction="column" align="center" gap={1} flexGrow={1}>
            <IconButton
              icon={<FiPlusSquare />}
              aria-label="Novo desafio"
              variant="ghost"
              color={
                isActive ? getColor('text.accent') : getColor('text.navigation')
              }
              fontSize="24px"
              isActive={isActive}
              _hover={{
                color: getColor('text.link'),
              }}
            />
            <Text
              fontSize="xs"
              color={
                isActive
                  ? getColor('text.navigation')
                  : getColor('text.navigation')
              }
              fontFamily={getFont('body')}
            >
              {t('navigationBar.challenges')}
            </Text>
          </Flex>
        )}
      </NavLink>

      <NavLink to="/profile">
        {({ isActive }) => (
          <Flex direction="column" align="center" gap={1} flexGrow={1}>
            <IconButton
              icon={<FiUser />}
              aria-label="Perfil"
              variant="ghost"
              color={
                isActive ? getColor('text.accent') : getColor('text.navigation')
              }
              fontSize="24px"
              isActive={isActive}
              _hover={{
                color: getColor('text.link'),
              }}
            />
            <Text
              fontSize="xs"
              color={
                isActive
                  ? getColor('text.navigation')
                  : getColor('text.navigation')
              }
              fontFamily={getFont('body')}
            >
              {t('navigationBar.profile')}
            </Text>
          </Flex>
        )}
      </NavLink>
    </Flex>
  );
};
