import {
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { DriveImage } from '../../components/DriveImage';
import {
  FiEdit2,
  FiShoppingCart,
  FiTrash,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { ResourceCrudScaffold } from '../../components/ResourceCrudScaffold';
import { useAuth } from '../../contexts/AuthContext';
import { useRecipeDetail } from '../../hooks/useRecipeDetail';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { toDisplayableImageUrl } from '../../utils/formatString';

export const RecipeDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const recipeId = id ?? '';
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { profile } = useAuth();

  const {
    recipe,
    isLoading,
    deleteRecipe,
    isDeleting,
    generateShoppingList,
    isGeneratingList,
  } = useRecipeDetail(recipeId);

  const handleDelete = async () => {
    if (!globalThis.confirm(t('recipes.deleteConfirm'))) return;
    try {
      await deleteRecipe();
      toast({ title: t('common.deleted'), status: 'success', duration: 2000 });
      navigate('/new-resources/recipes');
    } catch {
      toast({
        title: t('recipes.deleteError'),
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleGenerateList = async () => {
    try {
      toast({
        title: t('recipes.generatingShoppingList'),
        status: 'info',
        duration: 2000,
      });
      const list = await generateShoppingList();
      toast({
        title: t('recipes.shoppingListGenerated'),
        status: 'success',
        duration: 2500,
      });
      navigate(`/new-resources/shopping/${list.id}`);
    } catch {
      toast({
        title: t('common.error'),
        status: 'error',
        duration: 4000,
      });
    }
  };

  const creatorId = recipe?.createdBy?.id;
  const currentUserId = profile?.user?.id;
  const canManageDelete =
    creatorId && currentUserId && creatorId === currentUserId;

  const titleActions = recipe ? (
    <Flex gap={1} flexShrink={0}>
      <IconButton
        aria-label={t('recipes.editRecipe')}
        icon={<FiEdit2 />}
        size="sm"
        variant="ghost"
        color={getColor('text.dashboard.title')}
        onClick={() =>
          navigate(`/new-resources/recipes/${recipe.id}/edit`)
        }
      />
      {canManageDelete ? (
        <IconButton
          aria-label={t('recipes.deleteRecipe')}
          icon={<FiTrash />}
          size="sm"
          variant="ghost"
          color={getColor('status.error')}
          onClick={() => void handleDelete()}
          isLoading={isDeleting}
        />
      ) : null}
    </Flex>
  ) : undefined;

  if (isLoading) {
    return (
      <ResourceCrudScaffold
        title={t('recipes.title')}
        backTo="/new-resources/recipes"
        bg={getColor('background.profile.primary')}
        isLoading
      />
    );
  }

  if (!recipe) {
    return (
      <ResourceCrudScaffold
        title={t('recipes.notFound')}
        backTo="/new-resources/recipes"
        bg={getColor('background.profile.primary')}
      >
        <Text color={getColor('text.dashboard.tileSubtitle')}>
          {t('recipes.notFound')}
        </Text>
      </ResourceCrudScaffold>
    );
  }

  const photos = recipe.photos?.length ? recipe.photos : [];

  return (
    <ResourceCrudScaffold
      title={recipe.title}
      backTo="/new-resources/recipes"
      bg={getColor('background.profile.primary')}
      titleRight={titleActions}
    >
      <VStack align="stretch" spacing={4} pb={2}>
        {photos.length > 0 ? (
          <Flex gap={2} overflowX="auto" pb={1}>
            {photos.map((url) => (
              <DriveImage
                key={url}
                src={toDisplayableImageUrl(url)}
                alt=""
                borderRadius="md"
                boxSize="140px"
                objectFit="cover"
                flexShrink={0}
                fallback={
                  <Flex
                    align="center"
                    justify="center"
                    boxSize="140px"
                    bg={getColor('background.profile.primary')}
                    borderRadius="md"
                  >
                    <Text
                      fontSize="xs"
                      color={getColor('text.profile.secondary')}
                      textAlign="center"
                      px={1}
                      fontFamily={getFont('body')}
                    >
                      {t('recipes.noPhotos')}
                    </Text>
                  </Flex>
                }
              />
            ))}
          </Flex>
        ) : (
          <Text
            fontSize="sm"
            color={getColor('text.profile.secondary')}
            fontFamily={getFont('body')}
          >
            {t('recipes.noPhotos')}
          </Text>
        )}

        {recipe.description ? (
          <Text
            fontSize="sm"
            color={getColor('text.familyGroup.title')}
            fontFamily={getFont('body')}
          >
            {recipe.description}
          </Text>
        ) : null}

        <Text
          fontSize="xs"
          color={getColor('text.dashboard.tileSubtitle')}
          fontFamily={getFont('body')}
        >
          {recipe.createdBy?.name
            ? t('shoppingList.createdBy', { name: recipe.createdBy.name })
            : t('shoppingList.createdByUnknown')}
          {recipe.familyGroup
            ? ` · ${recipe.familyGroup.name}`
            : ` · ${t('shoppingList.personalList')}`}
        </Text>

        <VStack align="stretch" spacing={2}>
          <Text
            fontWeight="bold"
            color={getColor('text.familyGroup.title')}
            fontFamily={getFont('heading')}
          >
            {t('recipes.ingredients')}
          </Text>
          <VStack align="stretch" spacing={1}>
            {recipe.ingredients.map((ing, i) => (
              <Text
                key={`${ing.name}-${i}`}
                fontSize="sm"
                fontFamily={getFont('body')}
                color={getColor('text.familyGroup.title')}
              >
                • {ing.quantity} {ing.unit} {ing.name}
              </Text>
            ))}
          </VStack>
        </VStack>

        <VStack align="stretch" spacing={2}>
          <Text
            fontWeight="bold"
            color={getColor('text.familyGroup.title')}
            fontFamily={getFont('heading')}
          >
            {t('recipes.instructions')}
          </Text>
          <Text
            whiteSpace="pre-wrap"
            fontSize="sm"
            fontFamily={getFont('body')}
            color={getColor('text.familyGroup.title')}
          >
            {recipe.instructions}
          </Text>
        </VStack>

        <Button
          w="100%"
          leftIcon={<FiShoppingCart />}
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          fontFamily={getFont('body')}
          isLoading={isGeneratingList}
          onClick={() => void handleGenerateList()}
          _hover={{ opacity: 0.9 }}
        >
          {t('recipes.generateShoppingList')}
        </Button>
      </VStack>
    </ResourceCrudScaffold>
  );
};
