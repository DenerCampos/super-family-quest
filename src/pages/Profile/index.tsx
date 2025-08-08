import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { NavigationBar } from '../../components/NavigationBar';
import {
  Flex,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Image,
  Box,
  IconButton,
  Center,
  useDisclosure,
  Text,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FiEdit2, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';

// Lista de brasões pré-definidos
const predefinedCoatOfArms = [
  '/assets/images/coat_of_arms_family.png',
  '/assets/images/coat_of_arms_solare.png',
];

const Profile = () => {
  const { profile, loadProfile } = useAuth();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const [name, setName] = useState(profile?.user.name || '');
  const [email, setEmail] = useState(profile?.user.email || '');
  const [family, setFamily] = useState(profile?.user.family || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoatChanged, setIsCoatChanged] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    isOpen: isCoatModalOpen,
    onOpen: openCoatModal,
    onClose: closeCoatModal,
  } = useDisclosure();

  const [selectedCoat, setSelectedCoat] = useState(
    profile?.user.coatOfArms || predefinedCoatOfArms[0],
  );

  // Validação de e-mail em tempo real
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: t('profile.invalidEmail') }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  }, [email]);

  // Validação de senhas em tempo real
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t('profile.passwordsDoNotMatch'),
      }));
    } else if (confirmPassword && !password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t('profile.enterPasswordFirst'),
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  }, [password, confirmPassword]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCoatChange = (image: string) => {
    setSelectedCoat(image);
    setIsCoatChanged(true);
    closeCoatModal();
  };

  const handleSave = async () => {
    // Validações finais antes de salvar
    if (email && !validateEmail(email)) {
      toast({
        title: t('profile.invalidEmail'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password && password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: t('profile.passwordMustBeAtLeast6Characters'),
      }));
      return;
    }

    if (password && password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t('profile.passwordsDoNotMatch'),
      }));
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        id: profile?.user.id,
        ...(name && { name }),
        ...(email && { email }),
        ...(family && { family }),
        ...(isCoatChanged && { coatOfArms: selectedCoat }),
        ...(password && { password }),
      };

      await api.updateUser(updatedData);
      loadProfile();

      toast({
        title: t('profile.profileUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsEditing(false);
      setIsCoatChanged(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      toast({
        title: t('profile.errorUpdatingProfile'),
        description: t('profile.pleaseTryAgain'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" minH="100vh">
      <Header />

      <Flex
        p={4}
        direction="column"
        maxW="600px"
        mx="auto"
        w="full"
        overflowY="auto"
        h={'calc(100vh - 220px)'}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'purple.500',
            borderRadius: '4px',
          },
        }}
      >
        <VStack spacing={6} mb={10}>
          <Flex direction="column" align="center" w="full">
            <Box position="relative" mb={4}>
              <Avatar
                size="2xl"
                src={selectedCoat}
                border="3px solid"
                borderColor="purple.500"
              />
              <IconButton
                aria-label="Alterar brasão"
                icon={<FiEdit2 />}
                position="absolute"
                bottom={2}
                right={2}
                colorScheme="purple"
                rounded="full"
                onClick={openCoatModal}
              />
            </Box>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              colorScheme="purple"
              leftIcon={isEditing ? <FiCheck /> : <FiEdit2 />}
              mb={4}
            >
              {isEditing ? t('profile.saveChanges') : t('profile.editProfile')}
            </Button>
          </Flex>

          <FormControl>
            <FormLabel>{t('profile.name')}</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              isDisabled={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>{t('profile.email')}</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>{t('profile.familyName')}</FormLabel>
            <Input
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              isDisabled={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
            />
          </FormControl>

          {isEditing && (
            <>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>{t('profile.newPassword')} (opcional)</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('profile.minimum6Characters')}
                    bg="white"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? t('profile.hidePassword') : t('profile.showPassword')
                      }
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.password && (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>{t('profile.confirmNewPassword')}</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('profile.repeatNewPassword')}
                    bg="white"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showConfirmPassword ? t('profile.hidePassword') : t('profile.showPassword')
                      }
                      icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.confirmPassword && (
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                )}
              </FormControl>
            </>
          )}

          {(isEditing || isCoatChanged) && (
            <Button
              colorScheme="purple"
              onClick={handleSave}
              isLoading={isLoading}
              loadingText={t('profile.saving')}
              w="full"
              isDisabled={!!errors.email || !!errors.confirmPassword}
            >
              {t('profile.saveChanges')}
            </Button>
          )}
        </VStack>
      </Flex>

      {/* Modal para seleção de brasão */}
      <Modal
        isOpen={isCoatModalOpen}
        onClose={closeCoatModal}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="purple.800" color="white">
          <ModalHeader>{t('profile.selectCoatOfArms')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={3} spacing={4}>
              {predefinedCoatOfArms.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  boxSize="100px"
                  objectFit="contain"
                  cursor="pointer"
                  borderRadius="md"
                  border={selectedCoat === image ? '3px solid' : '1px solid'}
                  borderColor={
                    selectedCoat === image ? 'purple.500' : 'gray.200'
                  }
                  _hover={{
                    transform: 'scale(1.05)',
                    borderColor: 'purple.300',
                  }}
                  transition="all 0.2s"
                  onClick={() => handleCoatChange(image)}
                />
              ))}
            </SimpleGrid>

            <Center mt={6}>
              <Text fontSize="sm" color="gray.300" textAlign="center">
                {t('profile.chooseCoatOfArms')}
              </Text>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>

      <NavigationBar />
    </Flex>
  );
};

export default Profile;
