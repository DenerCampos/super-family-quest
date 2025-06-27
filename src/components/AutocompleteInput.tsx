import { useState, useEffect, useRef } from 'react';
import {
  Input,
  Box,
  List,
  ListItem,
  Portal,
  useOutsideClick,
} from '@chakra-ui/react';

type AutocompleteInputProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export const AutocompleteInput = ({
  value,
  options,
  onChange,
  placeholder,
}: AutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    const filtered = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase()),
    );
    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setFilteredOptions([]);
    setIsOpen(false);
  };

  // Fecha o dropdown ao clicar fora
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
  });

  // Calcula posição para colocar o dropdown abaixo do input
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [inputValue, isOpen]);

  return (
    <>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        bg="purple.100"
        color="purple.800"
        _focus={{
          borderColor: 'purple.500',
          boxShadow: '0 0 0 1px purple.500',
        }}
      />

      {isOpen && filteredOptions.length > 0 && (
        <Portal>
          <Box ref={dropdownRef} style={dropdownStyles}>
            <List
              bg="white"
              boxShadow="md"
              maxH="200px"
              overflowY="auto"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              {filteredOptions.map((option, index) => (
                <ListItem
                  key={index}
                  px={4}
                  py={2}
                  cursor="pointer"
                  color="gray.800"
                  _hover={{ bg: 'gray.100', color: 'gray.900' }}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </ListItem>
              ))}
            </List>
          </Box>
        </Portal>
      )}
    </>
  );
};
