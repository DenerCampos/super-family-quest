import { useState } from 'react';
import {
  VStack,
  Text,
  Input,
  Button,
  useToast,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { api } from '../../services';

type CreateGroupFormProps = {
  onGroupCreated: () => void;
};

export const CreateGroupForm = ({ onGroupCreated }: CreateGroupFormProps) => {
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    setIsCreating(true);
    try {
      await api.familyGroupCreate(groupName.trim());
      toast({
        title: t('common.success'),
        description: t('familyGroup.created'),
        status: 'success',
        duration: 3000,
      });
      setGroupName('');
      onGroupCreated();
    } catch (error: any) {
      const description =
        error?.response?.status === 409
          ? t('familyGroup.conflictError')
          : t('familyGroup.createError');
      toast({
        title: t('common.error'),
        description,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <VStack spacing={6} py={8} px={4} align="center">
      <Flex
        w="80px"
        h="80px"
        borderRadius="full"
        bg={getColor('background.familyGroup.memberCard')}
        align="center"
        justify="center"
      >
        <Icon as={FaUsers} boxSize={10} color={getColor('text.familyGroup.secondary')} />
      </Flex>

      <Text
        fontSize="lg"
        fontWeight="bold"
        color={getColor('text.familyGroup.title')}
        fontFamily={getFont('heading')}
        textAlign="center"
      >
        {t('familyGroup.noGroup')}
      </Text>

      <Text
        fontSize="sm"
        color={getColor('text.familyGroup.secondary')}
        fontFamily={getFont('body')}
        textAlign="center"
        maxW="300px"
      >
        {t('familyGroup.noGroupDescription')}
      </Text>

      <VStack spacing={3} w="full" maxW="320px">
        <Input
          placeholder={t('familyGroup.groupNamePlaceholder')}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fontFamily={getFont('body')}
          color={getColor('text.familyGroup.primary')}
          borderColor={getColor('border.familyGroup.card')}
          bg={getColor('background.familyGroup.card')}
          _placeholder={{ color: getColor('text.familyGroup.secondary') }}
        />
        <Button
          w="full"
          bg={getColor('button.background.neutral')}
          color={getColor('button.text.primary')}
          _hover={{
            bg: getColor('button.hover.background.neutral'),
          }}
          isLoading={isCreating}
          loadingText={t('familyGroup.creating')}
          isDisabled={!groupName.trim()}
          onClick={handleCreate}
          fontFamily={getFont('body')}
        >
          {t('familyGroup.createGroup')}
        </Button>
      </VStack>
    </VStack>
  );
};
