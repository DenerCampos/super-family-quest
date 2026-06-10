import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { compressImage } from '../../utils/compressImage';
import { toDisplayableImageUrl } from '../../utils/formatString';

export const MAX_FINANCIAL_PHOTOS = 5;

type Props = {
  pendingFiles: File[];
  existingUrls: string[];
  onAdd: (files: File[]) => void;
  onRemovePending: (index: number) => void;
  onRemoveExisting?: (url: string) => void | Promise<void>;
  disabled?: boolean;
};

export const PhotosStep = ({
  pendingFiles,
  existingUrls,
  onAdd,
  onRemovePending,
  onRemoveExisting,
  disabled,
}: Props) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = pendingFiles.length + existingUrls.length;
  const slotsLeft = Math.max(0, MAX_FINANCIAL_PHOTOS - total);

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length || isProcessing) return;
    setIsProcessing(true);
    try {
      const validImages = Array.from(list)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, slotsLeft);
      if (!validImages.length) return;
      const compressed = await Promise.all(validImages.map((f) => compressImage(f)));
      onAdd(compressed);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" color={getColor('text.muted')}>
        {t('financialSteps.photos.hint', { max: MAX_FINANCIAL_PHOTOS, count: total })}
      </Text>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <Button
        leftIcon={<FiUpload />}
        onClick={() => inputRef.current?.click()}
        isLoading={isProcessing}
        loadingText={t('common.saving')}
        isDisabled={disabled || slotsLeft <= 0 || isProcessing}
        variant="outline"
        color={getColor('text.primary')}
        borderColor={getColor('border.primary')}
      >
        {t('financialSteps.photos.add')}
      </Button>

      <Flex wrap="wrap" gap={3}>
        {existingUrls.map((url) => (
          <Box key={url} position="relative" w="80px" h="80px">
            <Image
              src={toDisplayableImageUrl(url)}
              alt=""
              objectFit="cover"
              w="full"
              h="full"
              borderRadius="md"
            />
            {onRemoveExisting && (
              <IconButton
                aria-label={t('common.delete')}
                icon={<FiTrash2 />}
                size="xs"
                position="absolute"
                top={1}
                right={1}
                onClick={() => onRemoveExisting(url)}
              />
            )}
          </Box>
        ))}
        {pendingFiles.map((file, index) => (
          <Box key={`${file.name}-${index}`} position="relative" w="80px" h="80px">
            <Image
              src={URL.createObjectURL(file)}
              alt=""
              objectFit="cover"
              w="full"
              h="full"
              borderRadius="md"
            />
            <IconButton
              aria-label={t('common.delete')}
              icon={<FiTrash2 />}
              size="xs"
              position="absolute"
              top={1}
              right={1}
              onClick={() => onRemovePending(index)}
            />
          </Box>
        ))}
      </Flex>
    </VStack>
  );
};
