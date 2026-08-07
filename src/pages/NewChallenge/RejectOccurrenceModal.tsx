import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type RejectOccurrenceModalProps = {
  isOpen: boolean;
  reason: string;
  isSubmitting: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function RejectOccurrenceModal({
  isOpen,
  reason,
  isSubmitting,
  onReasonChange,
  onClose,
  onConfirm,
}: RejectOccurrenceModalProps) {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={getColor('background.primary')}>
        <ModalHeader color={getColor('text.familyGroup.title')}>
          {t('chores.rejectModalTitle')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder={t('chores.rejectReasonPlaceholder')}
            borderColor={getColor('border.primary')}
            color={getColor('text.familyGroup.title')}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button
            bg={getColor('status.error')}
            color={getColor('text.header')}
            onClick={onConfirm}
            isLoading={isSubmitting}
          >
            {t('chores.confirmReject')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
