import {
  Flex,
  IconButton,
  Text,
  VStack,
  Spinner,
  Box,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { AddItemInput } from '../../components/shoppingList/AddItemInput';
import { ShoppingListItemRow } from '../../components/shoppingList/ShoppingListItemRow';
import { OnlineUsersIndicator } from '../../components/shoppingList/OnlineUsersIndicator';
import { EditShoppingListItemModal } from '../../components/modals/EditShoppingListItemModal';
import { useShoppingListDetail } from '../../hooks/useShoppingListDetail';
import { useShoppingListSocket } from '../../hooks/useShoppingListSocket';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useState } from 'react';
import type {
  ShoppingListItemResponse,
  CreateShoppingListItemPayload,
  UpdateShoppingListItemPayload,
} from '../../types/shoppingList';

export const ShoppingListDetailView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] =
    useState<ShoppingListItemResponse | null>(null);
  const [togglingItems, setTogglingItems] = useState<Set<string>>(new Set());

  const {
    detail,
    isLoading,
    addItem,
    updateItem,
    toggleItem,
    removeItem,
    completeList,
    handleItemAdded,
    handleItemUpdated,
    handleItemToggled,
    handleItemRemoved,
    handleListCompleted,
  } = useShoppingListDetail(id || '');

  const token = localStorage.getItem('accessToken') || '';

  const { onlineUsers } = useShoppingListSocket({
    listId: id || '',
    token,
    onItemAdded: handleItemAdded,
    onItemUpdated: handleItemUpdated,
    onItemToggled: handleItemToggled,
    onItemRemoved: handleItemRemoved,
    onListCompleted: handleListCompleted,
  });

  const handleAddItem = async (payload: CreateShoppingListItemPayload) => {
    try {
      await addItem(payload);
    } catch {
      toast({
        title: t('shoppingList.item.addError'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleToggle = async (itemId: string) => {
    setTogglingItems((prev) => new Set(prev).add(itemId));
    try {
      await toggleItem(itemId);
    } catch {
      toast({
        title: t('shoppingList.item.toggleError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setTogglingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleEdit = (item: ShoppingListItemResponse) => {
    setEditingItem(item);
    onOpen();
  };

  const handleSaveEdit = async (
    itemId: string,
    payload: UpdateShoppingListItemPayload,
  ) => {
    try {
      await updateItem(itemId, payload);
    } catch {
      toast({
        title: t('shoppingList.item.editError'),
        status: 'error',
        duration: 3000,
      });
      throw new Error('Failed to edit item');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!globalThis.confirm(t('shoppingList.item.deleteConfirm'))) return;
    try {
      await removeItem(itemId);
    } catch {
      toast({
        title: t('shoppingList.item.deleteError'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleFinishList = async () => {
    if (!globalThis.confirm(t('shoppingList.detail.finishListConfirm'))) return;
    try {
      await completeList();
      toast({
        title: t('shoppingList.detail.listCompleted'),
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: t('shoppingList.detail.listCompletedError'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const isCompleted = detail?.status === 'completed';

  if (isLoading) {
    return (
      <Flex
        direction="column"
        minH="100vh"
        bg={getColor('background.shoppingList.primary')}
      >
        <Header />
        <Flex flex={1} justify="center" align="center">
          <Spinner
            color={getColor('text.shoppingList.primary')}
            size="lg"
          />
        </Flex>
        <NavigationBar />
      </Flex>
    );
  }

  if (!detail) {
    return (
      <Flex
        direction="column"
        minH="100vh"
        bg={getColor('background.shoppingList.primary')}
      >
        <Header />
        <Flex flex={1} justify="center" align="center">
          <Text color={getColor('text.shoppingList.primary')}>
            {t('common.loadError')}
          </Text>
        </Flex>
        <NavigationBar />
      </Flex>
    );
  }

  const categories = Object.entries(detail.itemsByCategory);

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={getColor('background.shoppingList.primary')}
      pb="70px"
    >
      <Header />

      <Flex
        align="center"
        justify="space-between"
        px={4}
        pt={4}
        pb={1}
      >
        <Flex align="center" gap={3}>
          <IconButton
            aria-label={t('common.back')}
            icon={<FiArrowLeft />}
            variant="ghost"
            color={getColor('text.shoppingList.title')}
            onClick={() => navigate('/new-resources/shopping')}
            size="sm"
          />
          <Text
            fontSize="lg"
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.shoppingList.title')}
            noOfLines={1}
          >
            {detail.name}
          </Text>
        </Flex>
      </Flex>

      <Box px={4} pb={2}>
        <OnlineUsersIndicator users={onlineUsers} />
      </Box>

      {!isCompleted && (
        <Box px={4} pb={3}>
          <AddItemInput onAdd={handleAddItem} isDisabled={isCompleted} />
        </Box>
      )}

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
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isToggling={togglingItems.has(item.id)}
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
            onClick={handleFinishList}
            _hover={{ opacity: 0.8 }}
          >
            {t('shoppingList.detail.finishList')}
          </Button>
        </Box>
      )}

      <EditShoppingListItemModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditingItem(null);
        }}
        item={editingItem}
        onSave={handleSaveEdit}
      />

      <NavigationBar />
    </Flex>
  );
};
