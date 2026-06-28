import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { HealthMarkdownContent } from '../../components/health/HealthMarkdownContent';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import {
  useGenerateHealthOverview,
  useHealthOverview,
  useHealthPatientContext,
} from '../../hooks/useHealthOverview';
import { formatAppDateTime } from '../../utils/formatDate';

export const HealthOverviewView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const { familyGroup } = useFamilyGroup({ fetchSummary: false, fetchInvitations: false });

  const [targetUserId, setTargetUserId] = useState(profile?.user.id ?? '');
  const [patientContext, setPatientContext] = useState('');

  useEffect(() => {
    if (profile?.user.id && !targetUserId) {
      setTargetUserId(profile.user.id);
    }
  }, [profile?.user.id, targetUserId]);

  const { data: overview, isLoading } = useHealthOverview(
    targetUserId || undefined,
  );
  const { data: contextHistory = [], isLoading: isLoadingHistory } =
    useHealthPatientContext(targetUserId || undefined);
  const generateMutation = useGenerateHealthOverview();

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');

  const handleGenerate = async () => {
    await generateMutation.mutateAsync({
      targetUserId: targetUserId || undefined,
      patientContext: patientContext.trim() || undefined,
    });
    setPatientContext('');
  };

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar title={t('health.overview.title')} backTo="/new-resources/health" />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box width="100%" maxW="600px">
          {familyGroup && familyGroup.members.length > 1 && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
              <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={2}>
                {t('health.overview.selectMember')}
              </Text>
              <Select
                bg={inputBg}
                size="sm"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                color={textPrimary}
                borderColor={borderColor}
              >
                {familyGroup.members.map((m) => (
                  <option key={m.user?.id} value={m.user?.id ?? ''}>
                    {m.user?.name}
                    {m.user?.id === profile?.user.id ? ` (${t('health.overview.me')})` : ''}
                  </option>
                ))}
              </Select>
            </Box>
          )}

          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <FormControl>
              <FormLabel color={textPrimary} fontSize="sm" mb={1}>
                {t('health.overview.patientContextLabel')}
              </FormLabel>
              <Text color={textSub} fontSize="xs" mb={2}>
                {t('health.overview.patientContextHint')}
              </Text>
              <Textarea
                bg={inputBg}
                size="sm"
                rows={4}
                value={patientContext}
                onChange={(e) => setPatientContext(e.target.value)}
                placeholder={t('health.overview.patientContextPlaceholder')}
                color={textPrimary}
                borderColor={borderColor}
                maxLength={5000}
              />
            </FormControl>
          </Box>

          {contextHistory.length > 0 && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
              <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={3}>
                {t('health.overview.contextHistory')}
              </Text>
              {isLoadingHistory ? (
                <Flex justify="center" py={2}><Spinner size="sm" /></Flex>
              ) : (
                <Stack spacing={3}>
                  {contextHistory.map((entry) => (
                    <Box
                      key={entry.id}
                      bg={inputBg}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                      p={3}
                    >
                      <Text color={textSub} fontSize="xs" mb={1}>
                        {formatAppDateTime(entry.createdAt)}
                      </Text>
                      <Text color={textPrimary} fontSize="sm" whiteSpace="pre-wrap">
                        {entry.content}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          <Button
            width="100%"
            bg={primaryBtnBg}
            color={primaryBtnText}
            _hover={{ opacity: 0.9 }}
            leftIcon={<Icon as={FiRefreshCw} />}
            isLoading={generateMutation.isPending}
            onClick={() => void handleGenerate()}
            mb={4}
          >
            {overview
              ? t('health.overview.regenerate')
              : t('health.overview.generate')}
          </Button>

          <Text color={textSub} fontSize="xs" mb={4} textAlign="center">
            {t('health.overview.newDataHint')}
          </Text>

          {isLoading && (
            <Flex justify="center" py={6}><Spinner /></Flex>
          )}

          {!isLoading && overview && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4}>
              <Flex justify="space-between" align="center" mb={3}>
                <Text color={textPrimary} fontSize="sm" fontWeight="semibold">
                  {t('health.overview.lastGenerated')}
                </Text>
                <Text color={textSub} fontSize="xs">
                  {formatAppDateTime(overview.generatedAt)}
                </Text>
              </Flex>

              <HealthMarkdownContent
                content={overview.reportContent}
                textPrimary={textPrimary}
              />

              <Text color={textSub} fontSize="xs" mt={4} fontStyle="italic">
                {t('health.overview.disclaimer')}
              </Text>
            </Box>
          )}

          {!isLoading && !overview && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={6} textAlign="center">
              <Text color={textSub} fontSize="sm">
                {t('health.overview.noReport')}
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
