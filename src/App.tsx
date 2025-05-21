import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFoundPage from './pages/NotFoundPage';
import { RequireAuth } from './components/RequireAuth';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import NewChallenge from './pages/NewChallenge';
import NewResources from './pages/NewResources';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFoundPage />} />

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
    </Routes>
  );
}
