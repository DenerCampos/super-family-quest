import {
  Badge,
  Box,
  Flex,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useHealthExams } from '../../hooks/useHealthExams';
import { getHealthExamTypeOptions } from '../../utils/healthConstants';

export const HealthRegisteredExamsList = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useHealthExams({ limit: 50 });
  const examTypeLabels = Object.fromEntries(
    getHealthExamTypeOptions(t).map((opt) => [opt.value, opt.label]),
  );

  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const warningColor = getColor('status.warning');
  const primaryBorder = getColor('text.familyGroup.primary');

  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner color={getColor('text.familyGroup.primary')} />
      </Flex>
    );
  }

  const exams = data?.data ?? [];

  if (exams.length === 0) {
    return (
      <Box
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={6}
        textAlign="center"
      >
        <Text color={textSub} fontSize="sm">
          {t('health.exams.registeredEmpty')}
        </Text>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {exams.map((exam) => {
        const hasAbnormal = exam.items.some((item) => item.isAbnormal);
        const primaryItem = exam.items[0]?.itemName;

        return (
          <Box
            key={exam.id}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={4}
            cursor="pointer"
            _hover={{ borderColor: primaryBorder }}
            onClick={() => navigate(`/new-resources/health/exams/${exam.id}`)}
          >
            <Flex align="flex-start" gap={2} mb={1}>
              <Text
                color={textPrimary}
                fontSize="sm"
                fontWeight="semibold"
                flex={1}
                minW={0}
                noOfLines={2}
              >
                {exam.labName || primaryItem || t('health.exams.unnamedExam')}
              </Text>
              {hasAbnormal ? (
                <Badge
                  bg={warningColor}
                  color={textPrimary}
                  size="sm"
                  flexShrink={0}
                  whiteSpace="nowrap"
                >
                  {t('health.common.abnormal')}
                </Badge>
              ) : null}
            </Flex>
            <Text color={textSub} fontSize="xs">
              {examTypeLabels[exam.examType]} · {exam.examDate ?? '—'}
            </Text>
            <Text color={textSub} fontSize="xs" mt={0.5}>
              {t('health.pending.for')}: {exam.user.name}
            </Text>
            {exam.doctorName ? (
              <Text color={textSub} fontSize="xs" mt={0.5}>
                {exam.doctorName}
              </Text>
            ) : null}
          </Box>
        );
      })}
    </Stack>
  );
};
