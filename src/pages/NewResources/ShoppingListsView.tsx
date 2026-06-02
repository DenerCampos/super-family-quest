import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { PageScaffold } from '../../components/PageScaffold';
import { ShoppingListCard } from '../../components/shoppingList/ShoppingListCard';
import { CreateShoppingListModal } from '../../components/modals/CreateShoppingListModal';
import { useShoppingLists } from '../../hooks/useShoppingLists';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import type {
  CreateShoppingListPayload,
  ShoppingListStatus,
} from '../../types/shoppingList';

const STATUS_TABS: ShoppingListStatus[] = ['active', 'completed', 'archived'];

export const ShoppingListsView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [familyGroups, setFamilyGroups] = useState<{ id: string; name: string }[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const { lists, isLoading, status, changeStatus, createList, deleteList } =
    useShoppingLists();

  useEffect(() => {
    api.familyGroupList()
      .then((groups) => {
        if (groups.length > 0) {
          setFamilyGroups(groups.map((g) => ({ id: g.id, name: g.name })));
        }
      })
      .catch(() => setFamilyGroups([]));
  }, []);

  const handleCreate = async (payload: CreateShoppingListPayload) => {
    try {
      await createList(payload);
      toast({
        title: t('common.created'),
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: t('shoppingList.createModal.createError'),
        status: 'error',
        duration: 3000,
      });
      throw new Error('Failed to create list');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    if (!globalThis.confirm(t('shoppingList.deleteListConfirm'))) return;
    setIsDeleting(true);
    try {
      await deleteList(id);
      toast({
        title: t('common.deleted'),
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: t('shoppingList.deleteListError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {(isLoading || isDeleting) && (
        <LoadingOverlay
          typeLoading={isDeleting ? 'save' : 'read'}
          text={
            isDeleting
              ? t('shoppingList.deletingList')
              : t('shoppingList.loadingLists')
          }
        />
      )}

      <PageScaffold
        title={t('shoppingList.title')}
        backTo="/new-resources"
        bg={getColor('background.shoppingList.primary')}
        contentLayout="plain"
        contentPx={0}
        contentPt={4}
        titleRight={
          <IconButton
            aria-label={t('shoppingList.createNew')}
            icon={<FiPlus />}
            onClick={onOpen}
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            _hover={{ opacity: 0.8 }}
            size="sm"
            borderRadius="full"
          />
        }
        headerExtra={
          <Flex px={4} gap={2} pt={4} pb={3} flexShrink={0}>
            {STATUS_TABS.map((s) => (
              <Button
                key={s}
                size="xs"
                variant="outline"
                bg={
                  status === s
                    ? getColor('background.shoppingList.card')
                    : 'transparent'
                }
                color={
                  status === s
                    ? getColor('text.shoppingList.title')
                    : getColor('text.shoppingList.itemMeta')
                }
                borderColor={
                  status === s
                    ? getColor('text.shoppingList.title')
                    : getColor('border.shoppingList.card')
                }
                borderWidth={status === s ? '2px' : '1px'}
                fontWeight={status === s ? 'bold' : 'normal'}
                fontFamily={getFont('body')}
                onClick={() => changeStatus(s)}
                _hover={{
                  bg: getColor('background.shoppingList.cardHover'),
                  borderColor: getColor('text.shoppingList.primary'),
                }}
              >
                {t(`shoppingList.status.${s}`)}
              </Button>
            ))}
          </Flex>
        }
      >
        <Box px={4}>
          {!isLoading && lists.length === 0 ? (
            <VStack spacing={3} py={10}>
              <Text
                fontSize="md"
                color={getColor('text.shoppingList.primary')}
                fontFamily={getFont('body')}
                textAlign="center"
              >
                {t('shoppingList.emptyState')}
              </Text>
              <Text
                fontSize="sm"
                color={getColor('text.shoppingList.itemMeta')}
                fontFamily={getFont('body')}
                textAlign="center"
              >
                {t('shoppingList.emptyStateDescription')}
              </Text>
              <Button
                mt={2}
                onClick={onOpen}
                bg={getColor('button.background.primary')}
                color={getColor('button.text.primary')}
                fontFamily={getFont('body')}
                leftIcon={<FiPlus />}
                _hover={{ opacity: 0.8 }}
              >
                {t('shoppingList.createNew')}
              </Button>
            </VStack>
          ) : (
            <VStack spacing={3} align="stretch">
              {lists.map((list) => (
                <ShoppingListCard
                  key={list.id}
                  list={list}
                  onClick={() =>
                    navigate(`/new-resources/shopping/${list.id}`)
                  }
                  onDelete={handleDelete}
                />
              ))}
            </VStack>
          )}
        </Box>
      </PageScaffold>

      <CreateShoppingListModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleCreate}
        familyGroups={familyGroups}
      />
    </>
  );
};
