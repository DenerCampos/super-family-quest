import {
  Flex,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { FamilyStories } from "../../components/FamilyStories";
import { FixedAppShell } from "../../components/FixedAppShell";
import { HomeQuickActions } from "../../components/home/HomeQuickActions";
import { MonthlyBalanceCard } from "../../components/home/MonthlyBalanceCard";
import { LastRegistrationsList } from "../../components/LastRegistrationsList";
import { FinancialReceiptDrawer } from "../../components/financial-receipt/FinancialReceiptDrawer";
import { CompleteProfileModal } from "../../components/modals/CompleteProfileModal";
import { NewRecurringExpenseModal } from "../../components/modals/NewRecurringExpenseModal";
import { NewRecurringIncomeModal } from "../../components/modals/NewRecurringIncomeModal";
import { useAuth } from "../../contexts/AuthContext";
import { useFamilyGroup } from "../../hooks/useFamilyGroup";
import { useFinancialReceiptDrawer } from "../../hooks/useFinancialReceiptDrawer";
import { useInvalidateFinancialSummary } from "../../hooks/useInvalidateFinancialSummary";
import { useThemedTranslation } from "../../hooks/useThemedTranslation";
import { useVisualTheme } from "../../hooks/useVisualTheme";
import { api } from "../../services";
import {
  isRecurringModalSnoozed,
  snoozeRecurringModal,
} from "../../utils/recurringModalSnooze";

const Home = () => {
  const { profile, loadProfile, showValues, toggleShowValues } = useAuth();
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [revenueHex, expenseHex, emptyFillHex, emptyLabelHex] =
    useToken("colors", [
      getColor("border.summaryCard.revenue"),
      getColor("border.summaryCard.expense"),
      getColor("border.noSelect"),
      getColor("text.disabled"),
    ]);

  const location = useLocation();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showRecurringRevenuesModal, setShowRecurringRevenuesModal] =
    useState(false);
  const [showRecurringExpensesModal, setShowRecurringExpensesModal] =
    useState(false);
  const [newRegistrationAdded, setNewRegistrationAdded] = useState(false);
  const { target, openReceipt, closeReceipt } = useFinancialReceiptDrawer();
  const invalidateFinancialSummary = useInvalidateFinancialSummary();

  const handleDeleteRegistration = async (
    id: string,
    type: "expense" | "revenue",
  ) => {
    try {
      if (type === "expense") {
        await api.deleteExpense({ id });
      } else {
        await api.deleteRevenue({ id });
      }
      toast({
        title:
          type === "expense"
            ? t("resources.expense.deleteSuccess")
            : t("resources.revenue.deleteSuccess"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      void invalidateFinancialSummary();
    } catch {
      toast({
        title:
          type === "expense"
            ? t("resources.expense.deleteError")
            : t("resources.revenue.deleteError"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  const displayMasked = useMemo(() => {
    if (!hasGroup) return false;
    if (selectedMember) return selectedMember.masked ?? false;
    return false;
  }, [hasGroup, selectedMember]);

  const balanceScopeName = useMemo(() => {
    if (!hasGroup) {
      return profile?.user.name ?? t('home.familyStories.familyLabel');
    }
    if (selectedMember) {
      return selectedMember.name;
    }
    return t('home.familyStories.familyLabel');
  }, [hasGroup, selectedMember, profile?.user.name, t]);

  const balanceLabel = useMemo(
    () =>
      t('home.balance.currentBalanceOf', {
        name: balanceScopeName,
      }),
    [balanceScopeName, t],
  );

  useEffect(() => {
    if (location.state?.error) {
      console.error(location.state.error);
    }
  }, [location.state]);

  useEffect(() => {
    if (profile && profile.isFirstAccess) {
      setShowCompleteProfile(true);
    }

    if (profile && profile.hasRecurringRevenues && !isRecurringModalSnoozed('income')) {
      setShowRecurringRevenuesModal(true);
    }

    if (profile && profile.hasRecurringExpenses && !isRecurringModalSnoozed('expense')) {
      setShowRecurringExpensesModal(true);
    }
  }, [profile]);

  const handleDismissRecurringExpensesModal = (rememberLater: boolean) => {
    if (rememberLater) {
      snoozeRecurringModal('expense');
    }
    setShowRecurringExpensesModal(false);
  };

  const handleDismissRecurringRevenuesModal = (rememberLater: boolean) => {
    if (rememberLater) {
      snoozeRecurringModal('income');
    }
    setShowRecurringRevenuesModal(false);
  };

  const handleCloseRecurringExpensesModal = async () => {
    setShowRecurringExpensesModal(false);
    await loadProfile();
  };

  const handleCloseRecurringRevenuesModal = async () => {
    setShowRecurringRevenuesModal(false);
    await loadProfile();
  };

  return (
    <FixedAppShell bg={getColor("background.home")}>
      {hasGroup && (
        <FamilyStories
          members={familyMembers}
          selectedId={selectedMemberId}
          onSelect={setSelectedMemberId}
        />
      )}

      <Flex direction="column" p={4} gap={3} flexShrink={0}>
        <MonthlyBalanceCard
          title={t("home.balance.title")}
          balanceLabel={balanceLabel}
          income={displayIncome}
          expenses={displayExpenses}
          masked={displayMasked}
          showValues={showValues}
          onToggleVisibility={toggleShowValues}
          revenueColor={revenueHex}
          expenseColor={expenseHex}
          emptyFillColor={emptyFillHex}
          emptyLabelColor={emptyLabelHex}
        />

        <HomeQuickActions />
      </Flex>

      <Flex flex={1} minH={0} overflow="auto" px={4} pb={20} w="full">
        <LastRegistrationsList
          newRegistrationAdded={newRegistrationAdded}
          setNewRegistrationAdded={setNewRegistrationAdded}
          onDelete={handleDeleteRegistration}
          onView={(id, type) => openReceipt(type, id)}
        />
      </Flex>

      <FinancialReceiptDrawer target={target} onClose={closeReceipt} />

      <CompleteProfileModal
        isOpen={showCompleteProfile}
        user={{
          email: profile?.user.email || "",
          name: profile?.user.name || "",
        }}
        onComplete={() => {
          setShowCompleteProfile(false);
          queryClient.clear();
          loadProfile();
        }}
      />

      <NewRecurringIncomeModal
        isOpen={showRecurringRevenuesModal}
        onClose={handleCloseRecurringRevenuesModal}
        onDismiss={handleDismissRecurringRevenuesModal}
      />

      <NewRecurringExpenseModal
        isOpen={showRecurringExpensesModal}
        onClose={handleCloseRecurringExpensesModal}
        onDismiss={handleDismissRecurringExpensesModal}
      />

    </FixedAppShell>
  );
};

export default Home;
