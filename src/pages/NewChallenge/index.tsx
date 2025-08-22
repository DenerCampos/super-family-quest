import { Flex, Text } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { NavigationBar } from "../../components/NavigationBar";
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

const NewChallenge = () => {
  const { getColor, getAsset, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        flex={1}
        bgImage={`url(${getAsset('images.background.underConstruction')})`}
        bgSize="cover"
        bgPosition="center"
        align="center"
        justify="center"
      >
        <Flex
          bg={getColor('background.login')}
          p={8}
          borderRadius="lg"
          align="center"
          justify="center"
          backdropFilter="blur(4px)"
          minW="300px"
          minH="200px"
        >
          <Text
            fontSize="2xl"
            color={getColor('text.primary')}
            textAlign="center"
            fontFamily={getFont('theme')}
          >
            {t('newChallenge.development')}
          </Text>
        </Flex>
      </Flex>

      <NavigationBar />
    </Flex>
  );
};

export default NewChallenge;