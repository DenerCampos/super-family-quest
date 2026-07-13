import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { ImageRecognitionPage } from "./components/ImageRecognitionPage";
import { AudioRecognitionPage } from "./components/AudioRecognitionPage";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { QRScannerPage } from "./components/QRScannerPage";
import { RequireAuth } from "./components/RequireAuth";
import { useThemeColor } from "./hooks/useThemeColor";
import { useVisualTheme } from "./hooks/useVisualTheme";
import { resolveChakraColor } from "./utils/resolveColor";
import Dashboard from "./pages/Dashboard";
import { ReportView } from "./pages/Dashboard/ReportView";
import { HealthReportDetailView } from "./pages/Dashboard/HealthReportDetailView";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewChallenge from "./pages/NewChallenge";
import { MissionsView } from "./pages/Missions/MissionsView";
import { QuestsListView } from "./pages/NewChallenge/QuestsListView";
import { QuestOccurrenceDetailView } from "./pages/NewChallenge/QuestOccurrenceDetailView";
import { DefinitionsListView } from "./pages/NewChallenge/DefinitionsListView";
import { DefinitionFormView } from "./pages/NewChallenge/DefinitionFormView";
import { ApprovalsView } from "./pages/NewChallenge/ApprovalsView";
import { AllowanceView } from "./pages/NewChallenge/AllowanceView";
import { SettlementsView } from "./pages/NewChallenge/SettlementsView";
import { HistoryView } from "./pages/NewChallenge/HistoryView";
import NewResources from "./pages/NewResources";
import { ResourcesView } from "./pages/NewResources/ResourcesView";
import { FamilyGroupView } from "./pages/NewResources/FamilyGroupView";
import { ShoppingListsView } from "./pages/NewResources/ShoppingListsView";
import { ShoppingListDetailView } from "./pages/NewResources/ShoppingListDetailView";
import { RecipesView } from "./pages/NewResources/RecipesView";
import { RecipeDetailView } from "./pages/NewResources/RecipeDetailView";
import { RecipeFormView } from "./pages/NewResources/RecipeFormView";
import NewHealthHub from "./pages/NewHealth";
import { HealthRegisterView } from "./pages/NewHealth/HealthRegisterView";
import { HealthExamsView } from "./pages/NewHealth/HealthExamsView";
import { HealthExamDetailView } from "./pages/NewHealth/HealthExamDetailView";
import { HealthExamEditView } from "./pages/NewHealth/HealthExamEditView";
import { HealthPendingView } from "./pages/NewHealth/HealthPendingView";
import { HealthPendingDetailView } from "./pages/NewHealth/HealthPendingDetailView";
import { HealthSearchView } from "./pages/NewHealth/HealthSearchView";
import { HealthOverviewView } from "./pages/NewHealth/HealthOverviewView";
import { HealthFeelingNowView } from "./pages/NewHealth/HealthFeelingNowView";
import { HealthPrescriptionsView } from "./pages/NewHealth/HealthPrescriptionsView";
import { HealthPrescriptionDetailView } from "./pages/NewHealth/HealthPrescriptionDetailView";
import { HealthPrescriptionFormView } from "./pages/NewHealth/HealthPrescriptionFormView";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Revenue from "./pages/Revenue";
import Settings from "./pages/Settings";
import AlexaLogin from "./pages/AlexaLogin";
import DemoLogin from "./pages/DemoLogin";
import { Expenses } from "./pages/Expenses";

