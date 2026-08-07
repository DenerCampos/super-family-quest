import {
  Badge,
  Box,
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
import { useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { FixedAppShell } from '../../components/FixedAppShell';
import { PageTitleBar } from '../../components/PageTitleBar';
import {
  HealthEvolutionChart,
  type EvolutionChartPoint,
} from '../../components/health/HealthEvolutionChart';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminFamilyMembers } from '../../hooks/useAdminFamilyMembers';
import {
  useHealthLabItemEvolution,
  useHealthLabItemNames,
} from '../../hooks/useHealthEvolution';
import {
  parseHealthResultValue,
  parseReferenceRange,
} from '../../utils/healthValue';
import { formatAppDate } from '../../utils/formatDate';

const formatNumber = (value: number): string =>
  value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export const HealthEvolutionView = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const { members: adminMembers, isAdminAnywhere } = useAdminFamilyMembers();

  const currentUserId = profile?.user.id ?? '';
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const effectiveUserId = selectedUserId ?? currentUserId;

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setSelectedItem('');
  }, [effectiveUserId]);

  const {
    data: itemNames,
    isLoading: isLoadingNames,
    isError: isErrorNames,
  } = useHealthLabItemNames({
    userId: effectiveUserId || undefined,
    search: debouncedSearch || undefined,
  });

  useEffect(() => {
    if (selectedItem && itemNames && !itemNames.includes(selectedItem)) {
      setSelectedItem('');
    }
  }, [itemNames, selectedItem]);

  const {
    data: evolution,
    isLoading: isLoadingEvolution,
    isError: isErrorEvolution,
  } = useHealthLabItemEvolution(
    selectedItem
      ? {
          itemName: selectedItem,
          userId: effectiveUserId || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }
      : null,
  );

  const series = useMemo(() => {
    return (evolution ?? [])
      .map((point) => ({
        ...point,
        numericValue: parseHealthResultValue(point.resultValue),
      }))
      .filter((point) => point.numericValue != null && Boolean(point.examDate));
  }, [evolution]);

  const chartData: EvolutionChartPoint[] = useMemo(
    () =>
      series.map((point) => ({
        date: point.examDate as string,
        value: point.numericValue as number,
        isAbnormal: point.isAbnormal,
      })),
    [series],
  );

  const stats = useMemo(() => {
    if (series.length === 0) return null;
    const values = series.map((p) => p.numericValue as number);
    const first = series[0];
    const last = series[series.length - 1];
    const sum = values.reduce((acc, v) => acc + v, 0);
    const delta =
      (last.numericValue as number) - (first.numericValue as number);
    const firstValue = first.numericValue as number;
    const deltaPct = firstValue !== 0 ? (delta / firstValue) * 100 : null;

    return {
      count: series.length,
      firstDate: first.examDate,
      lastDate: last.examDate,
      lastValue: last.numericValue as number,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      delta,
      deltaPct,
      abnormalCount: series.filter((p) => p.isAbnormal).length,
      unit: last.resultUnit,
      referenceText: last.referenceRange,
    };
  }, [series]);

  const referenceRange = useMemo(
    () => (stats ? parseReferenceRange(stats.referenceText) : null),
    [stats],
  );

  const bg = getColor('background.resources');
  const cardBg = getColor('background.familyGroup.card');
  const borderColor = getColor('border.familyGroup.card');
  const textPrimary = getColor('text.dashboard.title');
  const textSub = getColor('text.dashboard.tileSubtitle');
  const inputBg = getColor('input.primary');
  const warningColor = getColor('status.warning');
  const successColor = getColor('status.success');
  const errorColor = getColor('status.error');

  const infoItems = stats
    ? [
        {
          label: t('health.evolution.info.lastValue'),
          value: `${formatNumber(stats.lastValue)}${
            stats.unit ? ` ${stats.unit}` : ''
          }`,
          hint: stats.lastDate ? formatAppDate(stats.lastDate) : undefined,
        },
        {
          label: t('health.evolution.info.variation'),
          value:
            `${stats.delta >= 0 ? '+' : ''}${formatNumber(stats.delta)}` +
            (stats.deltaPct != null
              ? ` (${stats.deltaPct >= 0 ? '+' : ''}${stats.deltaPct.toFixed(1)}%)`
              : ''),
        },
        {
          label: t('health.evolution.info.min'),
          value: formatNumber(stats.min),
        },
        {
          label: t('health.evolution.info.max'),
          value: formatNumber(stats.max),
        },
        {
          label: t('health.evolution.info.avg'),
          value: formatNumber(stats.avg),
        },
        {
          label: t('health.evolution.info.count'),
          value: String(stats.count),
        },
      ]
    : [];

  return (
    <FixedAppShell bg={bg}>
      <PageTitleBar
        title={t('health.evolution.title')}
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
          <Box
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={4}
            mb={4}
          >
            <Stack spacing={2}>
              {isAdminAnywhere && adminMembers.length > 1 && (
                <Select
                  bg={inputBg}
                  size="sm"
                  value={effectiveUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  color={textPrimary}
                  borderColor={borderColor}
                >
                  {adminMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                      {m.id === currentUserId
                        ? ` (${t('health.evolution.me')})`
                        : ''}
                    </option>
                  ))}
                </Select>
              )}

              <InputGroup size="sm">
                <InputLeftElement>
                  <Icon as={FiSearch} color={textSub} />
                </InputLeftElement>
                <Input
                  bg={inputBg}
                  pl={8}
                  placeholder={t('health.evolution.searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  color={textPrimary}
                  borderColor={borderColor}
                />
              </InputGroup>

              <Select
                bg={inputBg}
                size="sm"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                color={textPrimary}
                borderColor={borderColor}
                isDisabled={isLoadingNames}
              >
                <option value="">
                  {t('health.evolution.selectExamPlaceholder')}
                </option>
                {itemNames?.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>

              <Grid templateColumns="1fr 1fr" gap={2}>
                <Input
                  bg={inputBg}
                  size="sm"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  color={textPrimary}
                  borderColor={borderColor}
                />
                <Input
                  bg={inputBg}
                  size="sm"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  color={textPrimary}
                  borderColor={borderColor}
                />
              </Grid>
            </Stack>
          </Box>

          {!selectedItem && (
            <Box
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              textAlign="center"
            >
              <Icon as={FiTrendingUp} color={textSub} boxSize={6} mb={2} />
              <Text
                color={isErrorNames ? errorColor : textSub}
                fontSize="sm"
              >
                {isErrorNames
                  ? t('health.evolution.loadNamesError')
                  : isLoadingNames
                    ? t('health.evolution.loadingExams')
                    : itemNames && itemNames.length === 0
                      ? t('health.evolution.noExams')
                      : t('health.evolution.selectHint')}
              </Text>
            </Box>
          )}

          {selectedItem && isLoadingEvolution && (
            <Flex justify="center" py={8}>
              <Spinner />
            </Flex>
          )}

          {selectedItem && !isLoadingEvolution && isErrorEvolution && (
            <Box
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              textAlign="center"
            >
              <Text color={errorColor} fontSize="sm">
                {t('health.evolution.loadEvolutionError')}
              </Text>
            </Box>
          )}

          {selectedItem &&
            !isLoadingEvolution &&
            !isErrorEvolution &&
            chartData.length < 2 && (
            <Box
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              textAlign="center"
            >
              <Text color={textSub} fontSize="sm">
                {t('health.evolution.notEnoughData')}
              </Text>
            </Box>
          )}

          {selectedItem &&
            !isLoadingEvolution &&
            !isErrorEvolution &&
            chartData.length >= 2 && (
            <Stack spacing={4}>
              <Box
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                p={4}
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Text color={textPrimary} fontSize="sm" fontWeight="semibold">
                    {t('health.evolution.chartTitle')}: {selectedItem}
                  </Text>
                  {stats && stats.abnormalCount > 0 && (
                    <Flex align="center" gap={1}>
                      <Icon
                        as={FiAlertTriangle}
                        color={warningColor}
                        boxSize={3.5}
                      />
                      <Text color={warningColor} fontSize="xs">
                        {t('health.evolution.abnormalCount', {
                          count: stats.abnormalCount,
                        })}
                      </Text>
                    </Flex>
                  )}
                </Flex>

                <HealthEvolutionChart
                  data={chartData}
                  unit={stats?.unit}
                  reference={referenceRange}
                />

                {stats && (
                  <Text color={textSub} fontSize="xs" mt={2}>
                    {t('health.evolution.period', {
                      from: stats.firstDate
                        ? formatAppDate(stats.firstDate)
                        : '',
                      to: stats.lastDate ? formatAppDate(stats.lastDate) : '',
                    })}
                  </Text>
                )}
              </Box>

              {stats && (
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={4}
                >
                  <Text
                    color={textPrimary}
                    fontSize="sm"
                    fontWeight="semibold"
                    mb={3}
                  >
                    {t('health.evolution.info.title')}
                  </Text>

                  <Grid templateColumns="1fr 1fr" gap={3}>
                    {infoItems.map((item) => (
                      <Box key={item.label}>
                        <Text color={textSub} fontSize="xs">
                          {item.label}
                        </Text>
                        <Text
                          color={textPrimary}
                          fontSize="sm"
                          fontWeight="semibold"
                        >
                          {item.value}
                        </Text>
                        {item.hint && (
                          <Text color={textSub} fontSize="xs">
                            {item.hint}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </Grid>

                  {stats.referenceText && (
                    <Box
                      mt={3}
                      pt={3}
                      borderTopWidth="1px"
                      borderColor={borderColor}
                    >
                      <Text color={textSub} fontSize="xs" mb={1}>
                        {t('health.evolution.info.reference')}
                      </Text>
                      <Badge bg={successColor} color={textPrimary} size="sm">
                        {stats.referenceText}
                        {stats.unit ? ` ${stats.unit}` : ''}
                      </Badge>
                    </Box>
                  )}
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Flex>
    </FixedAppShell>
  );
};
