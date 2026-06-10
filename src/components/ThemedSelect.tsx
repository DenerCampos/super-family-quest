import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Portal,
  useOutsideClick,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useThemedTranslation } from '../hooks/useThemedTranslation';
import { useVisualTheme } from '../hooks/useVisualTheme';

export type ThemedSelectOption = {
  value: string;
  label: string;
};

type ThemedSelectProps = {
  value: string;
  options: ThemedSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export const ThemedSelect = ({
  value,
  options,
  onChange,
  placeholder,
}: ThemedSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? '';

  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
  });

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <>
      <InputGroup>
        <Input
          ref={triggerRef}
          value={selectedLabel}
          placeholder={placeholder}
          readOnly
          cursor="pointer"
          onClick={() => setIsOpen((open) => !open)}
          bg={getColor('input.background')}
          color={getColor('text.primary')}
          fontFamily={getFont('body')}
          borderColor={getColor('input.border')}
          _focus={{
            borderColor: getColor('input.focus'),
            boxShadow: `0 0 0 1px ${getColor('input.focusBorder')}`,
          }}
        />
        <InputRightElement>
          <IconButton
            aria-label={t('common.openOptions')}
            icon={<FiChevronDown />}
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen((open) => !open)}
            transform={isOpen ? 'rotate(180deg)' : 'none'}
            transition="transform 0.2s"
            color={getColor('text.primary')}
            _hover={{ bg: 'transparent' }}
          />
        </InputRightElement>
      </InputGroup>

      {isOpen && options.length > 0 && (
        <Portal>
          <Box ref={dropdownRef} style={dropdownStyles}>
            <List
              bg={getColor('input.backgroundSecondary')}
              boxShadow="md"
              maxH="200px"
              overflowY="auto"
              border="1px solid"
              borderColor={getColor('input.border')}
              borderRadius="md"
            >
              {options.map((option) => (
                <ListItem
                  key={option.value}
                  px={4}
                  py={2}
                  cursor="pointer"
                  color={getColor('text.primary')}
                  fontFamily={getFont('body')}
                  bg={
                    option.value === value
                      ? getColor('background.selected')
                      : 'transparent'
                  }
                  _hover={{
                    bg: getColor('background.selected'),
                  }}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </ListItem>
              ))}
            </List>
          </Box>
        </Portal>
      )}
    </>
  );
};
