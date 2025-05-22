import { useState, useEffect } from 'react';
import { Input, Box, List, ListItem } from '@chakra-ui/react';

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
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setFilteredOptions([]);
  };

  return (
    <Box position="relative">
      <Input
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

      {filteredOptions.length > 0 && (
        <List
          position="absolute"
          zIndex="dropdown"
          width="100%"
          bg="white"
          boxShadow="md"
          maxH="200px"
          overflowY="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          mt={1}
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
      )}
    </Box>
  );
};
