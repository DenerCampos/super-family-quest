import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import {
  useDeletePrescription,
  useHealthPrescription,
} from '../../hooks/useHealthPrescriptions';
import { getHealthDayLabel } from '../../utils/healthConstants';
import { formatAppDate } from '../../utils/formatDate';

export const HealthPrescriptionDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: rx, isLoading } = useHealthPrescription(id ?? '');
  const deleteMutation = useDeletePrescription();

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const dangerColor = getColor('status.error');
  const successColor = getColor('status.success');
  const mutedColor = getColor('text.disabled');

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id!);
    onClose();
    navigate('/new-resources/health/prescriptions');
  };

  if (isLoading) {
    return (
      <FixedAppShell bg={bg}>
        <Flex flex={1} justify="center" align="center"><Spinner /></Flex>
      </FixedAppShell>
    );
  }

  if (!rx) {
    return (
      <FixedAppShell bg={bg}>
        <PageTitleBar title={t('health.prescriptions.detail.title')} backTo="/new-resources/health/prescriptions" />
        <Flex flex={1} justify="center" align="center">
          <Text color={textSub}>{t('health.prescriptions.notFound')}</Text>
        </Flex>
      </FixedAppShell>
    );
  }

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar
        title={t('health.prescriptions.detail.title')}
        backTo="/new-resources/health/prescriptions"
        titleRight={
          <Flex gap={2}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Icon as={FiEdit2} />}
              onClick={() => navigate(`/new-resources/health/prescriptions/${id}/edit`)}
            >
              {t('health.prescriptions.detail.edit')}
            </Button>
          </Flex>
        }
      />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box width="100%" maxW="600px">
          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Text color={textPrimary} fontSize="lg" fontWeight="bold">
              {t('health.doctorPrefix', { name: rx.doctorName })}
            </Text>
            <Text color={textSub} fontSize="sm" mt={1}>
              {formatAppDate(rx.prescriptionDate, {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </Text>
            <Text color={textSub} fontSize="sm">{t('health.prescriptions.for')}: {rx.user?.name}</Text>
            {rx.notes && (
              <Text color={textPrimary} fontSize="sm" mt={2} fontStyle="italic">{rx.notes}</Text>
            )}
          </Box>

          <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={2}>
            {t('health.prescriptions.detail.medications')}
          </Text>
          <Stack spacing={3} mb={4}>
            {rx.items.map((item) => {
              const isOngoing = !item.endDate;
              const daysLabel = item.daysOfWeek
                ? item.daysOfWeek.map((d) => getHealthDayLabel(t, d)).join(', ')
                : t('health.prescriptions.detail.everyday');

              return (
                <Box key={item.id} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4}>
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Box flex={1}>
                      <Text color={textPrimary} fontSize="sm" fontWeight="bold">{item.medicationName}</Text>
                      {item.dosage && <Text color={textSub} fontSize="xs">{item.dosage}</Text>}
                    </Box>
                    <Badge bg={isOngoing ? successColor : mutedColor} color={textPrimary} size="sm">
                      {isOngoing ? t('health.prescriptions.detail.ongoing') : t('health.prescriptions.detail.finished')}
                    </Badge>
                  </Flex>

                  {item.scheduleTimes && item.scheduleTimes.length > 0 && (
                    <Flex align="center" gap={2} mb={1}>
                      <Icon as={FiClock} color={textSub} boxSize={3} />
                      <Text color={textSub} fontSize="xs">{item.scheduleTimes.join(' · ')}</Text>
                    </Flex>
                  )}

                  <Text color={textSub} fontSize="xs" mb={1}>{daysLabel}</Text>

                  {(item.startDate || item.endDate) && (
                    <Text color={textSub} fontSize="xs">
                      {item.startDate && `${t('health.prescriptions.detail.from')} ${formatAppDate(item.startDate)}`}
                      {item.endDate && ` ${t('health.prescriptions.detail.until')} ${formatAppDate(item.endDate)}`}
                      {!item.endDate && ` · ${t('health.prescriptions.detail.noEndDate')}`}
                    </Text>
                  )}

                  {item.notes && (
                    <Text color={textPrimary} fontSize="xs" mt={2} fontStyle="italic">{item.notes}</Text>
                  )}
                </Box>
              );
            })}
          </Stack>

          <Button
            width="100%"
            variant="outline"
            borderColor={dangerColor}
            color={dangerColor}
            leftIcon={<Icon as={FiTrash2} />}
            onClick={onOpen}
          >
            {t('health.prescriptions.detail.delete')}
          </Button>
        </Box>
      </Flex>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <AlertDialogHeader color={textPrimary} fontSize="md">
            {t('health.prescriptions.detail.confirmDeleteTitle')}
          </AlertDialogHeader>
          <AlertDialogBody color={textSub} fontSize="sm">
            {t('health.prescriptions.detail.confirmDeleteMessage')}
          </AlertDialogBody>
          <AlertDialogFooter gap={2}>
            <Button ref={cancelRef} onClick={onClose}>
              {t('health.prescriptions.detail.confirmDeleteCancel')}
            </Button>
            <Button
              bg={dangerColor}
              color={getColor('button.text.primary')}
              _hover={{ opacity: 0.9 }}
              isLoading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {t('health.prescriptions.detail.confirmDeleteConfirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FixedAppShell>
  );
};
