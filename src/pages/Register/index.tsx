// src/pages/Cadastro/index.tsx
import { useState } from 'react';
import { Flex, Input, Button, Text, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { api } from '../../services';
import { useThemeTranslation } from '../../hooks/useThemeTranslation';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useThemeTranslation();
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
      const response = await api.register({
        name,
        email,
        password,
      });

      if (!response) {
        throw new Error(t('register.errorCreatingRealm'));
      }

      toast({
        title: t('register.realmCreated'),
        description: t('register.realmCreatedSuccessfully'),
        status: 'success',
        duration: 3000,
      });

      navigate('/login');
    } catch (error: any) {
      console.error(error);

      let errorMessage = t('register.errorCreatingRealm');
      
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
      bgImage="url('/assets/images/register-bg.png')"
      bgSize="cover"
      align="center"
      justify="center"
    >
      <Flex
        direction="column"
        bg="rgba(23, 25, 35, 0.8)"
        p={8}
        borderRadius="lg"
        gap={4}
        w="100%"
        maxW="400px"
        backdropFilter="blur(4px)"
      >
        <Text
          fontSize="2xl"
          color="purple.300"
          textAlign="center"
          mb={4}
          fontFamily="Pixelify Sans"
        >
          {t('register.createNewRealm')}
        </Text>

        <Input
          placeholder={t('register.fullName')}
          variant="filled"
          focusBorderColor="purple.500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          placeholder={t('register.email')}
          type="email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          placeholder={t('register.password')}
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={isLoading}
        />
        <Input
          placeholder={t('register.confirmPassword')}
          type="password"
          variant="filled"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isDisabled={isLoading}
        />

        <Button
          colorScheme="purple"
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
          color="blue.300"
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
