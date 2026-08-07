import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Select,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminFamilyMembers } from '../../hooks/useAdminFamilyMembers';
import { useHealthPrescriptions } from '../../hooks/useHealthPrescriptions';
import { formatAppDate } from '../../utils/formatDate';
import { useState } from 'react';

export const HealthPrescriptionsView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { members: adminMembers, isAdminAnywhere } = useAdminFamilyMembers();

  const [userId, setUserId] = useState('');
  const { data, isLoading } = useHealthPrescriptions({ userId: userId || undefined });

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');
  const successColor = getColor('status.success');
  const mutedColor = getColor('text.disabled');

  const isOngoing = (endDate?: string | null) => !endDate;

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar
        title={t('health.prescriptions.title')}
        backTo="/new-resources/health"
        titleRight={
          <Button
            size="sm"
            bg={primaryBtnBg}
            color={primaryBtnText}
            _hover={{ opacity: 0.9 }}
            leftIcon={<Icon as={FiPlus} />}
            onClick={() => navigate('/new-resources/health/prescriptions/new')}
          >
            {t('health.prescriptions.new')}
          </Button>
        }
      />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box width="100%" maxW="600px">
          {isAdminAnywhere && adminMembers.length > 1 && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={3} mb={4}>
              <Select
                bg={inputBg}
                size="sm"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                color={textPrimary}
              >
                <option value="">{t('health.search.allMembers')}</option>
                {adminMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                    {m.id === profile?.user.id ? ` (${t('health.overview.me')})` : ''}
                  </option>
                ))}
              </Select>
            </Box>
          )}

          {isLoading && (
            <Flex justify="center" py={6}><Spinner /></Flex>
          )}

          {!isLoading && (!data?.data || data.data.length === 0) && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={6} textAlign="center">
              <Text color={textSub} fontSize="sm">{t('health.prescriptions.empty')}</Text>
            </Box>
          )}

          <Stack spacing={3}>
            {data?.data?.map((rx) => {
              const activeItems = rx.items.filter((i) => isOngoing(i.endDate));
              const finishedItems = rx.items.filter((i) => !isOngoing(i.endDate));

              return (
                <Box
                  key={rx.id}
                  bg={cardBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={4}
                  cursor="pointer"
                  _hover={{ borderColor: getColor('text.familyGroup.primary') }}
                  onClick={() => navigate(`/new-resources/health/prescriptions/${rx.id}`)}
                >
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Box flex={1}>
                      <Text color={textPrimary} fontSize="sm" fontWeight="semibold">
                        {t('health.doctorPrefix', { name: rx.doctorName })}
                      </Text>
                      <Text color={textSub} fontSize="xs">
                        {formatAppDate(rx.prescriptionDate)}
                        {' · '}{rx.user?.name}
                      </Text>
                    </Box>
                    <Flex gap={1} flexShrink={0}>
                      {activeItems.length > 0 && (
                        <Badge bg={successColor} color={textPrimary} size="sm">
                          {t('health.prescriptions.activeCount', { count: activeItems.length })}
                        </Badge>
                      )}
                      {finishedItems.length > 0 && (
                        <Badge bg={mutedColor} color={textPrimary} size="sm">
                          {t('health.prescriptions.finishedCount', { count: finishedItems.length })}
                        </Badge>
                      )}
                    </Flex>
                  </Flex>

                  <Stack spacing={1}>
                    {rx.items.slice(0, 3).map((item) => (
                      <Flex key={item.id} align="center" gap={2}>
                        <Box
                          w={2}
                          h={2}
                          borderRadius="full"
                          bg={isOngoing(item.endDate) ? successColor : mutedColor}
                          flexShrink={0}
                        />
                        <Text color={textPrimary} fontSize="xs" noOfLines={1}>
                          {item.medicationName}
                          {item.dosage ? ` · ${item.dosage}` : ''}
                        </Text>
                      </Flex>
                    ))}
                    {rx.items.length > 3 && (
                      <Text color={textSub} fontSize="xs">
                        +{rx.items.length - 3} {t('health.prescriptions.more')}
                      </Text>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
