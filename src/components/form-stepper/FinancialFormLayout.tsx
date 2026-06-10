import { Box, Flex } from '@chakra-ui/react';

type Props = {
  stepper: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
};

/** Stepper fixo no topo, miolo rolável (ou swipe), ações fixas no rodapé. */
export const FinancialFormLayout = ({ stepper, content, footer }: Props) => {
  return (
    <Flex direction="column" flex="1" minH={0} h="full">
      <Box flexShrink={0} pb={2}>
        {stepper}
      </Box>

      <Flex flex="1" minH={0} direction="column" overflow="hidden">
        {content}
      </Flex>

      {footer}
    </Flex>
  );
};
