import { Navigate } from 'react-router-dom';

export const HealthPendingView = () => (
  <Navigate to="/new-resources/health/exams?tab=processing" replace />
);
