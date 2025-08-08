import { Flex, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPieChart, FiPlusSquare, FiUser } from 'react-icons/fi';
import { GrResources } from 'react-icons/gr';
import { useThemedTranslation } from '../hooks/useThemedTranslation';

export const NavigationBar = () => {
  const { t } = useThemedTranslation();
  const activeColor = useColorModeValue('purple.500', 'purple.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      justify="space-around"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="purple.900"
      p={2}
      boxShadow="lg"
      borderTopWidth="1px"
      borderTopColor="purple.700"
    >
      <NavLink to="/home">
        {({ isActive }) => (
          <Flex direction="column" align="center" gap={1} flexGrow={1}>
            <IconButton
              icon={<FiHome />}
              aria-label="Home"
              variant="ghost"
              color={isActive ? activeColor : inactiveColor}
              fontSize="24px"
              isActive={isActive}
            />
            <Text fontSize="xs" color={isActive ? activeColor : inactiveColor}>
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
              color={isActive ? activeColor : inactiveColor}
              fontSize="24px"
              isActive={isActive}
            />
            <Text fontSize="xs" color={isActive ? activeColor : inactiveColor}>
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
              color={isActive ? activeColor : inactiveColor}
              fontSize="24px"
              isActive={isActive}
            />
            <Text fontSize="xs" color={isActive ? activeColor : inactiveColor}>
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
              color={isActive ? activeColor : inactiveColor}
              fontSize="24px"
              isActive={isActive}
            />
            <Text fontSize="xs" color={isActive ? activeColor : inactiveColor}>
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
              color={isActive ? activeColor : inactiveColor}
              fontSize="24px"
              isActive={isActive}
            />
            <Text fontSize="xs" color={isActive ? activeColor : inactiveColor}>
              {t('navigationBar.profile')}
            </Text>
          </Flex>
        )}
      </NavLink>
    </Flex>
  );
};
