import { Flex, IconButton, Text, Box } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import { AddItemInput } from '../../components/shoppingList/AddItemInput';
import {
  ShoppingListDetailCategoriesPanel,
} from '../../components/shoppingList/ShoppingListDetailCategoriesPanel';
import {
  ShoppingListDetailErrorState,
  ShoppingListDetailLoading,
} from '../../components/shoppingList/ShoppingListDetailScreenStates';
import { OnlineUsersIndicator } from '../../components/shoppingList/OnlineUsersIndicator';
import { EditShoppingListItemModal } from '../../components/modals/EditShoppingListItemModal';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useShoppingListDetailPage } from '../../hooks/useShoppingListDetailPage';
import { useVisualTheme } from '../../hooks/useVisualTheme';

export const ShoppingListDetailView = () => {
  const { getColor, getFont } = useVisualTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const listId = id || '';

  const {
    detail,
    isLoading,
    onlineUsers,
    isCompleted,
    togglingItems,
    editingItem,
    isOpen,
    t,
    handleAddItem,
    handleAddBulk,
    handleToggle,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleFinishList,
    handleFinishAndCreateRemaining,
    handleRecreateList,
    handleCloseEditModal,
    canFinishWithRemaining,
    pendingListAction,
    isListActionPending,
    listActionLoadingText,
  } = useShoppingListDetailPage(listId);

  if (isLoading) {
    return (
      <ShoppingListDetailLoading
        getColor={getColor}
        loadingText={t('shoppingList.loadingLists')}
      />
    );
  }

  if (!detail) {
    return (
      <ShoppingListDetailErrorState
        getColor={getColor}
        message={t('common.loadError')}
      />
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
      {isListActionPending && (
        <LoadingOverlay typeLoading="save" text={listActionLoadingText} />
      )}

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
          <AddItemInput
            onAdd={handleAddItem}
            onAddBulk={handleAddBulk}
            isDisabled={isCompleted}
          />
        </Box>
      )}

      <ShoppingListDetailCategoriesPanel
        categories={categories}
        isCompleted={isCompleted}
        canFinishWithRemaining={canFinishWithRemaining}
        pendingListAction={pendingListAction}
        getColor={getColor}
        getFont={getFont}
        t={t}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        togglingItemIds={togglingItems}
        onFinishList={handleFinishList}
        onFinishAndCreateRemaining={handleFinishAndCreateRemaining}
        onRecreateList={handleRecreateList}
      />

      <EditShoppingListItemModal
        isOpen={isOpen}
        onClose={handleCloseEditModal}
        item={editingItem}
        onSave={handleSaveEdit}
      />

      <NavigationBar />
    </Flex>
  );
};
