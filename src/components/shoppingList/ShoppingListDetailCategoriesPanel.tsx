import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ShoppingListItemRow } from './ShoppingListItemRow';
import type { ShoppingListItemResponse } from '../../types/shoppingList';

type Props = {
  categories: [string, ShoppingListItemResponse[]][];
  isCompleted: boolean;
  getColor: (path: string) => string;
  getFont: (type: 'body' | 'heading' | 'mono' | 'theme') => string;
  t: (key: string) => string;
  onToggle: (itemId: string) => void;
  onEdit: (item: ShoppingListItemResponse) => void;
  onDelete: (itemId: string) => void;
  togglingItemIds: Set<string>;
  onFinishList: () => void;
};

export const ShoppingListDetailCategoriesPanel = ({
  categories,
  isCompleted,
  getColor,
  getFont,
  t,
  onToggle,
  onEdit,
  onDelete,
  togglingItemIds,
  onFinishList,
}: Props) => (
  <>
    <Box flex={1} px={4} overflowY="auto">
      {categories.length === 0 ? (
        <VStack spacing={3} py={10}>
          <Text
            fontSize="md"
            color={getColor('text.shoppingList.primary')}
            fontFamily={getFont('body')}
            textAlign="center"
          >
            {t('shoppingList.detail.noItems')}
          </Text>
          <Text
            fontSize="sm"
            color={getColor('text.shoppingList.itemMeta')}
            fontFamily={getFont('body')}
            textAlign="center"
          >
            {t('shoppingList.detail.noItemsDescription')}
          </Text>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {categories.map(([category, items]) => (
            <Box key={category}>
              <Flex
                align="center"
                bg={getColor('background.shoppingList.categoryHeader')}
                px={3}
                py={1.5}
                borderRadius="8px"
                mb={2}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  color={getColor('text.shoppingList.categoryTitle')}
                  fontFamily={getFont('body')}
                  letterSpacing="wide"
                >
                  {category}
                </Text>
                <Text
                  fontSize="xs"
                  color={getColor('text.shoppingList.itemMeta')}
                  fontFamily={getFont('body')}
                  ml={2}
                >
                  ({items.length})
                </Text>
              </Flex>

              <VStack spacing={1.5} align="stretch">
                {items.map((item) => (
                  <ShoppingListItemRow
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isToggling={togglingItemIds.has(item.id)}
                    isDisabled={isCompleted}
                  />
                ))}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>

    {!isCompleted && categories.length > 0 && (
      <Box px={4} py={3}>
        <Button
          w="full"
          bg={getColor('button.background.revenue')}
          color={getColor('button.text.revenue')}
          fontFamily={getFont('body')}
          onClick={onFinishList}
          _hover={{ opacity: 0.8 }}
        >
          {t('shoppingList.detail.finishList')}
        </Button>
      </Box>
    )}
  </>
);
