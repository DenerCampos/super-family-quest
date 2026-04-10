import { Flex, Text, Checkbox, IconButton } from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { ShoppingListItemResponse, ShoppingListItemUnit } from '../../types/shoppingList';

interface ShoppingListItemRowProps {
  item: ShoppingListItemResponse;
  onToggle: (itemId: string) => void;
  onEdit: (item: ShoppingListItemResponse) => void;
  onDelete: (itemId: string) => void;
  isToggling?: boolean;
  isDisabled?: boolean;
}

function formatUnit(unit: ShoppingListItemUnit): string {
  const labels: Record<ShoppingListItemUnit, string> = {
    un: 'un',
    kg: 'kg',
    g: 'g',
    l: 'L',
    ml: 'ml',
    pack: 'pct',
    dz: 'dz',
  };
  return labels[unit] || unit;
}

export const ShoppingListItemRow = ({
  item,
  onToggle,
  onEdit,
  onDelete,
  isToggling = false,
  isDisabled = false,
}: ShoppingListItemRowProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const isInCart = item.status === 'in_cart';

  return (
    <Flex
      align="center"
      py={2}
      px={3}
      bg={
        isInCart
          ? getColor('background.shoppingList.itemInCart')
          : getColor('background.shoppingList.itemPending')
      }
      borderRadius="8px"
      gap={2}
      _hover={{ boxShadow: 'sm' }}
    >
      <Checkbox
        isChecked={isInCart}
        onChange={() => onToggle(item.id)}
        isDisabled={isToggling || isDisabled}
        colorScheme="green"
        size="lg"
        borderColor={
          isInCart
            ? getColor('border.shoppingList.checkbox.inCart')
            : getColor('border.shoppingList.checkbox.pending')
        }
      />

      <Flex direction="column" flex={1} minW={0}>
        <Flex align="center" gap={2}>
          <Text
            fontSize="sm"
            fontWeight={isInCart ? 'normal' : 'medium'}
            fontFamily={getFont('body')}
            color={
              isInCart
                ? getColor('text.shoppingList.itemNameChecked')
                : getColor('text.shoppingList.itemName')
            }
            textDecoration={isInCart ? 'line-through' : 'none'}
            noOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            fontSize="xs"
            color={getColor('text.shoppingList.itemMeta')}
            fontFamily={getFont('body')}
            flexShrink={0}
          >
            {item.quantity} {formatUnit(item.unit)}
          </Text>
        </Flex>

        <Text
          fontSize="xs"
          color={getColor('text.shoppingList.itemMeta')}
          fontFamily={getFont('body')}
          noOfLines={1}
        >
          {isInCart && item.checkedBy
            ? t('shoppingList.detail.checkedBy', {
                addedBy: item.addedBy?.name || '',
                checkedBy: item.checkedBy.name,
              })
            : t('shoppingList.detail.addedBy', {
                name: item.addedBy?.name || '',
              })}
        </Text>
      </Flex>

      <Flex gap={1} flexShrink={0}>
        <IconButton
          aria-label={t('shoppingList.item.edit')}
          icon={<FiEdit2 size={14} />}
          size="xs"
          variant="ghost"
          color={getColor('text.shoppingList.secondary')}
          onClick={() => onEdit(item)}
          isDisabled={isDisabled}
        />
        <IconButton
          aria-label={t('shoppingList.item.delete')}
          icon={<FiTrash2 size={14} />}
          size="xs"
          variant="ghost"
          color={getColor('text.shoppingList.secondary')}
          onClick={() => onDelete(item.id)}
          isDisabled={isDisabled}
        />
      </Flex>
    </Flex>
  );
};
