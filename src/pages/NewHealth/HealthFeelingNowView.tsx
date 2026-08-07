import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Select,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminFamilyMembers } from '../../hooks/useAdminFamilyMembers';
import {
  useCreatePatientContext,
  useLatestPatientContext,
} from '../../hooks/useHealthOverview';
import { formatAppDateTime } from '../../utils/formatDate';

export const HealthFeelingNowView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const { members: adminMembers, isAdminAnywhere } = useAdminFamilyMembers();

  const [targetUserId, setTargetUserId] = useState(profile?.user.id ?? '');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (profile?.user.id && !targetUserId) {
      setTargetUserId(profile.user.id);
    }
  }, [profile?.user.id, targetUserId]);

  const { data: latest, isLoading: isLoadingLatest } = useLatestPatientContext(
    targetUserId || undefined,
  );
  const createMutation = useCreatePatientContext();

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');

  const trimmed = content.trim();

  const handleSave = async () => {
    if (!trimmed) return;
    await createMutation.mutateAsync({
      content: trimmed,
      targetUserId: targetUserId || undefined,
    });
    setContent('');
  };

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar
        title={t('health.feelingNow.title')}
        backTo="/new-resources/health"
      />

      <Flex
        flex={1}
        minH={0}
        direction="column"
        align="center"
        overflow="auto"
        pt={4}
        px={4}
        pb={20}
      >
        <Box width="100%" maxW="600px">
          {isAdminAnywhere && adminMembers.length > 1 && (
            <Box
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              p={4}
              mb={4}
            >
              <Text
                color={textPrimary}
                fontSize="sm"
                fontWeight="semibold"
                mb={2}
              >
                {t('health.feelingNow.selectMember')}
              </Text>
              <Select
                bg={inputBg}
                size="sm"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                color={textPrimary}
                borderColor={borderColor}
              >
                {adminMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                    {m.id === profile?.user.id
                      ? ` (${t('health.feelingNow.me')})`
                      : ''}
                  </option>
                ))}
              </Select>
            </Box>
          )}

          <Box
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={4}
            mb={4}
          >
            <FormControl>
              <FormLabel color={textPrimary} fontSize="sm" mb={1}>
                {t('health.feelingNow.contentLabel')}
              </FormLabel>
              <Text color={textSub} fontSize="xs" mb={2}>
                {t('health.feelingNow.contentHint')}
              </Text>
              <Textarea
                bg={inputBg}
                size="sm"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('health.feelingNow.contentPlaceholder')}
                color={textPrimary}
                borderColor={borderColor}
                maxLength={5000}
              />
            </FormControl>
          </Box>

          <Box
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={4}
            mb={4}
          >
            <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={3}>
              {t('health.feelingNow.lastEntryTitle')}
            </Text>
            {isLoadingLatest ? (
              <Flex justify="center" py={2}>
                <Spinner size="sm" />
              </Flex>
            ) : latest ? (
              <Box
                bg={inputBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                p={3}
              >
                <Text color={textSub} fontSize="xs" mb={1}>
                  {formatAppDateTime(latest.createdAt)}
                </Text>
                <Text
                  color={textPrimary}
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                >
                  {latest.content}
                </Text>
              </Box>
            ) : (
              <Text color={textSub} fontSize="sm">
                {t('health.feelingNow.noLastEntry')}
              </Text>
            )}
          </Box>

          <Button
            width="100%"
            bg={primaryBtnBg}
            color={primaryBtnText}
            _hover={{ opacity: 0.9 }}
            leftIcon={<Icon as={FiHeart} />}
            isLoading={createMutation.isPending}
            isDisabled={!trimmed}
            onClick={() => void handleSave()}
          >
            {t('health.feelingNow.save')}
          </Button>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
