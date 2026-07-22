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
import { FiDownload, FiEdit2, FiFileText, FiImage, FiTrash2 } from 'react-icons/fi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useDeleteHealthExam, useHealthExam } from '../../hooks/useHealthExams';
import { getHealthExamTypeOptions } from '../../utils/healthConstants';
import { formatAppDate } from '../../utils/formatDate';

type HealthExamLocationState = {
  from?: string;
};

export const HealthExamDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const backTo =
    (location.state as HealthExamLocationState | null)?.from ??
    '/new-resources/health/exams';

  const { data: exam, isLoading } = useHealthExam(id ?? '');
  const deleteMutation = useDeleteHealthExam();
  const examTypeLabels = Object.fromEntries(
    getHealthExamTypeOptions(t).map((opt) => [opt.value, opt.label]),
  );

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const dangerColor = getColor('status.error');
  const warningColor = getColor('status.warning');
  const primaryBtnText = getColor('button.text.primary');

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id!);
    onClose();
    navigate(backTo);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    return formatAppDate(value, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <FixedAppShell bg={bg}>
        <Flex flex={1} justify="center" align="center"><Spinner /></Flex>
      </FixedAppShell>
    );
  }

  if (!exam) {
    return (
      <FixedAppShell bg={bg}>
        <PageTitleBar title={t('health.exams.detail.title')} backTo={backTo} />
        <Flex flex={1} justify="center" align="center">
          <Text color={textSub}>{t('health.exams.notFound')}</Text>
        </Flex>
      </FixedAppShell>
    );
  }

  const title =
    exam.labName ||
    exam.items[0]?.itemName ||
    t('health.exams.unnamedExam');

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar
        title={t('health.exams.detail.title')}
        backTo={backTo}
        titleRight={
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={FiEdit2} />}
            onClick={() => navigate(`/new-resources/health/exams/${id}/edit`)}
          >
            {t('health.exams.detail.edit')}
          </Button>
        }
      />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box width="100%" maxW="600px">
          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Text color={textPrimary} fontSize="lg" fontWeight="bold" noOfLines={2}>
              {title}
            </Text>
            <Text color={textSub} fontSize="sm" mt={1}>
              {examTypeLabels[exam.examType]} · {formatDate(exam.examDate)}
            </Text>
            <Text color={textSub} fontSize="sm" mt={1}>
              {t('health.pending.for')}: {exam.user?.name}
            </Text>
            {exam.labName ? (
              <Text color={textSub} fontSize="sm" mt={1}>{exam.labName}</Text>
            ) : null}
            {exam.doctorName ? (
              <Text color={textSub} fontSize="sm" mt={1}>{exam.doctorName}</Text>
            ) : null}
            {exam.notes ? (
              <Text color={textPrimary} fontSize="sm" mt={2} fontStyle="italic">{exam.notes}</Text>
            ) : null}
          </Box>

          {exam.files.length > 0 ? (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
              <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={3}>
                {t('health.exams.detail.attachments')}
              </Text>
              <Stack spacing={2}>
                {exam.files.map((file) => (
                  <Button
                    key={file.id}
                    as="a"
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    variant="outline"
                    justifyContent="flex-start"
                    leftIcon={
                      <Icon as={file.fileType === 'PDF' ? FiFileText : FiImage} />
                    }
                    rightIcon={<Icon as={FiDownload} />}
                    width="100%"
                  >
                    {file.originalFilename ?? t('health.exams.detail.attachmentFallback')}
                  </Button>
                ))}
              </Stack>
            </Box>
          ) : null}

          <Text color={textPrimary} fontSize="sm" fontWeight="semibold" mb={2}>
            {t('health.exams.detail.results')} ({exam.items.length})
          </Text>
          <Stack spacing={3} mb={4}>
            {exam.items.map((item) => (
              <Box
                key={item.id}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                p={4}
              >
                <Flex justify="space-between" align="flex-start" gap={2} mb={2}>
                  <Text color={textPrimary} fontSize="sm" fontWeight="bold">
                    {item.itemName}
                  </Text>
                  {item.isAbnormal ? (
                    <Badge bg={warningColor} color={textPrimary} size="sm">
                      {t('health.common.abnormal')}
                    </Badge>
                  ) : null}
                </Flex>

                {exam.examType === 'LABORATORY' ? (
                  <Stack spacing={1}>
                    {(item.resultValue || item.resultUnit) && (
                      <Text color={textPrimary} fontSize="sm">
                        {t('health.register.resultValue')}: {item.resultValue ?? '—'}{' '}
                        {item.resultUnit ?? ''}
                      </Text>
                    )}
                    {item.referenceRange ? (
                      <Text color={textSub} fontSize="xs">
                        {t('health.register.referenceRange')}: {item.referenceRange}
                      </Text>
                    ) : null}
                    {item.itemNotes ? (
                      <Text color={textSub} fontSize="xs" fontStyle="italic">
                        {item.itemNotes}
                      </Text>
                    ) : null}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {item.findings ? (
                      <Box>
                        <Text color={textSub} fontSize="xs" mb={0.5}>
                          {t('health.register.findings')}
                        </Text>
                        <Text color={textPrimary} fontSize="sm" whiteSpace="pre-wrap">
                          {item.findings}
                        </Text>
                      </Box>
                    ) : null}
                    {item.conclusion ? (
                      <Box>
                        <Text color={textSub} fontSize="xs" mb={0.5}>
                          {t('health.register.conclusion')}
                        </Text>
                        <Text color={textPrimary} fontSize="sm" whiteSpace="pre-wrap">
                          {item.conclusion}
                        </Text>
                      </Box>
                    ) : null}
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>

          <Button
            width="100%"
            variant="outline"
            borderColor={dangerColor}
            color={dangerColor}
            leftIcon={<Icon as={FiTrash2} />}
            onClick={onOpen}
          >
            {t('health.exams.detail.delete')}
          </Button>
        </Box>
      </Flex>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <AlertDialogHeader color={textPrimary} fontSize="md">
            {t('health.exams.detail.confirmDeleteTitle')}
          </AlertDialogHeader>
          <AlertDialogBody color={textSub} fontSize="sm">
            {t('health.exams.detail.confirmDeleteMessage')}
          </AlertDialogBody>
          <AlertDialogFooter gap={2}>
            <Button ref={cancelRef} onClick={onClose}>
              {t('health.exams.detail.confirmDeleteCancel')}
            </Button>
            <Button
              bg={dangerColor}
              color={primaryBtnText}
              _hover={{ opacity: 0.9 }}
              isLoading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {t('health.exams.detail.confirmDeleteConfirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FixedAppShell>
  );
};
