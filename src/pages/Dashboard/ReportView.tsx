import { useState, useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { Navigate, useParams } from 'react-router-dom';
import { ExpensesByCategoryPanel } from '../../components/reports/ExpensesByCategoryPanel';
import { ExpensesByStorePanel } from '../../components/reports/ExpensesByStorePanel';
import { LineChartExpensesByDate } from '../../components/reports/LineChartExpensesByDate';
import { TopProductsPanel } from '../../components/reports/TopProductsPanel';
import { BarChartExpensesIncome } from '../../components/reports/BarChartExpensesIncome';
import { CoinStatementPanel } from '../../components/reports/CoinStatementPanel';
import { WarrantyItemsPanel } from '../../components/reports/WarrantyItemsPanel';
import { HealthReportsPanel } from '../../components/reports/HealthReportsPanel';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { PageScaffold } from '../../components/PageScaffold';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useFamilyGroupsList } from '../../hooks/useFamilyGroupsList';
import type { ReportKey } from '../../types/reports';
import { isAdmin } from '../../utils/familyGroupPermissions';
import { sortFamilyGroupDtos } from '../../utils/familyGroupPriority';

const VALID_KEYS = new Set<ReportKey>([
  'expensesByCategory',
  'expensesByDate',
  'expensesVsIncome',
  'expensesByStore',
  'topProducts',
  'coinStatement',
  'warrantyItems',
  'healthReports',
]);

const TITLE_KEYS: Record<ReportKey, string> = {
  expensesByCategory: 'reports.expensesByGroup.title',
  expensesByDate: 'reports.expensesByDate.title',
  expensesVsIncome: 'reports.expensesIncome.title',
  expensesByStore: 'reports.expensesByStore.title',
  topProducts: 'reports.topProducts.title',
  coinStatement: 'reports.coinStatement.title',
  warrantyItems: 'reports.warrantyItems.title',
  healthReports: 'reports.healthReports.title',
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
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const { profile } = useAuth();
  const { data: groupsData } = useFamilyGroupsList();

  const currentUserId = profile?.user.id ?? '';

  const familyGroups = useMemo(
    () => sortFamilyGroupDtos(groupsData ?? [], currentUserId),
    [groupsData, currentUserId],
  );

  const [selectedFamilyGroupId, setSelectedFamilyGroupId] = useState<
    string | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { startDate: defaultStart, endDate: defaultEnd } = getMonthDateRange(month, year);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [statementPage, setStatementPage] = useState(1);
  const [warrantyPage, setWarrantyPage] = useState(1);

  useEffect(() => {
    if (familyGroups.length === 0) {
      setSelectedFamilyGroupId(null);
      return;
    }
    if (
      !selectedFamilyGroupId ||
      !familyGroups.some((g) => g.id === selectedFamilyGroupId)
    ) {
      setSelectedFamilyGroupId(familyGroups[0].id);
    }
  }, [familyGroups, selectedFamilyGroupId]);

  const selectedFamilyGroup =
    familyGroups.find((g) => g.id === selectedFamilyGroupId) ?? null;

  // Membro (não-admin): garante userId=eu para não pedir “família inteira” sem permissão.
  useEffect(() => {
    if (!selectedFamilyGroup || !currentUserId) return;
    if (isAdmin(selectedFamilyGroup, currentUserId)) return;
    if (selectedUserId == null) {
      setSelectedUserId(currentUserId);
    }
  }, [selectedFamilyGroup, selectedUserId, currentUserId]);

  useEffect(() => {
    const { startDate: s, endDate: e } = getMonthDateRange(month, year);
    setStartDate(s);
    setEndDate(e);
    setStatementPage(1);
  }, [month, year]);

  useEffect(() => {
    setStatementPage(1);
    setWarrantyPage(1);
  }, [startDate, endDate, selectedUserId, selectedFamilyGroupId]);

  useEffect(() => {
    setWarrantyPage(1);
  }, [year]);

  const key = VALID_KEYS.has(reportKey as ReportKey)
    ? (reportKey as ReportKey)
    : null;

  if (!key) {
    return <Navigate to="/dashboard" replace />;
  }
  const isYearOnly = key === 'expensesVsIncome' || key === 'warrantyItems';
  const userId = selectedUserId ?? undefined;
  const familyGroupId = selectedFamilyGroupId ?? undefined;
  const userIsAdmin = selectedFamilyGroup
    ? isAdmin(selectedFamilyGroup, currentUserId)
    : false;
  const showMemberName =
    (key === 'coinStatement' || key === 'warrantyItems') &&
    userIsAdmin &&
    !selectedUserId;

  const handleFamilyChange = (familyGroupIdValue: string | null) => {
    setSelectedFamilyGroupId(familyGroupIdValue);
    setSelectedUserId(null);
  };

  const renderChart = () => {
    switch (key) {
      case 'expensesByCategory':
        return (
          <ExpensesByCategoryPanel
            startDate={startDate}
            endDate={endDate}
            userId={userId}
            familyGroupId={familyGroupId}
          />
        );
      case 'expensesByDate':
        return (
          <LineChartExpensesByDate
            startDate={startDate}
            endDate={endDate}
            userId={userId}
            familyGroupId={familyGroupId}
          />
        );
      case 'expensesVsIncome':
        return (
          <BarChartExpensesIncome
            year={year.toString()}
            userId={userId}
            familyGroupId={familyGroupId}
          />
        );
      case 'expensesByStore':
        return (
          <ExpensesByStorePanel
            startDate={startDate}
            endDate={endDate}
            userId={userId}
            familyGroupId={familyGroupId}
          />
        );
      case 'topProducts':
        return (
          <TopProductsPanel
            startDate={startDate}
            endDate={endDate}
            userId={userId}
            familyGroupId={familyGroupId}
          />
        );
      case 'coinStatement':
        return (
          <CoinStatementPanel
            startDate={startDate}
            endDate={endDate}
            userId={userId}
            familyGroupId={familyGroupId}
            showMemberName={showMemberName}
            page={statementPage}
            onPageChange={setStatementPage}
          />
        );
      case 'warrantyItems':
        return (
          <WarrantyItemsPanel
            year={year}
            userId={userId}
            familyGroupId={familyGroupId}
            showMemberName={showMemberName}
            page={warrantyPage}
            onPageChange={setWarrantyPage}
          />
        );
      case 'healthReports':
        return (
          <HealthReportsPanel
            startDate={startDate}
            endDate={endDate}
            userId={userId}
          />
        );
    }
  };

  return (
    <PageScaffold
      title={t(TITLE_KEYS[key])}
      backTo="/dashboard"
      bg={getColor('background.dashboard.primary')}
      contentLayout="plain"
    >
      <ReportFilters
        month={month}
        year={year}
        startDate={startDate}
        endDate={endDate}
        selectedUserId={selectedUserId}
        selectedFamilyGroupId={selectedFamilyGroupId}
        familyGroups={familyGroups}
        currentUserId={currentUserId}
        yearOnly={isYearOnly}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onUserChange={setSelectedUserId}
        onFamilyChange={handleFamilyChange}
      />

      <Box mt={4}>
        {renderChart()}
      </Box>
    </PageScaffold>
  );
};
