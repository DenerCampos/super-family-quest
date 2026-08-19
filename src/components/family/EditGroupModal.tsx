import { useEffect, useState } from 'react';
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { api } from '../../services';
import type { FamilyGroupResponseDto } from '../../types/familyGroup';
import { DEFAULT_COAT_OF_ARMS } from '../../utils/coatOfArms';
import { FamilyImagePicker } from './FamilyImagePicker';

type EditGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  group: FamilyGroupResponseDto;
  onGroupUpdated: () => void;
};

export const EditGroupModal = ({
  isOpen,
  onClose,
  group,
  onGroupUpdated,
}: EditGroupModalProps) => {
  const { t } = useThemedTranslation();
  const { getColor, getFont } = useVisualTheme();
  const toast = useToast();

  const [name, setName] = useState(group.name);
  const [coatOfArms, setCoatOfArms] = useState(
    group.coatOfArms || DEFAULT_COAT_OF_ARMS,
  );
  const [isCoatOfArmsChanged, setIsCoatOfArmsChanged] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(group.name);
    setCoatOfArms(group.coatOfArms || DEFAULT_COAT_OF_ARMS);
    setIsCoatOfArmsChanged(false);
    setPhoto(null);
  }, [isOpen, group.name, group.coatOfArms]);

  const handleCoatOfArmsChange = (selected: string) => {
    setCoatOfArms(selected);
    setIsCoatOfArmsChanged(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await api.familyGroupUpdate(
        group.id,
        name.trim(),
        isCoatOfArmsChanged ? coatOfArms : undefined,
      );

      if (photo) {
        await api.familyGroupUploadImage(group.id, photo);
      }

      toast({
        title: t('common.success'),
        description: t('familyGroup.groupUpdated'),
        status: 'success',
        duration: 3000,
      });
      onGroupUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.updateGroupError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      closeOnOverlayClick={!isSaving}
      size="sm"
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bg={getColor('background.primary')}
        color={getColor('text.primary')}
      >
        <ModalHeader fontFamily={getFont('heading')}>
          {t('familyGroup.editGroup')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={5} align="stretch">
            <Center>
              <FamilyImagePicker
                coatOfArms={coatOfArms}
                photoUrl={isCoatOfArmsChanged ? null : group.groupImage}
                pendingPhoto={photo}
                onCoatOfArmsChange={handleCoatOfArmsChange}
                onPhotoChange={setPhoto}
                isDisabled={isSaving}
                size="xl"
              />
            </Center>

            <FormControl>
              <FormLabel
                color={getColor('text.primary')}
                fontFamily={getFont('body')}
              >
                {t('familyGroup.groupName')}
              </FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('familyGroup.groupNamePlaceholder')}
                fontFamily={getFont('body')}
                isDisabled={isSaving}
              />
            </FormControl>

            <Button
              bg={getColor('button.background.neutral')}
              color={getColor('button.text.primary')}
              _hover={{ bg: getColor('button.hover.background.neutral') }}
              onClick={handleSave}
              isLoading={isSaving}
              loadingText={t('familyGroup.saving')}
              isDisabled={!name.trim()}
              fontFamily={getFont('body')}
            >
              {t('common.save')}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
