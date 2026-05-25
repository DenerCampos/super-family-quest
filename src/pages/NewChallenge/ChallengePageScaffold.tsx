import {
  Box,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type ChallengePageScaffoldProps = {
  title: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  /** singleCard: um cartão branco envolvendo tudo (padrão). plain: só área útil — use cartões nos filhos. */
  contentLayout?: 'singleCard' | 'plain';
  /** Rota ao voltar (padrão: hub Objetivos). */
  backTo?: string;
  /** Oculta o botão de voltar (ex.: páginas que são destino direto da NavigationBar). */
  hideBack?: boolean;
};

export const ChallengePageScaffold = ({
  title,
  children,
  isLoading = false,
  contentLayout = 'singleCard',
  backTo = '/new-resources/quests',
  hideBack = false,
}: ChallengePageScaffoldProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex
        align="center"
        px={3}
        py={2}
        gap={1}
        bg={getColor('background.familyGroup.card')}
        borderBottomWidth="1px"
        borderColor={getColor('border.familyGroup.card')}
      >
        {!hideBack && (
          <IconButton
            aria-label={t('common.back')}
            icon={<Icon as={FiArrowLeft} boxSize={5} />}
            variant="ghost"
            size="md"
            flexShrink={0}
            onClick={() => navigate(backTo)}
            color={getColor('text.dashboard.title')}
            _hover={{
              bg: getColor('background.familyGroup.memberCard'),
            }}
          />
        )}
        <Text
          flex={1}
          fontWeight="bold"
          fontFamily={getFont('heading')}
          fontSize="md"
          color={getColor('text.dashboard.title')}
          noOfLines={1}
        >
          {title}
        </Text>
      </Flex>
      <Flex
        flex={1}
        direction="column"
        bg={getColor('background.resources')}
        pb={20}
        px={4}
        pt={4}
        overflow="auto"
      >
        {isLoading ? (
          <Flex justify="center" align="center" flex={1}>
            <Spinner color={getColor('text.familyGroup.primary')} />
          </Flex>
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
