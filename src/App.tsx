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
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewChallenge from "./pages/NewChallenge";
import { QuestsListView } from "./pages/NewChallenge/QuestsListView";
import { QuestOccurrenceDetailView } from "./pages/NewChallenge/QuestOccurrenceDetailView";
import { DefinitionsListView } from "./pages/NewChallenge/DefinitionsListView";
import { DefinitionFormView } from "./pages/NewChallenge/DefinitionFormView";
import { ApprovalsView } from "./pages/NewChallenge/ApprovalsView";
import { AllowanceView } from "./pages/NewChallenge/AllowanceView";
import { HistoryView } from "./pages/NewChallenge/HistoryView";
import NewResources from "./pages/NewResources";
import { ResourcesView } from "./pages/NewResources/ResourcesView";
import { FamilyGroupView } from "./pages/NewResources/FamilyGroupView";
import { ShoppingListsView } from "./pages/NewResources/ShoppingListsView";
import { ShoppingListDetailView } from "./pages/NewResources/ShoppingListDetailView";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Revenue from "./pages/Revenue";
import Settings from "./pages/Settings";
import AlexaLogin from "./pages/AlexaLogin";
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
            path="/new-challenge"
            element={
              <RequireAuth>
                <NewChallenge />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/quests/:occurrenceId"
            element={
              <RequireAuth>
                <QuestOccurrenceDetailView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/quests"
            element={
              <RequireAuth>
                <QuestsListView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/definitions/:definitionId"
            element={
              <RequireAuth>
                <DefinitionFormView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/definitions"
            element={
              <RequireAuth>
                <DefinitionsListView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/approvals"
            element={
              <RequireAuth>
                <ApprovalsView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/allowance"
            element={
              <RequireAuth>
                <AllowanceView />
              </RequireAuth>
            }
          />
          <Route
            path="/new-challenge/history"
            element={
              <RequireAuth>
                <HistoryView />
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
