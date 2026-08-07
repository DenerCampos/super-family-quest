import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import {
  groupByFamilyGroup,
  type FamilyGroupRef,
} from '../../utils/groupByFamilyGroup';

type FamilyGroupedListProps<T> = {
  items: T[];
  getFamily: (item: T) => FamilyGroupRef;
  familyOrder?: { id: string; name: string }[];
  getItemKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Se true, abre todas as seções por padrão. */
  defaultExpanded?: boolean;
};

export function FamilyGroupedList<T>({
  items,
  getFamily,
  familyOrder = [],
  getItemKey,
  renderItem,
  defaultExpanded = true,
}: FamilyGroupedListProps<T>) {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const sections = useMemo(
    () => groupByFamilyGroup(items, getFamily, familyOrder),
    [items, getFamily, familyOrder],
  );

  if (sections.length === 0) return null;

  if (sections.length === 1 && sections[0].familyGroupId === null) {
    return (
      <VStack spacing={3} align="stretch">
        {sections[0].items.map((item) => (
          <Box key={getItemKey(item)}>{renderItem(item)}</Box>
        ))}
      </VStack>
    );
  }

  const defaultIndex = defaultExpanded
    ? sections.map((_, index) => index)
    : [0];

  return (
    <Accordion allowMultiple defaultIndex={defaultIndex}>
      {sections.map((section) => {
        const title =
          section.name ?? t('familyGroup.personalSection');
        return (
          <AccordionItem
            key={section.key}
            border="1px solid"
            borderColor={getColor('border.familyGroup.card')}
            borderRadius="md"
            mb={2}
            bg={getColor('background.familyGroup.card')}
          >
            <AccordionButton
              py={3}
              _expanded={{
                bg: getColor('background.familyGroup.memberCard'),
              }}
            >
              <Box flex="1" textAlign="left">
                <Text
                  fontWeight="bold"
                  fontFamily={getFont('heading')}
                  color={getColor('text.familyGroup.title')}
                >
                  {title}
                </Text>
                <Text
                  fontSize="xs"
                  color={getColor('text.familyGroup.secondary')}
                >
                  {t('familyGroup.sectionItemCount', {
                    count: section.items.length,
                  })}
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={3} px={3}>
              <VStack spacing={3} align="stretch">
                {section.items.map((item) => (
                  <Box key={getItemKey(item)}>{renderItem(item)}</Box>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
