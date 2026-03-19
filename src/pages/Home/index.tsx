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
import { useEffect, useMemo, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { FamilyStories } from "../../components/FamilyStories";
import { Header } from "../../components/Header";
import { HomePieChart } from "../../components/HomePieChart";
import { LastRegistrationsList } from "../../components/LastRegistrationsList";
import { CompleteProfileModal } from "../../components/modals/CompleteProfileModal";
import { NewRecurringExpenseModal } from "../../components/modals/NewRecurringExpenseModal";
import { NewRecurringIncomeModal } from "../../components/modals/NewRecurringIncomeModal";
import { NavigationBar } from "../../components/NavigationBar";
import { SummaryCard } from "../../components/SummaryCard";
import { useAuth } from "../../contexts/AuthContext";
import { useFamilyGroup } from "../../hooks/useFamilyGroup";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";

const Home = () => {
  const { profile, loadProfile, showValues, toggleShowValues } = useAuth();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();

  const [revenueHex, expenseHex, emptyFillHex, emptyLabelHex, labelHex] =
    useToken("colors", [
      getColor("border.summaryCard.revenue"),
      getColor("border.summaryCard.expense"),
      getColor("border.noSelect"),
      getColor("text.disabled"),
      getColor("text.primary"),
    ]);

  const location = useLocation();
  const navigate = useNavigate();
  const [scanError, setScanError] = useState("");
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showRecurringRevenuesModal, setShowRecurringRevenuesModal] =
    useState(false);
  const [showRecurringExpensesModal, setShowRecurringExpensesModal] =
    useState(false);
  const [newRegistrationAdded, setNewRegistrationAdded] = useState(false);

  const {
    hasGroup,
    familyMembers,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    summary,
  } = useFamilyGroup();

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

      <Flex direction="column" p={4} gap={4}>
        <Flex gap={2} align="center">
          <Box w="28%" minW="90px" flexShrink={0}>
            <HomePieChart
              income={displayIncome}
              expenses={displayExpenses}
              revenueColor={revenueHex}
              expenseColor={expenseHex}
              emptyFillColor={emptyFillHex}
              emptyLabelColor={emptyLabelHex}
              labelColor={labelHex}
            />
          </Box>

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
