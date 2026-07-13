import { Button, Flex } from '@chakra-ui/react';
import { useVisualTheme } from '../hooks/useVisualTheme';

export type PillTabItem<T extends string> = {
  id: T;
  label: string;
};

type PillTabBarVariant = 'shopping' | 'family' | 'health';

type PillTabBarProps<T extends string> = {
  tabs: PillTabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  variant?: PillTabBarVariant;
};

function getVariantColors(
  variant: PillTabBarVariant,
  getColor: (path: string) => string,
  isActive: boolean,
) {
  if (variant === 'shopping') {
    return {
      bg: isActive
        ? getColor('background.shoppingList.card')
        : 'transparent',
      color: isActive
        ? getColor('text.shoppingList.title')
        : getColor('text.shoppingList.itemMeta'),
      borderColor: isActive
        ? getColor('text.shoppingList.title')
        : getColor('border.shoppingList.card'),
      hoverBg: getColor('background.shoppingList.cardHover'),
      hoverBorder: getColor('text.shoppingList.primary'),
    };
  }

  if (variant === 'family') {
    return {
      bg: isActive ? getColor('background.profile.secondary') : 'transparent',
      color: isActive
        ? getColor('text.profile.selected')
        : getColor('text.familyGroup.primary'),
      borderColor: isActive
        ? getColor('text.profile.selected')
        : getColor('border.familyGroup.card'),
      hoverBg: getColor('background.profile.secondary'),
      hoverBorder: getColor('text.familyGroup.primary'),
    };
  }

  return {
    bg: isActive ? getColor('background.familyGroup.card') : 'transparent',
    color: isActive
      ? getColor('text.dashboard.title')
      : getColor('text.dashboard.tileSubtitle'),
    borderColor: isActive
      ? getColor('text.familyGroup.primary')
      : getColor('border.familyGroup.card'),
    hoverBg: getColor('background.familyGroup.card'),
    hoverBorder: getColor('text.familyGroup.primary'),
  };
}

export function PillTabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
  variant = 'shopping',
}: PillTabBarProps<T>) {
  const { getColor, getFont } = useVisualTheme();

  return (
    <Flex px={4} gap={2} pt={4} pb={3} flexShrink={0} flexWrap="wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const colors = getVariantColors(variant, getColor, isActive);

        return (
          <Button
            key={tab.id}
            size="xs"
            variant="outline"
            bg={colors.bg}
            color={colors.color}
            borderColor={colors.borderColor}
            borderWidth={isActive ? '2px' : '1px'}
            fontWeight={isActive ? 'bold' : 'normal'}
            fontFamily={getFont('body')}
            onClick={() => onChange(tab.id)}
            _hover={{
              bg: colors.hoverBg,
              borderColor: colors.hoverBorder,
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Flex>
  );
}
