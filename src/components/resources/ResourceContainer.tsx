import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';

interface ResourceContainerProps {
  title: string;
  colorScheme: string;
  count?: number | null;
  children: React.ReactNode;
}

const ResourceContainer = ({
  title,
  colorScheme,
  count,
  children,
}: ResourceContainerProps) => {
  const { getColor } = useVisualTheme();

  return (
    <AccordionItem
      borderWidth={1}
      borderRadius="md"
      mb={4}
      borderColor={`${colorScheme}.500`}
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
        <Flex flex="1" textAlign="left" align="center" gap={2}>
          <Text fontWeight="bold" fontSize="md" color={`${colorScheme}.700`}>
            {title}
          </Text>
          {count != null && count >= 0 && (
            <Badge
              bg={`${colorScheme}.500`}
              color={getColor('text.resourceTable.badgeCount')}
              borderRadius="full"
              px={2}
              fontSize="xs"
              minW="22px"
              textAlign="center"
            >
              {count}
            </Badge>
          )}
        </Flex>
        <AccordionIcon color={`${colorScheme}.600`} />
      </AccordionButton>
      <AccordionPanel
        pb={4}
        pt={4}
        bg={getColor('background.resourceTable.panel')}
        borderBottomRadius="md"
      >
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ResourceContainer;
