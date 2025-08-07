import { Flex, Text } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { NavigationBar } from "../../components/NavigationBar";
import { useThemeTranslation } from "../../hooks/useThemeTranslation";

const NewChallenge = () => {
  const { t } = useThemeTranslation();
  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        flex={1}
        bgImage="url('/assets/images/under-construction-bg.png')"
        bgSize="cover"
        bgPosition="center"
        align="center"
        justify="center"
      >
        <Flex
          bg="rgba(23, 25, 35, 0.8)"
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
            color="purple.300"
            textAlign="center"
            fontFamily="Pixelify Sans"
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