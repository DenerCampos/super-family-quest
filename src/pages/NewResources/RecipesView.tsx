import {
  Box,
  Flex,
  IconButton,
  Spinner,
  Text,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { DriveImage } from '../../components/DriveImage';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { PageScaffold } from '../../components/PageScaffold';
import { useAuth } from '../../contexts/AuthContext';
import { useRecipes } from '../../hooks/useRecipes';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import type { RecipeResponse } from '../../types/recipe';
import { toDisplayableImageUrl } from '../../utils/formatString';

export const RecipesView = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { profile } = useAuth();

  const { recipes, isLoading, deleteRecipe } = useRecipes();

  const handleDelete = async (
    e: { stopPropagation: () => void },
    recipe: RecipeResponse,
  ) => {
    e.stopPropagation();
    if (!globalThis.confirm(t('recipes.deleteConfirm'))) return;
    try {
      await deleteRecipe(recipe.id);
      toast({ title: t('common.deleted'), status: 'success', duration: 2000 });
    } catch {
      toast({
        title: t('recipes.deleteError'),
        status: 'error',
        duration: 4000,
      });
    }
  };

  const currentUserId = profile?.user?.id;

  return (
    <PageScaffold
      title={t('recipes.title')}
      backTo="/new-resources"
      bg={getColor('background.profile.primary')}
      contentLayout="plain"
      contentPx={0}
      contentPt={4}
      titleRight={
        <IconButton
          aria-label={t('recipes.newRecipe')}
          icon={<FiPlus />}
          onClick={() => navigate('/new-resources/recipes/new')}
          bg={getColor('button.background.primary')}
          color={getColor('button.text.primary')}
          _hover={{ opacity: 0.8 }}
          size="sm"
          borderRadius="full"
        />
      }
    >
      <Box px={4}>
        {isLoading ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner color={getColor('text.profile.primary')} size="lg" />
          </Flex>
        ) : recipes.length === 0 ? (
          <VStack spacing={3} py={10}>
            <Text
              fontSize="md"
              color={getColor('text.profile.primary')}
              fontFamily={getFont('body')}
              textAlign="center"
            >
              {t('recipes.emptyState')}
            </Text>
            <Text
              fontSize="sm"
              color={getColor('text.profile.secondary')}
              fontFamily={getFont('body')}
              textAlign="center"
            >
              {t('recipes.emptyStateDescription')}
            </Text>
            <Button
              mt={2}
              onClick={() => navigate('/new-resources/recipes/new')}
              bg={getColor('button.background.primary')}
              color={getColor('button.text.primary')}
              fontFamily={getFont('body')}
              leftIcon={<FiPlus />}
              _hover={{ opacity: 0.8 }}
            >
              {t('recipes.newRecipe')}
            </Button>
          </VStack>
        ) : (
          <VStack spacing={3} align="stretch">
            {recipes.map((recipe) => {
              const cover = recipe.photos?.[0];
              const canDelete =
                currentUserId && recipe.createdBy?.id === currentUserId;

              return (
                <Flex
                  key={recipe.id}
                  cursor="pointer"
                  borderRadius="lg"
                  overflow="hidden"
                  bg={getColor('background.shoppingList.card')}
                  borderWidth="1px"
                  borderColor={getColor('border.shoppingList.card')}
                  onClick={() =>
                    navigate(`/new-resources/recipes/${recipe.id}`)
                  }
                  _hover={{
                    bg: getColor('background.shoppingList.cardHover'),
                  }}
                  align="stretch"
                  minH="96px"
                  shadow="sm"
                >
                  <Box
                    w="96px"
                    flexShrink={0}
                    bg={getColor('background.profile.primary')}
                  >
                    {cover ? (
                      <DriveImage
                        src={toDisplayableImageUrl(cover)}
                        alt=""
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        minH="96px"
                        fallback={
                          <Flex align="center" justify="center" h="100%" minH="96px">
                            <Text
                              fontSize="xs"
                              color={getColor('text.profile.secondary')}
                              textAlign="center"
                              px={1}
                            >
                              {t('recipes.noPhotos')}
                            </Text>
                          </Flex>
                        }
                      />
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        h="100%"
                        minH="96px"
                      >
                        <Text
                          fontSize="xs"
                          color={getColor('text.profile.secondary')}
                          textAlign="center"
                          px={1}
                        >
                          {t('recipes.noPhotos')}
                        </Text>
                      </Flex>
                    )}
                  </Box>
                  <Flex direction="column" flex={1} p={3} position="relative">
                    <Text
                      fontWeight="bold"
                      fontFamily={getFont('heading')}
                      color={getColor('text.profile.primary')}
                      noOfLines={2}
                    >
                      {recipe.title}
                    </Text>
                    {recipe.description ? (
                      <Text
                        fontSize="sm"
                        color={getColor('text.profile.primary')}
                        noOfLines={2}
                        mt={1}
                        fontFamily={getFont('body')}
                      >
                        {recipe.description}
                      </Text>
                    ) : null}
                    <Text
                      fontSize="xs"
                      color={getColor('text.profile.secondary')}
                      mt="auto"
                      pt={2}
                    >
                      {recipe.createdBy?.name
                        ? t('shoppingList.createdBy', {
                            name: recipe.createdBy.name,
                          })
                        : t('shoppingList.createdByUnknown')}
                    </Text>
                    {canDelete ? (
                      <IconButton
                        aria-label={t('recipes.deleteRecipe')}
                        icon={<FiTrash />}
                        size="xs"
                        variant="ghost"
                        position="absolute"
                        top={2}
                        right={2}
                        color={getColor('status.error')}
                        onClick={(e) => void handleDelete(e, recipe)}
                      />
                    ) : null}
                  </Flex>
                </Flex>
              );
            })}
          </VStack>
        )}
      </Box>
    </PageScaffold>
  );
};
