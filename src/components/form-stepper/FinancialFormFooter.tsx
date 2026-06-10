import { Button, Flex } from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type Props = {
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  isEdit: boolean;
};

export const FinancialFormFooter = ({
  isSubmitDisabled,
  isSubmitting,
  isEdit,
}: Props) => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const buttonStyles = {
    bg: getColor('background.tertiary'),
    color: getColor('text.primary'),
    border: '1px solid',
    borderColor: getColor('border.primary'),
    _hover: {
      bg: getColor('background.selected'),
      color: getColor('text.accent'),
    },
  };

  return (
    <Flex
      flexShrink={0}
      pt={3}
      pb={4}
      borderTop="1px solid"
      borderColor={getColor('border.primary')}
      bg={getColor('background.primary')}
    >
      <Button
        type="submit"
        w="full"
        size="lg"
        isDisabled={isSubmitDisabled}
        isLoading={isSubmitting}
        loadingText={t('common.saving')}
        {...buttonStyles}
      >
        {isEdit ? t('common.update') : t('common.save')}
      </Button>
    </Flex>
  );
};
