import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Input,
  IconButton,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { ShoppingListService } from '../../services/shoppingList';
import { parseQuickAddInput } from '../../hooks/useShoppingListDetail';
import { isBulkShoppingListInput } from '../../utils/bulkShoppingListInput';
import type {
  CreateShoppingListItemPayload,
  ItemSuggestionResponse,
} from '../../types/shoppingList';

interface AddItemInputProps {
  onAdd: (payload: CreateShoppingListItemPayload) => Promise<void>;
  onAddBulk: (text: string) => Promise<void>;
  isDisabled?: boolean;
}

export const AddItemInput = ({
  onAdd,
  onAddBulk,
  isDisabled = false,
}: AddItemInputProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<ItemSuggestionResponse[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (search: string) => {
    if (search.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const data = await ShoppingListService.getSuggestions(search);
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const { name } = parseQuickAddInput(inputValue);
    if (name.length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(name), 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, fetchSuggestions]);

  const handleSubmit = async (overrideName?: string) => {
    const text = overrideName ?? inputValue;
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      if (isBulkShoppingListInput(text)) {
        await onAddBulk(text.trim());
      } else {
        const { name, quantity } = parseQuickAddInput(text);
        await onAdd({ name, quantity, useTextRecognition: true });
      }
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = (suggestion: ItemSuggestionResponse) => {
    setShowSuggestions(false);
    const { quantity } = parseQuickAddInput(inputValue);
    const payload: CreateShoppingListItemPayload = {
      name: suggestion.name,
      quantity,
      useTextRecognition: true,
    };
    if (suggestion.suggestedUnit) {
      payload.unit = suggestion.suggestedUnit as CreateShoppingListItemPayload['unit'];
    }
    setIsSubmitting(true);
    onAdd(payload)
      .then(() => {
        setInputValue('');
        setSuggestions([]);
        inputRef.current?.focus();
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <Box position="relative" width="100%">
      <Flex gap={2}>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={t('shoppingList.detail.addItemPlaceholder')}
          bg={getColor('background.shoppingList.addInput')}
          color={getColor('text.shoppingList.itemName')}
          fontFamily={getFont('body')}
          fontSize="sm"
          borderColor={getColor('border.shoppingList.card')}
          _placeholder={{ color: getColor('text.shoppingList.itemMeta') }}
          _focus={{
            borderColor: getColor('border.shoppingList.categoryHeader'),
          }}
          isDisabled={isDisabled || isSubmitting}
        />
        <IconButton
          aria-label={t('shoppingList.createNew')}
          icon={<FiPlus />}
          onClick={() => handleSubmit()}
          isLoading={isSubmitting}
          isDisabled={isDisabled || !inputValue.trim()}
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          _hover={{ opacity: 0.8 }}
          size="md"
        />
      </Flex>
      <Text
        fontSize="xs"
        color={getColor('text.shoppingList.itemMeta')}
        fontFamily={getFont('body')}
        mt={1.5}
        lineHeight="short"
      >
        {t('shoppingList.detail.bulkHint')}
      </Text>

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={10}
          mt={1}
          bg={getColor('background.shoppingList.card')}
          border="1px solid"
          borderColor={getColor('border.shoppingList.card')}
          borderRadius="8px"
          boxShadow="lg"
          maxH="200px"
          overflowY="auto"
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={getColor('text.shoppingList.itemMeta')}
            px={3}
            pt={2}
            pb={1}
            fontFamily={getFont('body')}
          >
            {t('shoppingList.detail.searchSuggestions')}
          </Text>
          <List spacing={0}>
            {suggestions.map((s) => (
              <ListItem
                key={`${s.name}-${s.suggestedGroup}`}
                px={3}
                py={2}
                cursor="pointer"
                _hover={{ bg: getColor('background.shoppingList.cardHover') }}
                onMouseDown={() => handleSuggestionClick(s)}
              >
                <Flex justify="space-between" align="center">
                  <Text
                    fontSize="sm"
                    color={getColor('text.shoppingList.itemName')}
                    fontFamily={getFont('body')}
                  >
                    {s.name}
                  </Text>
                  {s.suggestedGroup && (
                    <Text
                      fontSize="xs"
                      color={getColor('text.shoppingList.itemMeta')}
                      fontFamily={getFont('body')}
                    >
                      {s.suggestedGroup}
                    </Text>
                  )}
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
