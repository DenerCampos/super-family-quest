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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useVisualTheme } from "../hooks/useVisualTheme";

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
  const { getColor, getFont } = useVisualTheme();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    const filtered = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase())
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
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [inputValue, isOpen]);

  return (
    <>
      <InputGroup>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
          bg={getColor("input.background")}
          color={getColor("text.primary")}
          fontFamily={getFont("body")}
          borderColor={getColor("input.border")}
          _focus={{
            borderColor: getColor("input.focus"),
          }}
        />
        <InputRightElement>
          <IconButton
            aria-label="Toggle dropdown"
            icon={<FiChevronDown />}
            size="sm"
            variant="ghost"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              } else {
                setFilteredOptions(options);
                setIsOpen(true);
              }
            }}
            transform={isOpen ? "rotate(180deg)" : "none"}
            transition="transform 0.2s"
            color={getColor("text.primary")}
            _hover={{ bg: "transparent" }}
          />
        </InputRightElement>
      </InputGroup>

      {isOpen && filteredOptions.length > 0 && (
        <Portal>
          <Box ref={dropdownRef} style={dropdownStyles}>
            <List
              bg={getColor("input.primary")}
              boxShadow="md"
              maxH="200px"
              overflowY="auto"
              border="1px solid"
              borderColor={getColor("background.tertiary")}
              borderRadius="md"
            >
              {filteredOptions.map((option, index) => (
                <ListItem
                  key={index}
                  px={4}
                  py={2}
                  cursor="pointer"
                  color={getColor("text.default")}
                  fontFamily={getFont("body")}
                  _hover={{
                    bg: getColor("input.hover"),
                    color: getColor("text.accent"),
                  }}
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
