import { Route, Routes } from "react-router-dom";
import { ImageRecognitionPage } from "./components/ImageRecognitionPage";
import { AudioRecognitionPage } from "./components/AudioRecognitionPage";
import { QRScannerPage } from "./components/QRScannerPage";
import { RequireAuth } from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewChallenge from "./pages/NewChallenge";
import NewResources from "./pages/NewResources";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Revenue from "./pages/Revenue";
import { Expenses } from "./pages/Expenses";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
        path="/new-resources"
        element={
          <RequireAuth>
            <NewResources />
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
  );
}
