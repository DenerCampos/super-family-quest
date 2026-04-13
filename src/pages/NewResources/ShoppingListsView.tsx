import {
  Flex,
  IconButton,
  Text,
  VStack,
  Spinner,
  Button,
  useDisclosure,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
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
    if (!globalThis.confirm(t('shoppingList.deleteListConfirm'))) return;
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
    }
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={getColor('background.shoppingList.primary')}
      pb="70px"
    >
      <Header />

      <Flex align="center" justify="space-between" px={4} pt={4} pb={2}>
        <Flex align="center" gap={3}>
          <IconButton
            aria-label={t('common.back')}
            icon={<FiArrowLeft />}
            variant="ghost"
            color={getColor('text.shoppingList.title')}
            onClick={() => navigate('/new-resources')}
            size="sm"
          />
          <Text
            fontSize="lg"
            fontWeight="bold"
            fontFamily={getFont('heading')}
            color={getColor('text.shoppingList.title')}
          >
            {t('shoppingList.title')}
          </Text>
        </Flex>
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
      </Flex>

      <Flex px={4} gap={2} mb={4}>
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

      <Box flex={1} px={4}>
        {isLoading ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner
              color={getColor('text.shoppingList.primary')}
              size="lg"
            />
          </Flex>
        ) : lists.length === 0 ? (
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

      <CreateShoppingListModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleCreate}
        familyGroups={familyGroups}
      />

      <NavigationBar />
    </Flex>
  );
};
