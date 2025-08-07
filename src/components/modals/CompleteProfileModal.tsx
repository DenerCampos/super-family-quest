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
import { useThemeTranslation } from '../../hooks/useThemeTranslation';

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
  repeatMonthly: boolean;
};

export const CompleteProfileModal = ({ isOpen, user, onComplete }: Props) => {
  const toast = useToast();
  const { t } = useThemeTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      family: '',
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
      <ModalContent bg="purple.800" color="white">
        <ModalHeader>{t('profile.complete')}</ModalHeader>

        <ModalBody pb={6}>
          <Text mb={4}>
            {t('profile.welcome')}
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.family} mb={4}>
              <FormLabel>{t('profile.familyName')}</FormLabel>
              <Input
                {...register('family', {
                  required: t('common.required'),
                })}
                placeholder={t('profile.familyNamePlaceholder')}
                bg="purple.100"
                color="purple.800"
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px purple.500',
                }}
              />
              {errors.family && (
                <Text color="red.300" fontSize="sm">
                  {errors.family.message}
                </Text>
              )}
            </FormControl>

            {/* Novo campo: Nome da receita */}
            <FormControl isInvalid={!!errors.incomeName} mb={4}>
              <Flex align="center">
                <FormLabel>Nome da Receita</FormLabel>
                <Tooltip
                  label="Nome da receita é sua fonte de renda principal"
                  placement="top"
                  hasArrow
                  bg="purple.500"
                  color="white"
                >
                  <Box ml={1}>
                    <Icon as={FiInfo} color="purple.300" boxSize={4} />
                  </Box>
                </Tooltip>
              </Flex>
              <Input
                {...register('incomeName', {
                  required: 'Este campo é obrigatório',
                })}
                placeholder="Ex: Salário, Freelance, etc"
                bg="purple.100"
                color="purple.800"
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px purple.500',
                }}
              />
              {errors.incomeName && (
                <Text color="red.300" fontSize="sm">
                  {errors.incomeName.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.income} mb={4}>
              <FormLabel>Renda Mensal</FormLabel>
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
                placeholder="R$ 0,00"
                bg="purple.100"
                color="purple.800"
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px purple.500',
                }}
              />
              {errors.income && (
                <Text color="red.300" fontSize="sm">
                  {errors.income.message}
                </Text>
              )}
            </FormControl>

            {/* Novo campo: Checkbox para repetir mensalmente */}
            <FormControl mb={6}>
              <Checkbox
                {...register('repeatMonthly')}
                defaultChecked
                colorScheme="purple"
              >
                <Flex align="center">
                  {t('profile.repeatMonthly')}
                  <Tooltip
                    label={t('profile.repeatMonthlyTooltip')}
                    placement="top"
                    hasArrow
                    bg="purple.500"
                    color="white"
                  >
                    <Box ml={1}>
                      <Icon as={FiInfo} color="purple.300" boxSize={4} />
                    </Box>
                  </Tooltip>
                </Flex>
              </Checkbox>
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
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