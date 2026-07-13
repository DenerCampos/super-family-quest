import { useAuth } from '../contexts/AuthContext';

/** ID do usuário autenticado — escopo das queryKeys de saúde no cache. */
export function useHealthViewerId(): string {
  const { profile } = useAuth();
  return profile?.user.id ?? 'anonymous';
}
