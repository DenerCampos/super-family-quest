import {
  Box,
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
import { PageScaffold } from '../../components/PageScaffold';
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

  if (isLoading) {
    return (
      <PageScaffold
        title={t('recipes.title')}
        backTo="/new-resources/recipes"
        bg={getColor('background.profile.primary')}
        isLoading
      />
    );
  }

  if (!recipe) {
    return (
      <PageScaffold
        title={t('recipes.notFound')}
        backTo="/new-resources/recipes"
        bg={getColor('background.profile.primary')}
        contentLayout="plain"
      />
    );
  }

  const photos = recipe.photos?.length ? recipe.photos : [];

  return (
    <PageScaffold
      title={recipe.title}
      backTo="/new-resources/recipes"
      bg={getColor('background.profile.primary')}
      contentLayout="plain"
      contentPx={0}
      contentPt={0}
      titleRight={
        <Flex gap={1} flexShrink={0}>
          <IconButton
            aria-label={t('recipes.editRecipe')}
            icon={<FiEdit2 />}
            size="sm"
            variant="ghost"
            color={getColor('text.profile.primary')}
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
      }
    >
      <Box px={4} pb={3}>
        {photos.length > 0 ? (
          <Flex gap={2} overflowX="auto" pb={2}>
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
      </Box>

      {/* Descrição + meta */}
      <Box
        mx={4}
        mb={3}
        borderRadius="lg"
        bg={getColor('background.shoppingList.card')}
        borderWidth="1px"
        borderColor={getColor('border.shoppingList.card')}
        p={4}
        shadow="sm"
      >
        {recipe.description ? (
          <Text
            fontSize="sm"
            mb={2}
            color={getColor('text.profile.primary')}
            fontFamily={getFont('body')}
          >
            {recipe.description}
          </Text>
        ) : null}
        <Text
          fontSize="xs"
          color={getColor('text.profile.secondary')}
          fontFamily={getFont('body')}
        >
          {recipe.createdBy?.name
            ? t('shoppingList.createdBy', { name: recipe.createdBy.name })
            : t('shoppingList.createdByUnknown')}
          {recipe.familyGroup
            ? ` · ${recipe.familyGroup.name}`
            : ` · ${t('shoppingList.personalList')}`}
        </Text>
      </Box>

      {/* Ingredientes */}
      <Box
        mx={4}
        mb={3}
        borderRadius="lg"
        bg={getColor('background.shoppingList.card')}
        borderWidth="1px"
        borderColor={getColor('border.shoppingList.card')}
        p={4}
        shadow="sm"
      >
        <Text
          fontWeight="bold"
          mb={2}
          color={getColor('text.profile.primary')}
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
              color={getColor('text.profile.primary')}
            >
              • {ing.quantity} {ing.unit} {ing.name}
            </Text>
          ))}
        </VStack>
      </Box>

      {/* Modo de preparo */}
      <Box
        mx={4}
        mb={4}
        borderRadius="lg"
        bg={getColor('background.shoppingList.card')}
        borderWidth="1px"
        borderColor={getColor('border.shoppingList.card')}
        p={4}
        shadow="sm"
      >
        <Text
          fontWeight="bold"
          mb={2}
          color={getColor('text.profile.primary')}
          fontFamily={getFont('heading')}
        >
          {t('recipes.instructions')}
        </Text>
        <Text
          whiteSpace="pre-wrap"
          fontSize="sm"
          fontFamily={getFont('body')}
          color={getColor('text.profile.primary')}
        >
          {recipe.instructions}
        </Text>
      </Box>

      {/* Botão gerar lista */}
      <Box px={4} pb={6}>
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
      </Box>
    </PageScaffold>
  );
};
