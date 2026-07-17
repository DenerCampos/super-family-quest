import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useHealthExams } from '../../hooks/useHealthExams';
import { useFamilyGroup } from '../../hooks/useFamilyGroup';
import type { HealthExamDto, HealthExamFilterParams, HealthExamType } from '../../types/health';
import {
  getHealthExamTypeFilterOptions,
  getHealthExamTypeOptions,
} from '../../utils/healthConstants';
import { formatAppDate } from '../../utils/formatDate';

export const HealthSearchView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { familyGroup } = useFamilyGroup({ fetchSummary: false, fetchInvitations: false });

  const [examName, setExamName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [labName, setLabName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [examType, setExamType] = useState<HealthExamType | ''>('');
  const [userId, setUserId] = useState('');
  const [filter, setFilter] = useState<HealthExamFilterParams>({});
  const [selectedExam, setSelectedExam] = useState<HealthExamDto | null>(null);

  const { data, isLoading } = useHealthExams(filter);
  const examTypeFilterOptions = getHealthExamTypeFilterOptions(t);
  const examTypeLabels = Object.fromEntries(
    getHealthExamTypeOptions(t).map((opt) => [opt.value, opt.label]),
  ) as Record<HealthExamType, string>;

  const handleSearch = () => {
    setFilter({
      examName: examName || undefined,
      doctorName: doctorName || undefined,
      labName: labName || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      examType: examType || undefined,
      userId: userId || undefined,
    });
  };

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const primaryBtnBg = getColor('button.background.primary');
  const primaryBtnText = getColor('button.text.primary');
  const warningColor = getColor('status.warning');
  const infoColor = getColor('status.info');

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar title={t('health.search.title')} backTo="/new-resources/health" />

      <Flex flex={1} minH={0} direction="column" align="center" overflow="auto" pt={4} px={4} pb={20}>
        <Box width="100%" maxW="600px">
          <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
            <Stack spacing={2}>
              {familyGroup && (
                <Select bg={inputBg} size="sm" value={userId} onChange={(e) => setUserId(e.target.value)} color={textPrimary}>
                  <option value="">{t('health.search.allMembers')}</option>
                  {familyGroup.members.map((m) => (
                    <option key={m.user?.id} value={m.user?.id ?? ''}>{m.user?.name}</option>
                  ))}
                </Select>
              )}

              <InputGroup size="sm">
                <InputLeftElement><Icon as={FiSearch} color={textSub} /></InputLeftElement>
                <Input bg={inputBg} pl={8} placeholder={t('health.search.byExamName')} value={examName} onChange={(e) => setExamName(e.target.value)} color={textPrimary} />
              </InputGroup>

              <InputGroup size="sm">
                <InputLeftElement><Icon as={FiSearch} color={textSub} /></InputLeftElement>
                <Input bg={inputBg} pl={8} placeholder={t('health.search.byDoctorName')} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} color={textPrimary} />
              </InputGroup>

              <InputGroup size="sm">
                <InputLeftElement><Icon as={FiSearch} color={textSub} /></InputLeftElement>
                <Input bg={inputBg} pl={8} placeholder={t('health.search.byLabName')} value={labName} onChange={(e) => setLabName(e.target.value)} color={textPrimary} />
              </InputGroup>

              <Select bg={inputBg} size="sm" value={examType} onChange={(e) => setExamType(e.target.value as HealthExamType | '')} color={textPrimary}>
                {examTypeFilterOptions.map((et) => (
                  <option key={et.value || 'all'} value={et.value}>{et.label}</option>
                ))}
              </Select>

              <Grid templateColumns="1fr 1fr" gap={2}>
                <Input bg={inputBg} size="sm" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} color={textPrimary} />
                <Input bg={inputBg} size="sm" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} color={textPrimary} />
              </Grid>

              <Button size="sm" bg={primaryBtnBg} color={primaryBtnText} _hover={{ opacity: 0.9 }} onClick={handleSearch} isLoading={isLoading}>
                {t('health.search.search')}
              </Button>
            </Stack>
          </Box>

          {isLoading && (
            <Flex justify="center" py={6}><Spinner /></Flex>
          )}

          {!isLoading && data?.data && data.data.length === 0 && (
            <Box bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={6} textAlign="center">
              <Text color={textSub} fontSize="sm">{t('health.search.noResults')}</Text>
            </Box>
          )}

          <Stack spacing={3}>
            {data?.data?.map((exam) => (
              <Box
                key={exam.id}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={selectedExam?.id === exam.id ? getColor('text.familyGroup.primary') : borderColor}
                p={4}
                cursor="pointer"
                onClick={() => {
                  setSelectedExam(selectedExam?.id === exam.id ? null : exam);
                }}
              >
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Box flex={1}>
                    <Text color={textPrimary} fontSize="sm" fontWeight="semibold">
                      {exam.labName ?? t('health.search.unknownLab')}
                    </Text>
                    <Text color={textSub} fontSize="xs">
                      {exam.doctorName ? t('health.doctorPrefix', { name: exam.doctorName }) : ''}
                      {exam.examDate ? ` · ${formatAppDate(exam.examDate)}` : ''}
                    </Text>
                  </Box>
                  <Flex gap={1} align="center" flexShrink={0}>
                    {exam.items.some((i) => i.isAbnormal) && (
                      <Icon as={FiAlertTriangle} color={warningColor} boxSize={4} />
                    )}
                    <Badge bg={infoColor} color={textPrimary} size="sm">
                      {examTypeLabels[exam.examType]}
                    </Badge>
                  </Flex>
                </Flex>

                {selectedExam?.id === exam.id && (
                  <Stack spacing={1} mt={2}>
                    {exam.items.map((item) => (
                      <Flex key={item.id} justify="space-between" align="center" bg={inputBg} borderRadius="sm" px={2} py={1}>
                        <Text color={item.isAbnormal ? warningColor : textPrimary} fontSize="xs" fontWeight={item.isAbnormal ? 'bold' : 'normal'} flex={1}>
                          {item.itemName}
                        </Text>
                        {item.resultValue && (
                          <Text color={item.isAbnormal ? warningColor : textSub} fontSize="xs" ml={2}>
                            {item.resultValue} {item.resultUnit ?? ''}
                            {item.referenceRange
                              ? ` ${t('health.search.referenceRange', { range: item.referenceRange })}`
                              : ''}
                          </Text>
                        )}
                        {item.isAbnormal && (
                          <Badge
                            bg={warningColor}
                            color={textPrimary}
                            size="sm"
                            ml={1}
                            aria-label={t('health.common.abnormal')}
                          >
                            {t('health.common.abnormalMarker')}
                          </Badge>
                        )}
                      </Flex>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
