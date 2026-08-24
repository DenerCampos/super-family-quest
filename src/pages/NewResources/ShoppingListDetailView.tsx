import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { PageScaffold } from '../../components/PageScaffold';
import { ShareTextButton } from '../../components/ShareTextButton';
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
import { formatShoppingListShare } from '../../utils/formatShoppingListShare';

export const ShoppingListDetailView = () => {
  const { getColor, getFont } = useVisualTheme();
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
  const sharePayload = formatShoppingListShare(detail, t);

  return (
    <>
      {isListActionPending && (
        <LoadingOverlay typeLoading="save" text={listActionLoadingText} />
      )}

      <PageScaffold
        title={detail.name}
        backTo="/new-resources/shopping"
        bg={getColor('background.shoppingList.primary')}
        contentLayout="none"
        contentPx={0}
        contentPt={0}
        titleRight={<ShareTextButton payload={sharePayload} />}
        headerExtra={
          <>
            <Box px={4} pb={2} flexShrink={0}>
              <OnlineUsersIndicator users={onlineUsers} />
            </Box>
            {!isCompleted && (
              <Box px={4} pb={3} flexShrink={0}>
                <AddItemInput
                  onAdd={handleAddItem}
                  onAddBulk={handleAddBulk}
                  isDisabled={isCompleted}
                />
              </Box>
            )}
          </>
        }
      >
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
      </PageScaffold>

      <EditShoppingListItemModal
        isOpen={isOpen}
        onClose={handleCloseEditModal}
        item={editingItem}
        onSave={handleSaveEdit}
      />
    </>
  );
};
