import { Box, Flex, Spinner } from '@chakra-ui/react';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { PageTitleBar } from './PageTitleBar';
import { useVisualTheme } from '../hooks/useVisualTheme';

type PageScaffoldProps = {
  title?: string;
  backTo?: string;
  hideBack?: boolean;
  titleRight?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  /** singleCard: cartão branco central. plain: área útil sem cartão. none: filhos diretos. */
  contentLayout?: 'singleCard' | 'plain' | 'none';
  bg?: string;
  contentPx?: number;
  contentPt?: number;
};

export const PageScaffold = ({
  title,
  backTo,
  hideBack = false,
  titleRight,
  headerExtra,
  children,
  isLoading = false,
  contentLayout = 'plain',
  bg,
  contentPx = 4,
  contentPt = 4,
}: PageScaffoldProps) => {
  const { getColor } = useVisualTheme();
  const background = bg ?? getColor('background.resources');

  const showTitleBar = Boolean(title);

  return (
    <Flex direction="column" h="100vh" overflow="hidden" bg={background}>
      <Header />

      {showTitleBar && (
        <PageTitleBar
          title={title!}
          backTo={backTo}
          hideBack={hideBack}
          titleRight={titleRight}
        />
      )}

      {headerExtra}

      <Flex
        flex={1}
        direction="column"
        overflow="auto"
        bg={background}
        px={contentLayout === 'none' ? 0 : contentPx}
        pt={contentLayout === 'none' ? 0 : contentPt}
        pb={20}
        minH={0}
      >
        {isLoading ? (
          <Flex justify="center" align="center" flex={1}>
            <Spinner color={getColor('text.familyGroup.primary')} />
          </Flex>
        ) : contentLayout === 'none' ? (
          children
        ) : contentLayout === 'plain' ? (
          <Box maxW="600px" width="100%" mx="auto">
            {children}
          </Box>
        ) : (
          <Box
            maxW="600px"
            width="100%"
            mx="auto"
            bg={getColor('background.familyGroup.card')}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={getColor('border.familyGroup.card')}
            p={{ base: 4, md: 5 }}
            boxShadow="sm"
          >
            {children}
          </Box>
        )}
      </Flex>

      <NavigationBar />
    </Flex>
  );
};
