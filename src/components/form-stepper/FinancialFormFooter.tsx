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
        bg={getColor('button.background.neutral')}
        color={getColor('button.text.primary')}
        border="1px solid"
        borderColor={getColor('border.primary')}
        fontWeight="semibold"
        _hover={{
          bg: getColor('background.selected'),
          color: getColor('button.text.primary'),
        }}
        _disabled={{
          opacity: 0.6,
          bg: getColor('background.tertiary'),
          color: getColor('text.secondary'),
          cursor: 'not-allowed',
        }}
      >
        {isEdit ? t('common.update') : t('common.save')}
      </Button>
    </Flex>
  );
};
