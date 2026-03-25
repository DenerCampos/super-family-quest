import { useState, useEffect } from 'react';
import { Flex, IconButton, Text, Box } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PieChartExpenses } from '../../components/reports/PieChartExpensesByGroup';
import { BarChartExpensesByStore } from '../../components/reports/BarChartExpensesByStore';
import { LineChartExpensesByDate } from '../../components/reports/LineChartExpensesByDate';
import { HorizontalBarChartTopProducts } from '../../components/reports/HorizontalBarChartTopProducts';
import { BarChartExpensesIncome } from '../../components/reports/BarChartExpensesIncome';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services';
import type { FamilyGroupResponseDto } from '../../types/familyGroup';
import type { ReportKey } from '../../types/reports';

const VALID_KEYS = new Set<ReportKey>([
  'expensesByCategory',
  'expensesByDate',
  'expensesVsIncome',
  'expensesByStore',
  'topProducts',
]);

const TITLE_KEYS: Record<ReportKey, string> = {
  expensesByCategory: 'reports.expensesByGroup.title',
  expensesByDate: 'reports.expensesByDate.title',
  expensesVsIncome: 'reports.expensesIncome.title',
  expensesByStore: 'reports.expensesByStore.title',
  topProducts: 'reports.topProducts.title',
};

function getMonthDateRange(month: number, year: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return {
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0],
  };
}

export const ReportView = () => {
  const { reportKey } = useParams<{ reportKey: string }>();
  const navigate = useNavigate();
  const { getColor, getFont } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();

  const [familyGroup, setFamilyGroup] = useState<FamilyGroupResponseDto | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { startDate: defaultStart, endDate: defaultEnd } = getMonthDateRange(month, year);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    const { startDate: s, endDate: e } = getMonthDateRange(month, year);
    setStartDate(s);
    setEndDate(e);
  }, [month, year]);

  useEffect(() => {
    const loadFamilyGroup = async () => {
      try {
        const groups = await api.familyGroupList();
        setFamilyGroup(groups.length > 0 ? groups[0] : null);
      } catch {
        setFamilyGroup(null);
      }
    };
    loadFamilyGroup();
  }, []);

  const key = VALID_KEYS.has(reportKey as ReportKey)
    ? (reportKey as ReportKey)
    : null;

  if (!key) {
    return <Navigate to="/dashboard" replace />;
  }

  const isYearOnly = key === 'expensesVsIncome';
  const userId = selectedUserId ?? undefined;

  const renderChart = () => {
    switch (key) {
      case 'expensesByCategory':
        return <PieChartExpenses startDate={startDate} endDate={endDate} userId={userId} />;
      case 'expensesByDate':
        return <LineChartExpensesByDate startDate={startDate} endDate={endDate} userId={userId} />;
      case 'expensesVsIncome':
        return <BarChartExpensesIncome year={year.toString()} userId={userId} />;
      case 'expensesByStore':
        return <BarChartExpensesByStore startDate={startDate} endDate={endDate} userId={userId} />;
      case 'topProducts':
        return <HorizontalBarChartTopProducts startDate={startDate} endDate={endDate} userId={userId} />;
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg={getColor('background.dashboard.primary')}>
      <Flex direction="column" flex="1" p={4} pb={4}>
        <Flex
          direction="row"
          gap={4}
          justify="flex-start"
          align="center"
          mb={4}
        >
          <IconButton
            icon={<FiArrowLeft />}
            size="md"
            aria-label={t('common.back')}
            borderRadius="full"
            color={getColor('text.dashboard.title')}
            bg={getColor('background.dashboard.tileActive')}
            border="1px solid"
            borderColor={getColor('border.dashboard.tile')}
            _hover={{
              bg: getColor('border.dashboard.tileActive'),
              color: getColor('text.primary'),
            }}
            onClick={() => navigate('/dashboard')}
          />
          <Text
            color={getColor('text.dashboard.title')}
            fontSize="lg"
            fontWeight="bold"
            fontFamily={getFont('heading')}
          >
            {t(TITLE_KEYS[key])}
          </Text>
        </Flex>

        <Box maxW="600px" mx="auto" width="100%">
          <ReportFilters
            month={month}
            year={year}
            startDate={startDate}
            endDate={endDate}
            selectedUserId={selectedUserId}
            familyGroup={familyGroup}
            currentUserId={profile?.user.id ?? ''}
            yearOnly={isYearOnly}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onUserChange={setSelectedUserId}
          />

          <Box mt={4}>
            {renderChart()}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};
