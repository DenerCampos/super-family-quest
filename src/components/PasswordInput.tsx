import { forwardRef, useState } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useThemedTranslation } from '../hooks/useThemedTranslation';

export type PasswordInputProps = Omit<InputProps, 'type'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [show, setShow] = useState(false);
    const { t } = useThemedTranslation();
    const { color, ...inputProps } = props;

    return (
      <InputGroup>
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          pr="3rem"
          color={color}
          {...inputProps}
        />
        <InputRightElement>
          <IconButton
            aria-label={
              show ? t('profile.hidePassword') : t('profile.showPassword')
            }
            icon={show ? <FiEyeOff /> : <FiEye />}
            variant="ghost"
            size="sm"
            color={color}
            _hover={{ bg: 'transparent', color }}
            onClick={() => setShow((prev) => !prev)}
            tabIndex={-1}
          />
        </InputRightElement>
      </InputGroup>
    );
  },
);
