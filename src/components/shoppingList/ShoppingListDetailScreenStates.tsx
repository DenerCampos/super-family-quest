import { Flex, Text } from '@chakra-ui/react';
import { FixedAppShell } from '../FixedAppShell';
import { LoadingOverlay } from '../LoadingOverlay';

type LoadingProps = {
  getColor: (path: string) => string;
  loadingText: string;
};

export const ShoppingListDetailLoading = ({
  getColor,
  loadingText,
}: LoadingProps) => (
  <FixedAppShell bg={getColor('background.shoppingList.primary')}>
    <LoadingOverlay typeLoading="read" text={loadingText} />
    <Flex flex={1} />
  </FixedAppShell>
);

type ErrorProps = {
  getColor: (path: string) => string;
  message: string;
};

export const ShoppingListDetailErrorState = ({
  getColor,
  message,
}: ErrorProps) => (
  <FixedAppShell bg={getColor('background.shoppingList.primary')}>
    <Flex flex={1} justify="center" align="center" px={4}>
      <Text color={getColor('text.shoppingList.primary')}>{message}</Text>
    </Flex>
  </FixedAppShell>
);
