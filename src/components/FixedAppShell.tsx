import { Flex } from '@chakra-ui/react';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { useVisualTheme } from '../hooks/useVisualTheme';

type FixedAppShellProps = {
  children: React.ReactNode;
  bg?: string;
};

/** Header + conteúdo flexível + NavigationBar fixos; use h="100vh" internamente. */
export const FixedAppShell = ({ children, bg }: FixedAppShellProps) => {
  const { getColor } = useVisualTheme();

  return (
    <Flex
      direction="column"
      h="100vh"
      overflow="hidden"
      bg={bg ?? getColor('background.resources')}
    >
      <Header />
      {children}
      <NavigationBar />
    </Flex>
  );
};
