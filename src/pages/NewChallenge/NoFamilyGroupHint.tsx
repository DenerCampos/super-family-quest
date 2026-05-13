import { Button, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

export const NoFamilyGroupHint = () => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  return (
    <VStack spacing={4} py={8} px={4} align="center">
      <Text
        textAlign="center"
        color={getColor('text.familyGroup.title')}
        fontFamily={getFont('body')}
      >
        {t('chores.noFamilyGroup')}
      </Text>
      <Button
        bg={getColor('button.background.primary')}
        color={getColor('button.text.primary')}
        onClick={() => navigate('/new-resources/family')}
      >
        {t('chores.goToFamilyGroup')}
      </Button>
    </VStack>
  );
};
