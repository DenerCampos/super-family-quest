import { Flex, Text } from '@chakra-ui/react';
import { Header } from '../Header';
import { LoadingOverlay } from '../LoadingOverlay';
import { NavigationBar } from '../NavigationBar';

type LoadingProps = {
  getColor: (path: string) => string;
  loadingText: string;
};

export const ShoppingListDetailLoading = ({
  getColor,
  loadingText,
}: LoadingProps) => (
  <Flex
    direction="column"
    minH="100vh"
    bg={getColor('background.shoppingList.primary')}
  >
    <LoadingOverlay typeLoading="read" text={loadingText} />
    <Header />
    <Flex flex={1} />
    <NavigationBar />
  </Flex>
);

type ErrorProps = {
  getColor: (path: string) => string;
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
