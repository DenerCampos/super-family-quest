import {
  Box,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

type Props = {
  label: string;
  ariaLabel?: string;
};

/** Ícone (i) com explicação em popover — hover no desktop, toque/clique no mobile. */
export const InfoHintPopover = ({ label, ariaLabel }: Props) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const resolvedAriaLabel = ariaLabel ?? t('common.information');
  const [open, setOpen] = useState(false);

  return (
    <Popover isOpen={open} onClose={() => setOpen(false)} placement="top" isLazy>
      <PopoverTrigger>
        <Box
          as="button"
          type="button"
          aria-label={resolvedAriaLabel}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          ml={1.5}
          verticalAlign="middle"
          flexShrink={0}
          color={getColor('text.financial.hintIcon')}
          opacity={0.92}
          _hover={{ opacity: 1, color: getColor('text.tertiary') }}
          onClick={() => setOpen((value) => !value)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Icon as={FiInfo} boxSize={4} strokeWidth={2.5} />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          bg={getColor('background.financial.infoPopover')}
          border="1px solid"
          borderColor={getColor('border.financial.infoPopover')}
          maxW="280px"
          boxShadow="lg"
          _focus={{ boxShadow: 'lg' }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <PopoverBody
            fontSize="sm"
            lineHeight="short"
            py={3}
            color={getColor('text.financial.infoPopover')}
          >
            {label}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
