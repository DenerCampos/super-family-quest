import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { FiCamera, FiImage, FiPlus, FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { ResourceCrudScaffold } from '../../components/ResourceCrudScaffold';
import { useFamilyGroupsList } from '../../hooks/useFamilyGroupsList';
import { useRecipeForm } from '../../hooks/useRecipeForm';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { toDisplayableImageUrl } from '../../utils/formatString';
import { compressImage } from '../../utils/compressImage';
import {
  CHORE_PHOTO_ACCEPT_ATTR,
  CHORE_PHOTO_ACCEPT_LIST,
  CHORE_PHOTO_MAX_BYTES,
} from '../../utils/chore-occurrence-photo-constants';

const MAX_UI_PHOTOS = 4;

const labelColor = (getColor: (path: string) => string) =>
  getColor('text.familyGroup.title');

const fieldProps = (getColor: (path: string) => string) => ({
  borderColor: getColor('border.primary'),
  color: getColor('text.familyGroup.title'),
});

export const RecipeFormView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const hook = useRecipeForm((key: string) => t(key));
  const {
    formMethods,
    fieldArray,
    handleSubmit,
    submitRecipe,
    uploadPendingPhotos,
    isNew,
    recipe,
    isLoadingRecipe,
    loadError,
    isSubmitting,
    isUploadingPhotos,
  } = hook;

  const {
    register,
    control,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = fieldArray;

  const existingPhotos = recipe?.photos ?? [];

  const { data: groupsData } = useFamilyGroupsList();
  const familyGroups = useMemo(
    () => (groupsData ?? []).map((g) => ({ id: g.id, name: g.name })),
    [groupsData],
  );

  const [pendingPhotos, setPendingPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = pendingPhotos.map((file) => URL.createObjectURL(file));
    setPreviewUrls(next);
    return () => {
      next.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingPhotos]);

  const onSave = handleSubmit(async (values) => {
    try {
      let savedRecipe = await submitRecipe(values);
      savedRecipe = await uploadPendingPhotos(
        savedRecipe,
        pendingPhotos,
        MAX_UI_PHOTOS,
      );

      setPendingPhotos([]);

      toast({
        title: isNew ? t('common.created') : t('common.updated'),
        status: 'success',
        duration: 2000,
      });
      navigate(`/new-resources/recipes/${savedRecipe.id}`);
    } catch {
      toast({
        title: t('recipes.addError'),
        status: 'error',
        duration: 4000,
      });
    }
  });

  const canAddMorePhotos =
    (existingPhotos.length ?? 0) + pendingPhotos.length < MAX_UI_PHOTOS;

  const handlePickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canAddMorePhotos) {
      e.target.value = '';
      return;
    }
    if (!(CHORE_PHOTO_ACCEPT_LIST as readonly string[]).includes(file.type)) {
      toast({ title: t('chores.photoInvalidType'), status: 'error', duration: 3000 });
      e.target.value = '';
      return;
    }
    if (e.target === cameraRef.current && galleryRef.current) {
      galleryRef.current.value = '';
    }
    if (e.target === galleryRef.current && cameraRef.current) {
      cameraRef.current.value = '';
    }
    try {
      const compressed = await compressImage(file);
      if (compressed.size > CHORE_PHOTO_MAX_BYTES) {
        toast({ title: t('chores.photoTooLarge'), status: 'error', duration: 3000 });
        e.target.value = '';
        return;
      }
      setPendingPhotos((prev) => [...prev, compressed]);
    } catch {
      toast({ title: t('common.error'), status: 'error', duration: 3000 });
    }
    e.target.value = '';
  };

  const formTitle = isNew ? t('recipes.newRecipe') : t('recipes.editRecipe');
  const fieldsStyle = fieldProps(getColor);

  if (!isNew && isLoadingRecipe) {
    return (
      <ResourceCrudScaffold
        title={formTitle}
        backTo="/new-resources/recipes"
        isLoading
      />
    );
  }

  if (!isNew && loadError) {
    return (
      <ResourceCrudScaffold title={t('recipes.notFound')} backTo="/new-resources/recipes">
        <Text color={getColor('text.dashboard.tileSubtitle')}>
          {t('recipes.notFound')}
        </Text>
      </ResourceCrudScaffold>
    );
  }

  return (
    <>
      {isUploadingPhotos && (
        <LoadingOverlay typeLoading="save" text={t('recipes.uploadingPhoto')} />
      )}

      <ResourceCrudScaffold title={formTitle} backTo="/new-resources/recipes">
        <VStack as="form" align="stretch" spacing={4} onSubmit={onSave} pb={4}>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel color={labelColor(getColor)}>{t('recipes.fieldTitle')}</FormLabel>
            <Input {...register('title')} {...fieldsStyle} />
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor(getColor)}>
              {t('recipes.fieldDescription')}
            </FormLabel>
            <Input {...register('description')} {...fieldsStyle} />
          </FormControl>

          {!isNew && recipe?.familyGroup ? (
            <FormControl>
              <FormLabel color={labelColor(getColor)}>
                {t('recipes.familyGroup')}
              </FormLabel>
              <Input
                value={recipe.familyGroup.name}
                isReadOnly
                bg={getColor('input.secondary')}
                color={getColor('text.profile.secondary')}
                borderColor={getColor('border.primary')}
              />
            </FormControl>
          ) : null}

          {isNew ? (
            <FormControl>
              <FormLabel color={labelColor(getColor)}>
                {t('recipes.shareWithFamily')}
              </FormLabel>
              <Select
                placeholder={t('shoppingList.personalList')}
                {...register('familyGroupId')}
                {...fieldsStyle}
              >
                {familyGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : null}

          <FormControl isInvalid={!!errors.ingredients}>
            <FormLabel color={labelColor(getColor)}>
              {t('recipes.ingredients')}
            </FormLabel>
            <VStack align="stretch" spacing={2}>
              {fields.map((field, index) => (
                <Flex key={field.id} gap={1} align="center">
                  <Controller
                    name={`ingredients.${index}.name`}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        {...f}
                        placeholder={t('recipes.ingredientName')}
                        flex={1}
                        minW="0"
                        {...fieldsStyle}
                      />
                    )}
                  />
                  <Controller
                    name={`ingredients.${index}.quantity`}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        {...f}
                        type="number"
                        step="any"
                        placeholder={t('recipes.ingredientQuantityPlaceholder')}
                        w="64px"
                        flexShrink={0}
                        {...fieldsStyle}
                      />
                    )}
                  />
                  <Controller
                    name={`ingredients.${index}.unit`}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        {...f}
                        placeholder={t('recipes.ingredientUnit')}
                        w="72px"
                        flexShrink={0}
                        {...fieldsStyle}
                      />
                    )}
                  />
                  <IconButton
                    aria-label={t('common.delete')}
                    icon={<FiTrash />}
                    size="sm"
                    variant="ghost"
                    color={getColor('text.familyGroup.title')}
                    flexShrink={0}
                    onClick={() => remove(index)}
                    isDisabled={fields.length <= 1}
                  />
                </Flex>
              ))}
              <Button
                size="sm"
                leftIcon={<FiPlus />}
                variant="outline"
                color={getColor('text.familyGroup.title')}
                borderColor={getColor('border.primary')}
                _hover={{ bg: getColor('input.primary') }}
                onClick={() => append({ name: '', quantity: 1, unit: 'un' })}
              >
                {t('recipes.addIngredient')}
              </Button>
            </VStack>
          </FormControl>

          <FormControl isInvalid={!!errors.instructions}>
            <FormLabel color={labelColor(getColor)}>
              {t('recipes.fieldInstructions')}
            </FormLabel>
            <Textarea {...register('instructions')} rows={8} {...fieldsStyle} />
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor(getColor)}>
              {t('recipes.photosWithLimit', { max: MAX_UI_PHOTOS })}
            </FormLabel>

            <Input
              ref={cameraRef}
              type="file"
              accept={CHORE_PHOTO_ACCEPT_ATTR}
              capture="environment"
              display="none"
              aria-hidden
              tabIndex={-1}
              onChange={handlePickPhoto}
            />
            <Input
              ref={galleryRef}
              type="file"
              accept={CHORE_PHOTO_ACCEPT_ATTR}
              display="none"
              aria-hidden
              tabIndex={-1}
              onChange={handlePickPhoto}
            />

            <Flex gap={2} wrap="wrap">
              <Button
                size="sm"
                leftIcon={<FiCamera />}
                variant="outline"
                color={getColor('text.familyGroup.title')}
                borderColor={getColor('border.primary')}
                _hover={{ bg: getColor('input.primary') }}
                isDisabled={!canAddMorePhotos}
                onClick={() => cameraRef.current?.click()}
              >
                {t('chores.takePhoto')}
              </Button>
              <Button
                size="sm"
                leftIcon={<FiImage />}
                variant="outline"
                color={getColor('text.familyGroup.title')}
                borderColor={getColor('border.primary')}
                _hover={{ bg: getColor('input.primary') }}
                isDisabled={!canAddMorePhotos}
                onClick={() => galleryRef.current?.click()}
              >
                {t('chores.chooseImageFromDevice')}
              </Button>
            </Flex>
            <Flex gap={2} mt={2} wrap="wrap">
              {existingPhotos.map((url) => (
                <Box key={url} position="relative" w="72px" h="72px">
                  <Image
                    src={toDisplayableImageUrl(url)}
                    alt=""
                    objectFit="cover"
                    borderRadius="md"
                    boxSize="72px"
                  />
                </Box>
              ))}
              {pendingPhotos.map((file, i) => (
                <Box key={`${file.name}-${file.size}-${i}`} position="relative">
                  <Image
                    src={previewUrls[i] ?? ''}
                    alt=""
                    objectFit="cover"
                    borderRadius="md"
                    boxSize="72px"
                  />
                  <IconButton
                    aria-label={t('common.delete')}
                    icon={<FiTrash />}
                    size="xs"
                    position="absolute"
                    top={0}
                    right={0}
                    onClick={() =>
                      setPendingPhotos((p) => p.filter((_, idx) => idx !== i))
                    }
                  />
                </Box>
              ))}
            </Flex>
          </FormControl>

          <Button
            type="submit"
            isLoading={isSubmitting}
            bg={getColor('button.background.primary')}
            color={getColor('button.text.primary')}
            fontFamily={getFont('body')}
            _hover={{ opacity: 0.9 }}
          >
            {t('common.save')}
          </Button>
        </VStack>
      </ResourceCrudScaffold>
    </>
  );
};
