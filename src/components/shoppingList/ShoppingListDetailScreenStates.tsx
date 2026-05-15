import { Flex, Spinner, Text } from '@chakra-ui/react';
import { Header } from '../Header';
import { NavigationBar } from '../NavigationBar';

type Props = {
  getColor: (path: string) => string;
};

export const ShoppingListDetailLoading = ({ getColor }: Props) => (
  <Flex
    direction="column"
    minH="100vh"
    bg={getColor('background.shoppingList.primary')}
  >
    <Header />
    <Flex flex={1} justify="center" align="center">
      <Spinner color={getColor('text.shoppingList.primary')} size="lg" />
    </Flex>
    <NavigationBar />
  </Flex>
);

type ErrorProps = Props & {
  message: string;
};

export const ShoppingListDetailErrorState = ({
  getColor,
  message,
}: ErrorProps) => (
  <Flex
    direction="column"
    minH="100vh"
    bg={getColor('background.shoppingList.primary')}
  >
    <Header />
    <Flex flex={1} justify="center" align="center">
      <Text color={getColor('text.shoppingList.primary')}>{message}</Text>
    </Flex>
    <NavigationBar />
  </Flex>
);
