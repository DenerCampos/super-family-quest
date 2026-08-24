import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiCamera, FiEdit2 } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { SelectCoatOfArmsModal } from '../modals/SelectCoatOfArmsModal';
import {
  compressImage,
  IMAGE_COMPRESS_MAX_BYTES,
} from '../../utils/compressImage';
import { toDisplayableImageUrl } from '../../utils/formatString';

type FamilyImagePickerProps = {
  /** Brasão selecionado (path de asset estático). */
  coatOfArms: string;
  /** Foto já salva no grupo. */
  photoUrl?: string | null;
  /** Foto escolhida e ainda não enviada à API. */
  pendingPhoto?: File | null;
  onCoatOfArmsChange: (coatOfArms: string) => void;
  onPhotoChange: (photo: File | null) => void;
  isDisabled?: boolean;
  size?: 'lg' | 'xl' | '2xl';
};

export const FamilyImagePicker = ({
  coatOfArms,
  photoUrl,
  pendingPhoto,
  onCoatOfArmsChange,
  onPhotoChange,
  isDisabled = false,
  size = 'xl',
}: FamilyImagePickerProps) => {
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pendingPhotoUrl = useMemo(
    () => (pendingPhoto ? URL.createObjectURL(pendingPhoto) : null),
    [pendingPhoto],
  );

  useEffect(() => {
    return () => {
      if (pendingPhotoUrl) URL.revokeObjectURL(pendingPhotoUrl);
    };
  }, [pendingPhotoUrl]);

  const previewSrc =
    pendingPhotoUrl ?? toDisplayableImageUrl(photoUrl) ?? coatOfArms;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      if (compressed.size > IMAGE_COMPRESS_MAX_BYTES) {
        toast({
          title: t('common.error'),
          description: t('profile.maxFileSize'),
          status: 'error',
          duration: 3000,
        });
        return;
      }
      onPhotoChange(compressed);
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('familyGroup.imageError'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCoatSelect = (selected: string) => {
    onCoatOfArmsChange(selected);
    // Brasão e foto são alternativas — a API descarta a foto ao salvar o brasão.
    onPhotoChange(null);
  };

  return (
    <Box position="relative">
      <Avatar
        size={size}
        src={previewSrc}
        referrerPolicy="no-referrer"
        bg={getColor('background.familyGroup.memberCard')}
        border="3px solid"
        borderColor={getColor('border.familyGroup.card')}
      />

      <IconButton
        aria-label={t('familyGroup.uploadImage')}
        icon={<FiCamera />}
        position="absolute"
        bottom={0}
        left={0}
        rounded="full"
        size="sm"
        colorScheme={getColor('button.primary')}
        isLoading={isCompressing}
        isDisabled={isDisabled}
        onClick={() => fileInputRef.current?.click()}
      />
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        display="none"
        onChange={handleFileChange}
      />

      <IconButton
        aria-label={t('familyGroup.changeCoatOfArms')}
        icon={<FiEdit2 />}
        position="absolute"
        bottom={0}
        right={0}
        rounded="full"
        size="sm"
        colorScheme={getColor('button.primary')}
        isDisabled={isDisabled}
        onClick={onOpen}
      />

      <SelectCoatOfArmsModal
        isOpen={isOpen}
        onClose={onClose}
        selectedCoatOfArms={coatOfArms}
        onSelect={handleCoatSelect}
      />
    </Box>
  );
};
