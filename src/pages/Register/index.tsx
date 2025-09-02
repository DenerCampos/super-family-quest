// src/pages/Cadastro/index.tsx
import { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  Text,
  useToast,
  // defineStyle,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useAuth } from '../../contexts/AuthContext';

// const floatingStyles = defineStyle({
//   pos: 'absolute',
//   bg: 'bg',
//   px: '0.5',
//   top: '-3',
//   insetStart: '2',
//   fontWeight: 'normal',
//   pointerEvents: 'none',
//   transition: 'position',
//   _peerPlaceholderShown: {
//     color: 'fg.muted',
//     top: '2.5',
//     insetStart: '3',
//   },
//   _peerFocusVisible: {
//     color: 'fg',
//     top: '-3',
//     insetStart: '2',
//   },
// });


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useThemedTranslation();
  const { getAsset, getColor, getFont } = useVisualTheme();
  const { login } = useAuth();
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast({
        title: t('register.error'),
        description: t('register.passwordsDoNotMatch'),
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!email || email.length < 3) {
      toast({
        title: 'Erro',
        description: t('register.familyNameMustBeAtLeast3Characters'),
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData = await api.register({
        name,
        email,
        password,
      });

      if (!userData) {
        throw new Error(t('register.errorCreatingRealm'));
      }

      toast({
        title: t('register.realmCreated'),
        description: t('register.realmCreatedSuccessfully'),
        status: 'success',
        duration: 3000,
      });

      // Aguarda 3 segundos antes de fazer o login automático
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Faz o login automaticamente após o registro
      await login(email, password);
    } catch (error: any) {
      let errorMessage = t('register.errorCreatingRealm');
      
      // Verifica se é um erro 409 (Conflict)
      if (error.response?.status === 409) {
        toast({
          title: t('common.success'), // Usamos success para dar um tom positivo
          description: t('register.errorCreatingRealmUserLimitUsers'),
          status: 'info', // Usamos info ao invés de error
          duration: 12000, // Aumentamos o tempo para dar tempo de ler
          isClosable: true,
        });
        return; // Retorna aqui para não mostrar o toast de erro
      }

      // Para outros erros, mantém o comportamento padrão
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.status === 400) {
        errorMessage = t('register.errorCreatingRealmUserAlreadyExists');
      }

      toast({
        title: t('register.error'),
        description: errorMessage,
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      bgImage={`url(${getAsset('images.background.register')})`}
      bgSize="cover"
      align="center"
      justify="center"
    >
      <Flex
        direction="column"
        bg={getColor('background.login')}
        p={8}
        borderRadius="lg"
        gap={4}
        w="100%"
        maxW="400px"
        backdropFilter="blur(4px)"
      >
        <Text
          fontSize="2xl"
          color={getColor('text.primary')}
          textAlign="center"
          mb={4}
          fontFamily={getFont('theme')}
        >
          {t('register.createNewRealm')}
        </Text>

        <Input
          placeholder={t('register.fullName')}
          variant="filled"
          focusBorderColor={getColor('border.primary')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          color={getColor('text.primary')}
          isDisabled={isLoading}
          _hover={{
            bg: getColor('input.hover'),
            borderColor: getColor('input.focusBorder'),
          }}
          _focus={{
            bg: getColor('input.focus'),
            borderColor: getColor('input.focusBorder'),
          }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />
        <Input
          placeholder={t('register.email')}
          type="email"
          variant="filled"
          focusBorderColor={getColor('border.primary')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          color={getColor('text.primary')}
          isDisabled={isLoading}
          _hover={{
            bg: getColor('input.hover'),
            borderColor: getColor('input.focusBorder'),
          }}
          _focus={{
            bg: getColor('input.focus'),
            borderColor: getColor('input.focusBorder'),
          }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />
        <Input
          placeholder={t('register.password')}
          type="password"
          variant="filled"
          focusBorderColor={getColor('border.primary')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          color={getColor('text.primary')}
          isDisabled={isLoading}
          _hover={{
            bg: getColor('input.hover'),
          }}
          _focus={{
            bg: getColor('input.focus'),
          }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />
        <Input
          placeholder={t('register.confirmPassword')}
          type="password"
          variant="filled"
          focusBorderColor={getColor('border.primary')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          color={getColor('text.primary')}
          isDisabled={isLoading}
          _hover={{
            bg: getColor('input.hover'),
            borderColor: getColor('input.focusBorder'),
          }}
          _focus={{
            bg: getColor('input.focus'),
            borderColor: getColor('input.focusBorder'),
          }}
          borderColor={getColor('input.border')}
          bg={getColor('input.background')}
        />

        <Button
          colorScheme={getColor('button.primary')}
          mt={4}
          onClick={handleRegister}
          isLoading={isLoading}
          loadingText={t('register.funding')}
          isDisabled={isLoading}
        >
          {t('register.createRealm')}
        </Button>

        <Button
          as={RouterLink}
          to="/login"
          variant="link"
          color={getColor('link.primary')}
          mt={2}
          fontSize="sm"
          isDisabled={isLoading}
        >
          {t('register.alreadyHaveRealm')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Register;
