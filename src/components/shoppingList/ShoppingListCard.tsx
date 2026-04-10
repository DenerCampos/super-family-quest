import { Avatar, Box, Flex, Text, Badge, IconButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUsers, FiTrash2 } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { toDisplayableImageUrl } from '../../utils/formatString';
import type { ShoppingListResponse } from '../../types/shoppingList';

const MotionBox = motion(Box);

interface ShoppingListCardProps {
  list: ShoppingListResponse;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export const ShoppingListCard = ({ list, onClick, onDelete }: ShoppingListCardProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <MotionBox
      as="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      bg={getColor('background.shoppingList.card')}
      border="1px solid"
      borderColor={getColor('border.shoppingList.card')}
      borderRadius="12px"
      p={4}
      width="100%"
      textAlign="left"
      cursor="pointer"
      _hover={{
        bg: getColor('background.shoppingList.cardHover'),
        boxShadow: 'md',
      }}
    >
      <Flex justify="space-between" align="flex-start" mb={2}>
        <Flex align="center" gap={2} flex={1} minW={0}>
          <Flex
            align="center"
            justify="center"
            w="32px"
            h="32px"
            borderRadius="8px"
            bg={getColor('border.shoppingList.card')}
            flexShrink={0}
          >
            <FiShoppingCart
              size={16}
              color={getColor('text.shoppingList.primary')}
            />
          </Flex>
          <Text
            fontSize="md"
            fontWeight="bold"
            fontFamily={getFont('body')}
            color={getColor('text.shoppingList.title')}
            noOfLines={1}
          >
            {list.name}
          </Text>
        </Flex>
        {onDelete && (
          <IconButton
            aria-label={t('shoppingList.deleteList')}
            icon={<FiTrash2 size={14} />}
            size="xs"
            variant="ghost"
            color={getColor('text.shoppingList.secondary')}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(list.id);
            }}
          />
        )}
      </Flex>

      <Flex align="center" gap={1} mb={2} ml="40px">
        {list.familyGroup ? (
          <Flex align="center" gap={1}>
            <FiUsers size={12} color={getColor('text.shoppingList.secondary')} />
            <Text
              fontSize="xs"
              color={getColor('text.shoppingList.secondary')}
              fontFamily={getFont('body')}
            >
              {t('shoppingList.familyList', { name: list.familyGroup.name })}
            </Text>
          </Flex>
        ) : (
          <Text
            fontSize="xs"
            color={getColor('text.shoppingList.secondary')}
            fontFamily={getFont('body')}
          >
            {t('shoppingList.personalList')}
          </Text>
        )}
      </Flex>

      <Flex ml="40px" gap={2} align="center" flexWrap="wrap">
        {list.pendingCount > 0 && (
          <Badge
            fontSize="xs"
            px={2}
            py={0.5}
            borderRadius="full"
            bg={getColor('background.lastRegistrations.badge.expense')}
            color={getColor('text.shoppingList.badge.pending')}
          >
            {t('shoppingList.pendingItems', { count: list.pendingCount })}
          </Badge>
        )}
        {list.inCartCount > 0 && (
          <Badge
            fontSize="xs"
            px={2}
            py={0.5}
            borderRadius="full"
            bg={getColor('background.lastRegistrations.badge.revenue')}
            color={getColor('text.shoppingList.badge.inCart')}
          >
            {t('shoppingList.inCartItems', { count: list.inCartCount })}
          </Badge>
        )}
        <Flex align="center" gap={1} ml="auto">
          {list.createdBy && (
            <Avatar
              size="xs"
              src={toDisplayableImageUrl(list.createdBy.profileImage)}
              name={list.createdBy.name}
              referrerPolicy="no-referrer"
            />
          )}
          <Text
            fontSize="xs"
            color={getColor('text.shoppingList.itemMeta')}
            fontFamily={getFont('body')}
          >
            {list.createdBy
              ? t('shoppingList.createdBy', { name: list.createdBy.name })
              : t('shoppingList.createdByUnknown')}
          </Text>
        </Flex>
      </Flex>
    </MotionBox>
  );
};
