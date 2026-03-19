import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToken,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCamera,
  FiDollarSign,
  FiEye,
  FiEyeOff,
  FiImage,
  FiMic,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import { FamilyStories } from "../../components/FamilyStories";
import { Header } from "../../components/Header";
import { LastRegistrationsList } from "../../components/LastRegistrationsList";
import { CompleteProfileModal } from "../../components/modals/CompleteProfileModal";
import { NewRecurringExpenseModal } from "../../components/modals/NewRecurringExpenseModal";
import { NewRecurringIncomeModal } from "../../components/modals/NewRecurringIncomeModal";
import { NavigationBar } from "../../components/NavigationBar";
import { SummaryCard } from "../../components/SummaryCard";
import { useAuth } from "../../contexts/AuthContext";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import { api } from "../../services";
import type { FamilyGroupSummaryDto, MemberSummary } from "../../types/familyGroup";

const RADIAN = Math.PI / 180;

const renderCustomLabel = (props: Record<string, unknown>) => {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type HomePieChartProps = {
  income: number;
  expenses: number;
  revenueColor: string;
  expenseColor: string;
};

const HomePieChart = ({
  income,
  expenses,
  revenueColor,
  expenseColor,
}: HomePieChartProps) => {
  const total = income + expenses;
  if (total === 0) {
    return (
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={[{ value: 1 }]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={42}
            innerRadius={18}
            fill="#E2E8F0"
            stroke="none"
          >
            <Label
              value="0%"
              position="center"
              fontSize={11}
              fontWeight="bold"
              fill="#A0AEC0"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const data = [
    { name: "income", value: income },
    { name: "expenses", value: expenses },
  ];

  const colors: Record<string, string> = {
    income: revenueColor,
    expenses: expenseColor,
  };

  return (
    <ResponsiveContainer width="100%" height={100}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={42}
          innerRadius={18}
          stroke="none"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={colors[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const Home = () => {
  const { profile, loadProfile, showValues, toggleShowValues } = useAuth();
  const { getColor } = useVisualTheme();

  const [revenueHex, expenseHex] = useToken("colors", [
    getColor("border.summaryCard.revenue"),
    getColor("border.summaryCard.expense"),
  ]);

  const location = useLocation();
  const [scanError, setScanError] = useState("");
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showRecurringRevenuesModal, setShowRecurringRevenuesModal] =
    useState(false);
  const [showRecurringExpensesModal, setShowRecurringExpensesModal] =
    useState(false);
  const [newRegistrationAdded, setNewRegistrationAdded] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [summary, setSummary] = useState<FamilyGroupSummaryDto | null>(null);
  const [hasGroup, setHasGroup] = useState(false);
  const navigate = useNavigate();
  const { t } = useThemedTranslation();

  const loadFamilyData = useCallback(async () => {
    try {
      const groups = await api.familyGroupList();
      if (groups.length > 0) {
        setHasGroup(true);
        const now = new Date();
        const data = await api.familyGroupGetSummary(
          groups[0].id,
          now.getMonth() + 1,
          now.getFullYear()
        );
        setSummary(data);
      } else {
        setHasGroup(false);
        setSummary(null);
      }
    } catch {
      setHasGroup(false);
      setSummary(null);
    }
  }, []);

  useEffect(() => {
    loadFamilyData();
  }, [loadFamilyData]);

  const familyMembers: MemberSummary[] = useMemo(() => {
    return summary?.members ?? [];
  }, [summary]);

  const selectedMember = useMemo(
    () => familyMembers.find((m) => m.userId === selectedMemberId) ?? null,
    [familyMembers, selectedMemberId]
  );

  const displayIncome = useMemo(() => {
    if (!hasGroup) return profile?.income ?? 0;
    if (selectedMember) return selectedMember.totalRevenues;
    return summary?.totalRevenues ?? 0;
  }, [hasGroup, selectedMember, summary, profile]);

  const displayExpenses = useMemo(() => {
    if (!hasGroup) return profile?.expenses ?? 0;
    if (selectedMember) return selectedMember.totalExpenses;
    return summary?.totalExpenses ?? 0;
  }, [hasGroup, selectedMember, summary, profile]);

  const incomeLabel = useMemo(() => {
    if (!hasGroup) return t("home.familyStories.familyIncome");
    if (selectedMember) {
      return t("home.familyStories.summaryIncome", {
        name: selectedMember.name,
      });
    }
    return t("home.familyStories.familyIncome");
  }, [hasGroup, selectedMember, t]);

  const expensesLabel = useMemo(() => {
    if (!hasGroup) return t("home.familyStories.familyExpenses");
    if (selectedMember) {
      return t("home.familyStories.summaryExpenses", {
        name: selectedMember.name,
      });
    }
    return t("home.familyStories.familyExpenses");
  }, [hasGroup, selectedMember, t]);

  useEffect(() => {
    if (location.state?.error) {
      setScanError(location.state.error);
      console.error(scanError);
    }
  }, [location.state]);

  useEffect(() => {
    if (profile && profile.isFirstAccess) {
      setShowCompleteProfile(true);
    }

    if (profile && profile.hasRecurringRevenues) {
      setShowRecurringRevenuesModal(true);
    }

    if (profile && profile.hasRecurringExpenses) {
      setShowRecurringExpensesModal(true);
    }
  }, [profile]);

  const handleCloseRecurringExpensesModal = async () => {
    setShowRecurringExpensesModal(false);
    await loadProfile();
  };

  const handleCloseRecurringRevenuesModal = async () => {
    setShowRecurringRevenuesModal(false);
    await loadProfile();
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      pb="70px"
      bg={getColor("background.home")}
    >
      <Header />

      {hasGroup && (
        <FamilyStories
          members={familyMembers}
          selectedId={selectedMemberId}
          onSelect={setSelectedMemberId}
        />
      )}

      {/* Conteúdo Principal */}
      <Flex direction="column" p={4} gap={4}>
        {/* Cards de Resumo com Pie Chart */}
        <Flex gap={2} align="center">
          {/* Pie Chart */}
          <Box w="28%" minW="90px" flexShrink={0}>
            <HomePieChart
              income={displayIncome}
              expenses={displayExpenses}
              revenueColor={revenueHex}
              expenseColor={expenseHex}
            />
          </Box>

          {/* Cards */}
          <Flex direction="column" gap={2} flex={1} minW={0} position="relative">
            <Button
              position="absolute"
              right={0}
              top={0}
              size="xs"
              variant="ghost"
              color={getColor("text.eye")}
              _hover={{
                bg: getColor("button.hover.background.inverse"),
                color: getColor("button.hover.text.inverse"),
              }}
              onClick={toggleShowValues}
              zIndex={1}
              minW="auto"
              p={1}
            >
              <Icon as={showValues ? FiEyeOff : FiEye} />
            </Button>
            <SummaryCard
              title={incomeLabel}
              value={displayIncome}
              type="revenue"
              compact
            />
            <SummaryCard
              title={expensesLabel}
              value={displayExpenses}
              type="expense"
              compact
            />
          </Flex>
        </Flex>

        {/* Menus de Ação */}
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <Menu>
            <MenuButton
              as={Button}
              role="group"
              color={getColor("button.text.expense")}
              bg={getColor("button.background.expense")}
              border="1px solid"
              borderColor={getColor("button.border.expense")}
              _hover={{
                bg: getColor("button.hover.background.expense"),
                color: getColor("button.hover.text.inverse"),
                borderColor: getColor("button.hover.border.expense"),
              }}
              size="lg"
              leftIcon={
                <Icon
                  as={FiShoppingBag}
                  color={getColor("button.text.expense")}
                  _groupHover={{ color: getColor("button.hover.text.inverse") }}
                />
              }
              w="full"
            >
              {t("home.addExpense")}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiPlus />} onClick={() => navigate("/expense")}>
                {t("home.newExpense")}
              </MenuItem>
              <MenuItem icon={<FiCamera />} onClick={() => navigate("/scan")}>
                {t("home.scanQRCode")}
              </MenuItem>
              <MenuItem
                icon={<FiImage />}
                onClick={() => navigate("/image-recognition")}
              >
                {t("home.scanReceipt")}
              </MenuItem>
              <MenuItem
                icon={<FiMic />}
                onClick={() => navigate("/audio-recognition")}
              >
                {t("home.recordAudio")}
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              role="group"
              color={getColor("button.text.revenue")}
              bg={getColor("button.background.revenue")}
              border="1px solid"
              borderColor={getColor("button.border.revenue")}
              _hover={{
                bg: getColor("button.hover.background.revenue"),
                color: getColor("button.hover.text.inverse"),
                borderColor: getColor("button.hover.border.revenue"),
              }}
              size="lg"
              leftIcon={
                <Icon
                  as={FiDollarSign}
                  color={getColor("button.text.revenue")}
                  _groupHover={{ color: getColor("button.hover.text.inverse") }}
                />
              }
              w="full"
            >
              {t("home.addRevenue")}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiPlus />} onClick={() => navigate("/revenue")}>
                {t("home.newRevenue")}
              </MenuItem>
              <MenuItem
                icon={<FiImage />}
                onClick={() =>
                  navigate("/image-recognition", {
                    state: { from: "revenue" },
                  })
                }
              >
                {t("home.scanReceipt")}
              </MenuItem>
              <MenuItem
                icon={<FiMic />}
                onClick={() =>
                  navigate("/audio-recognition", {
                    state: { from: "revenue" },
                  })
                }
              >
                {t("home.recordAudio")}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <LastRegistrationsList
          newRegistrationAdded={newRegistrationAdded}
          setNewRegistrationAdded={setNewRegistrationAdded}
        />
      </Flex>

      <CompleteProfileModal
        isOpen={showCompleteProfile}
        user={{
          email: profile?.user.email || "",
          name: profile?.user.name || "",
        }}
        onComplete={() => {
          setShowCompleteProfile(false);
          loadProfile();
        }}
      />

      <NewRecurringIncomeModal
        isOpen={showRecurringRevenuesModal}
        onClose={handleCloseRecurringRevenuesModal}
      />

      <NewRecurringExpenseModal
        isOpen={showRecurringExpensesModal}
        onClose={handleCloseRecurringExpensesModal}
      />

      <NavigationBar />
    </Flex>
  );
};

export default Home;
