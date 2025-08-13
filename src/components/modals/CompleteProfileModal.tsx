import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Checkbox,
  Tooltip,
  Icon,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { api } from '../../services';
import { useEffect } from 'react';
import {
  formatCurrencyInputBRL,
  parseBRLCurrency,
} from '../../utils/formatCurrency';
import { FiInfo } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

type Props = {
  isOpen: boolean;
  user: {
    email: string;
    name: string;
  };
  onComplete: () => void;
};

type FormData = {
  family: string;
  income: string;
  incomeName: string;
  date: string;
  repeatMonthly: boolean;
};

export const CompleteProfileModal = ({ isOpen, user, onComplete }: Props) => {
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      family: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Preencher automaticamente o sobrenome
  useEffect(() => {
    if (user?.name) {
      const names = user.name.split(' ');
      const lastName = names[names.length - 1];
      setValue('family', lastName);
    }
  }, [user]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.completeProfile({
        family: data.family,
        income: parseBRLCurrency(data.income),
        incomeName: data.incomeName,
        date: data.date,
        repeatMonthly: data.repeatMonthly,
      });

      toast({
        title: t('profile.complete'),
        status: 'success',
        description: t('profile.success'),
        duration: 3000,
      });

      onComplete();
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        status: 'error',
        description: t('common.updateError'),
        duration: 3000,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Impede o fechamento
      closeOnOverlayClick={false} // Impede fechar clicando fora
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bg={getColor('background.primary')}
        color={getColor('text.inverted')}
      >
        <ModalHeader>{t('profile.complete')}</ModalHeader>

        <ModalBody pb={6}>
          <Text mb={4}>{t('profile.welcome')}</Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.family} mb={4}>
              <FormLabel>{t('profile.familyName')}</FormLabel>
              <Input
                {...register('family', {
                  required: t('common.required'),
                })}
                placeholder={t('profile.familyNamePlaceholder')}
                bg={getColor('background.write')}
                color={getColor('text.default')}
                _focus={{
                  borderColor: getColor('border.tertiary'),
                  boxShadow: `0 0 0 1px ${getColor('border.tertiary')}`,
                }}
              />
              {errors.family && (
                <Text color={getColor('status.error')} fontSize="sm">
                  {errors.family.message}
                </Text>
              )}
            </FormControl>

            {/* Novo campo: Nome da receita */}
            <FormControl isInvalid={!!errors.incomeName} mb={4}>
              <Flex align="center">
                <FormLabel>{t('profile.nameRevenue')}</FormLabel>
                <Tooltip
                  label={t('profile.nameRevenueTooltip')}
                  placement="top"
                  hasArrow
                  bg={getColor('background.tertiary')}
                  color={getColor('text.inverted')}
                >
                  <Box ml={1}>
                    <Icon
                      as={FiInfo}
                      color={getColor('primary.300')}
                      boxSize={4}
                    />
                  </Box>
                </Tooltip>
              </Flex>
              <Input
                {...register('incomeName', {
                  required: t('common.required'),
                })}
                placeholder={t('profile.nameRevenuePlaceholder')}
                bg={getColor('background.write')}
                color={getColor('text.default')}
                _focus={{
                  borderColor: getColor('border.tertiary'),
                  boxShadow: `0 0 0 1px ${getColor('border.tertiary')}`,
                }}
              />
              {errors.incomeName && (
                <Text color={getColor('status.error')} fontSize="sm">
                  {errors.incomeName.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.income} mb={4}>
              <FormLabel>{t('profile.monthlyIncome')}</FormLabel>
              <Input
                {...register('income', {
                  required: t('common.required'),
                  validate: (value) => {
                    const numericValue = parseBRLCurrency(value);
                    return numericValue > 0 || t('common.invalidValue');
                  },
                })}
                onChange={(e) => {
                  const formatted = formatCurrencyInputBRL(e.target.value);
                  e.target.value = formatted;
                }}
                placeholder={t('profile.monthlyIncomePlaceholder')}
                bg={getColor('background.write')}
                color={getColor('text.default')}
                _focus={{
                  borderColor: getColor('border.tertiary'),
                  boxShadow: `0 0 0 1px ${getColor('border.tertiary')}`,
                }}
              />
              {errors.income && (
                <Text color={getColor('status.error')} fontSize="sm">
                  {errors.income.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.date} mb={4}>
              <FormLabel>{t('profile.date')}</FormLabel>
              <Input
                type="date"
                {...register('date', {
                  required: t('common.required'),
                })}
                bg={getColor('background.write')}
                color={getColor('text.default')}
                isDisabled={isSubmitting}
              />
              {errors.date && (
                <Text color={getColor('status.error')} fontSize="sm" mt={1}>
                  {errors.date.message}
                </Text>
              )}
            </FormControl>

            {/* Novo campo: Checkbox para repetir mensalmente */}
            <FormControl mb={6}>
              <Checkbox
                {...register('repeatMonthly')}
                defaultChecked
                color={getColor('text.inverted')}
                _hover={{
                  bg: getColor('background.button.hover.primary'),
                }}
              >
                <Flex align="center">
                  {t('profile.repeatMonthly')}
                  <Tooltip
                    label={t('profile.repeatMonthlyTooltip')}
                    placement="top"
                    hasArrow
                    bg={getColor('background.tertiary')}
                    color={getColor('text.inverted')}
                  >
                    <Box ml={1}>
                      <Icon
                        as={FiInfo}
                        color={getColor('primary.300')}
                        boxSize={4}
                      />
                    </Box>
                  </Tooltip>
                </Flex>
              </Checkbox>
            </FormControl>

            <Button
              type="submit"
              color={getColor('text.inverted')}
              bg={getColor('background.tertiary')}
              _hover={{
                bg: getColor('background.button.hover.primary'),
              }}
              w="full"
              isLoading={isSubmitting}
              loadingText={t('common.saving')}
            >
              {t('common.save')}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};