export default function App() {
  const { theme } = useVisualTheme();
  useThemeColor();

  const outerBg = resolveChakraColor(theme.colors.background.shell.outer);
  const desktopShadow = resolveChakraColor(
    theme.colors.background.shell.desktopPanelShadow,
  );

  return (
    <Box
      minH="100vh"
      bg={outerBg}
    >
      <Box
        maxW="480px"
        mx="auto"
        minH="100vh"
        position="relative"
        boxShadow={{ base: 'none', md: desktopShadow }}
        overflow="hidden"
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/alexa-login" element={<AlexaLogin />} />
          <Route path="/demo/:key" element={<DemoLogin />} />
          <Route path="*" element={<NotFoundPage />} />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/health-report/:overviewId"
            element={
              <RequireAuth>
                <HealthReportDetailView />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/:reportKey"
            element={
              <RequireAuth>
                <ReportView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources"
            element={
              <RequireAuth>
                <NewResources />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/resources"
            element={
              <RequireAuth>
                <ResourcesView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/family"
            element={
              <RequireAuth>
                <FamilyGroupView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/shopping"
            element={
              <RequireAuth>
                <ShoppingListsView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/shopping/:id"
            element={
              <RequireAuth>
                <ShoppingListDetailView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/recipes/new"
            element={
              <RequireAuth>
                <RecipeFormView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/recipes/:id/edit"
            element={
              <RequireAuth>
                <RecipeFormView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/recipes/:id"
            element={
              <RequireAuth>
                <RecipeDetailView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/recipes"
            element={
              <RequireAuth>
                <RecipesView />
              </RequireAuth>
            }
          />
          {/* Hub de quests (antigo new-challenge) */}
          <Route
            path="/new-resources/quests"
            element={
              <RequireAuth>
                <NewChallenge />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/chores/:occurrenceId"
            element={
              <RequireAuth>
                <QuestOccurrenceDetailView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/chores"
            element={
              <RequireAuth>
                <QuestsListView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/definitions/:definitionId"
            element={
              <RequireAuth>
                <DefinitionFormView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/definitions"
            element={
              <RequireAuth>
                <DefinitionsListView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/approvals"
            element={
              <RequireAuth>
                <ApprovalsView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/allowance"
            element={
              <RequireAuth>
                <AllowanceView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/settlements"
            element={
              <RequireAuth>
                <SettlementsView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-resources/quests/history"
            element={
              <RequireAuth>
                <HistoryView />
              </RequireAuth>
            }
          />
          {/* SP-123 — Módulo de Saúde */}
          <Route path="/new-resources/health" element={<RequireAuth><NewHealthHub /></RequireAuth>} />
          <Route path="/new-resources/health/feeling-now" element={<RequireAuth><HealthFeelingNowView /></RequireAuth>} />
          <Route path="/new-resources/health/register" element={<RequireAuth><HealthRegisterView /></RequireAuth>} />
          <Route path="/new-resources/health/exams" element={<RequireAuth><HealthExamsView /></RequireAuth>} />
          <Route path="/new-resources/health/exams/:id/edit" element={<RequireAuth><HealthExamEditView /></RequireAuth>} />
          <Route path="/new-resources/health/exams/:id" element={<RequireAuth><HealthExamDetailView /></RequireAuth>} />
          <Route path="/new-resources/health/pending" element={<RequireAuth><HealthPendingView /></RequireAuth>} />
          <Route path="/new-resources/health/pending/:id" element={<RequireAuth><HealthPendingDetailView /></RequireAuth>} />
          <Route path="/new-resources/health/search" element={<RequireAuth><HealthSearchView /></RequireAuth>} />
          <Route path="/new-resources/health/overview" element={<RequireAuth><HealthOverviewView /></RequireAuth>} />
          <Route path="/new-resources/health/prescriptions" element={<RequireAuth><HealthPrescriptionsView /></RequireAuth>} />
          <Route path="/new-resources/health/prescriptions/new" element={<RequireAuth><HealthPrescriptionFormView /></RequireAuth>} />
          <Route path="/new-resources/health/prescriptions/:id/edit" element={<RequireAuth><HealthPrescriptionFormView /></RequireAuth>} />
          <Route path="/new-resources/health/prescriptions/:id" element={<RequireAuth><HealthPrescriptionDetailView /></RequireAuth>} />
          {/* SP-78 — Sistema de Missões Dinâmicas */}
          <Route
            path="/new-challenge"
            element={
              <RequireAuth>
                <MissionsView />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/scan"
            element={
              <RequireAuth>
                <QRScannerPage />
              </RequireAuth>
            }
          />
          <Route
            path="/image-recognition"
            element={
              <RequireAuth>
                <ImageRecognitionPage />
              </RequireAuth>
            }
          />
          <Route
            path="/audio-recognition"
            element={
              <RequireAuth>
                <AudioRecognitionPage />
              </RequireAuth>
            }
          />
          <Route
            path="/revenue/:id?"
            element={
              <RequireAuth>
                <Revenue />
              </RequireAuth>
            }
          />

          <Route
            path="/expense/:id?"
            element={
              <RequireAuth>
                <Expenses />
              </RequireAuth>
            }
          />
        </Routes>
        <PWAInstallBanner />
      </Box>
    </Box>
  );
}
