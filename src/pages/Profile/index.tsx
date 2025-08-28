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
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiEdit2, FiCheck, FiEye, FiEyeOff, FiUser, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useTheme } from '../../hooks/useThemeContext';
import type { ThemeNamespace } from '../../i18n/types';
import type { ThemeConfig } from '../../services/theme';
import { useVisualTheme } from '../../hooks/useVisualTheme';

// Lista de brasões pré-definidos
const predefinedCoatOfArms = [
  '/assets/images/brasao/brasao-1.png',
  '/assets/images/brasao/brasao-2.png',
  '/assets/images/brasao/brasao-3.png',
  '/assets/images/brasao/brasao-4.png',
  '/assets/images/brasao/brasao-5.png',
  '/assets/images/brasao/brasao-6.png',
];

const Profile = () => {
  const { profile, loadProfile } = useAuth();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { currentTheme, changeTheme } = useTheme();
  const { getColor } = useVisualTheme();
  // Estados para edição de perfil
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

  // Estados para temas
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

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

  // Carrega os temas disponíveis
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themes = await api.getAvailableThemes();
        setAvailableThemes(themes);
      } catch (error) {
        console.error('Erro ao carregar temas:', error);
        toast({
          title: t('common.error'),
          description: 'Erro ao carregar temas disponíveis',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoadingThemes(false);
      }
    };

    loadThemes();
  }, [toast, t]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCoatChange = (image: string) => {
    setSelectedCoat(image);
    setIsCoatChanged(true);
    closeCoatModal();
  };

  // Função para mudar o tema
  const handleThemeChange = (themeId: ThemeNamespace) => {
    const theme = availableThemes.find(t => t.id === themeId);
    
    if (!theme) return;

    if (!theme.isUnlocked) {
      toast({
        title: t('common.error'),
        description: `Você precisa de ${theme.requiredCoins} moedas para desbloquear este tema`,
        status: 'error',
        duration: 3000,
      });
      return;
    }

    changeTheme(themeId);
    toast({
      title: t('common.success'),
      description: t('profile.themeChanged'),
      status: 'success',
      duration: 3000,
    });
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
    <Flex
      direction="column"
      minH="100vh"
      bg={getColor('background.profile.primary')}
    >
      <Header />
      <Tabs isFitted>
        <TabList>
          <Tab
            _selected={{
              color: getColor('text.profile.selected'),
              bg: getColor('background.profile.secondary'),
            }}
            color={getColor('text.profile.primary')}
          >
            <Icon as={FiUser} mr={2} />
            {t('profile.editProfile')}
          </Tab>
          <Tab
            _selected={{
              color: getColor('text.profile.selected'),
              bg: getColor('background.profile.secondary'),
            }}
            color={getColor('text.profile.primary')}
          >
            <Icon as={FiSettings} mr={2} />
            {t('profile.themes.title')}
          </Tab>
        </TabList>

        <TabPanels>
          {/* Aba de Perfil - Mantendo o estilo original */}
          <TabPanel>
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
                      borderColor={getColor('border.primary')}
                    />
                    <IconButton
                      aria-label="Alterar brasão"
                      icon={<FiEdit2 />}
                      position="absolute"
                      bottom={2}
                      right={2}
                      colorScheme={getColor('button.primary')}
                      rounded="full"
                      onClick={openCoatModal}
                    />
                  </Box>

                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    colorScheme={getColor('button.primary')}
                    leftIcon={isEditing ? <FiCheck /> : <FiEdit2 />}
                    mb={4}
                  >
                    {isEditing
                      ? t('profile.saveChanges')
                      : t('profile.editProfile')}
                  </Button>
                </Flex>

                <FormControl>
                  <FormLabel color={getColor('text.profile.primary')}>
                    {t('profile.name')}
                  </FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isDisabled={!isEditing}
                    bg={
                      isEditing
                        ? getColor('input.primary')
                        : getColor('input.secondary')
                    }
                    color={
                      isEditing
                        ? getColor('text.profile.primary')
                        : getColor('text.profile.secondary')
                    }
                    _focus={{
                      borderColor: getColor('border.tertiary'),
                      boxShadow: `0 0 0 1px ${getColor('border.tertiary')}`,
                    }}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color={getColor('text.profile.primary')}>
                    {t('profile.email')}
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isDisabled={!isEditing}
                    bg={
                      isEditing
                        ? getColor('input.primary')
                        : getColor('input.secondary')
                    }
                    color={
                      isEditing
                        ? getColor('text.profile.primary')
                        : getColor('text.profile.secondary')
                    }
                    _focus={{
                      borderColor: getColor('border.tertiary'),
                      boxShadow: `0 0 0 1px ${getColor('border.tertiary')}`,
                    }}
                  />
                  {errors.email && (
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel color={getColor('text.profile.primary')}>
                    {t('profile.familyName')}
                  </FormLabel>
                  <Input
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    isDisabled={!isEditing}
                    bg={
                      isEditing
                        ? getColor('input.primary')
                        : getColor('input.secondary')
                    }
                    color={
                      isEditing
                        ? getColor('text.profile.primary')
                        : getColor('text.profile.secondary')
                    }
                    _focus={{
                      borderColor: getColor('border.tertiary'),
                      boxShadow: `0 0 0 1px ${getColor('border.tertiary')}`,
                    }}
                  />
                </FormControl>

                {isEditing && (
                  <>
                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel color={getColor('text.profile.primary')}>
                        {t('profile.newPassword')} (opcional)
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t('profile.minimum6Characters')}
                          bg={
                            isEditing
                              ? getColor('input.primary')
                              : getColor('input.secondary')
                          }
                          color={
                            isEditing
                              ? getColor('text.profile.primary')
                              : getColor('text.profile.secondary')
                          }
                          _focus={{
                            borderColor: getColor('border.tertiary'),
                            boxShadow: `0 0 0 1px ${getColor(
                              'border.tertiary',
                            )}`,
                          }}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showPassword
                                ? t('profile.hidePassword')
                                : t('profile.showPassword')
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
                      <FormLabel color={getColor('text.profile.primary')}>
                        {t('profile.confirmNewPassword')}
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t('profile.repeatNewPassword')}
                          bg={
                            isEditing
                              ? getColor('input.primary')
                              : getColor('input.secondary')
                          }
                          color={
                            isEditing
                              ? getColor('text.profile.primary')
                              : getColor('text.profile.primary')
                          }
                          _focus={{
                            borderColor: getColor('border.tertiary'),
                            boxShadow: `0 0 0 1px ${getColor(
                              'border.tertiary',
                            )}`,
                          }}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showConfirmPassword
                                ? t('profile.hidePassword')
                                : t('profile.showPassword')
                            }
                            icon={
                              showConfirmPassword ? <FiEyeOff /> : <FiEye />
                            }
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.confirmPassword && (
                        <FormErrorMessage>
                          {errors.confirmPassword}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                )}

                {(isEditing || isCoatChanged) && (
                  <Button
                    colorScheme={getColor('button.primary')}
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
          </TabPanel>

          {/* Aba de Temas */}
          <TabPanel>
            <Box maxW="600px" mx="auto" p={4}>
              {/* Lista de Temas */}
              {isLoadingThemes ? (
                <Center py={8}>
                  <Text>{t('profile.loadingThemes')}</Text>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {availableThemes.map((theme) => (
                    <Box
                      key={theme.id}
                      p={6}
                      borderWidth={2}
                      borderRadius="lg"
                      cursor={theme.isUnlocked ? 'pointer' : 'not-allowed'}
                      onClick={() => handleThemeChange(theme.id)}
                      bg={
                        currentTheme === theme.id
                          ? getColor('background.quaternary')
                          : getColor('chakraColors.white')
                      }
                      position="relative"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundImage: `url(${theme.background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.6,
                        zIndex: 0,
                        borderRadius: 'lg',
                      }}
                      borderColor={
                        currentTheme === theme.id
                          ? getColor('border.selected')
                          : getColor('border.noSelect')
                      }
                      opacity={theme.isUnlocked ? 1 : 0.6}
                      transition="all 0.2s"
                      _hover={{
                        transform: theme.isUnlocked
                          ? 'translateY(-2px)'
                          : 'none',
                        shadow: theme.isUnlocked ? 'md' : 'none',
                      }}
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        mb={2}
                        position="relative"
                        zIndex={1}
                      >
                        <Text fontSize="lg" fontWeight="bold">
                          {theme.name}
                        </Text>
                        {currentTheme === theme.id && (
                          <Icon
                            as={FiCheck}
                            color={getColor('chakraColors.green')}
                            boxSize={10}
                            bg={getColor('chakraColors.white')}
                            borderRadius="full"
                            p={3}
                          />
                        )}
                      </Flex>

                      {!theme.isUnlocked && (
                        <Flex
                          position="relative"
                          zIndex={1}
                          top={0}
                          right={0}
                          bottom={0}
                          left={0}
                          bg="blackAlpha.50"
                          justify="center"
                          align="center"
                          borderRadius="lg"
                        >
                          <Text
                            fontSize="md"
                            fontWeight="medium"
                            color={getColor('chakraColors.white')}
                          >
                            {t('profile.themes.requires', {
                              count: theme.requiredCoins,
                            })}
                          </Text>
                        </Flex>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal para seleção de brasão */}
      <Modal
        isOpen={isCoatModalOpen}
        onClose={closeCoatModal}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg={getColor('background.primary')}
          color={getColor('text.primary')}
        >
          <ModalHeader>{t('profile.selectCoatOfArms')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={3} spacing={4}>
              {predefinedCoatOfArms.map((image) => (
                <Image
                  key={image}
                  src={image}
                  boxSize="100px"
                  objectFit="contain"
                  cursor="pointer"
                  borderRadius="md"
                  border={selectedCoat === image ? '3px solid' : '1px solid'}
                  borderColor={
                    selectedCoat === image
                      ? getColor('border.selected')
                      : getColor('border.noSelect')
                  }
                  _hover={{
                    transform: 'scale(1.05)',
                    borderColor: getColor('border.primary'),
                  }}
                  transition="all 0.2s"
                  onClick={() => handleCoatChange(image)}
                />
              ))}
            </SimpleGrid>

            <Center mt={6}>
              <Text
                fontSize="sm"
                color={getColor('text.primary')}
                textAlign="center"
              >
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
