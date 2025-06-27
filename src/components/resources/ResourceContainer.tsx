import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from '@chakra-ui/react';

interface ResourceContainerProps {
  title: string;
  colorScheme: string;
  children: React.ReactNode;
}

const ResourceContainer = ({
  title,
  colorScheme,
  children,
}: ResourceContainerProps) => {
  return (
    <AccordionItem
      borderWidth={1}
      borderRadius="md"
      mb={4}
      borderColor={`${colorScheme}.200`}
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <AccordionButton
        bg={`${colorScheme}.50`}
        _hover={{
          bg: `${colorScheme}.100`,
          transform: 'translateY(-1px)',
        }}
        _expanded={{
          bg: `${colorScheme}.100`,
          borderBottomColor: `${colorScheme}.200`,
        }}
        borderRadius="md"
        p={4}
        transition="all 0.2s"
      >
        <Box flex="1" textAlign="left">
          <Text fontWeight="bold" fontSize="md" color={`${colorScheme}.700`}>
            {title}
          </Text>
        </Box>
        <AccordionIcon color={`${colorScheme}.600`} />
      </AccordionButton>
      <AccordionPanel pb={4} pt={4} bg="white" borderBottomRadius="md">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ResourceContainer;
