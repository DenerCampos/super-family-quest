import { useRef } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

type ConfirmActionDialogProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmActionDialog = ({
  isOpen,
  message,
  onClose,
  onConfirm,
}: ConfirmActionDialogProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg={getColor('background.primary')} color={getColor('text.primary')}>
          <AlertDialogHeader fontFamily={getFont('heading')}>
            {t('common.confirmTitle')}
          </AlertDialogHeader>
          <AlertDialogBody fontFamily={getFont('body')}>
            {message}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              fontFamily={getFont('body')}
            >
              {t('common.close')}
            </Button>
            <Button
              bg={getColor('button.background.expense')}
              color={getColor('button.text.primary')}
              onClick={onConfirm}
              ml={3}
              fontFamily={getFont('body')}
            >
              {t('common.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
