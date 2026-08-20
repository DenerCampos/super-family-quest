import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { familyGroupQueryKeys } from './familyGroupQueryKeys';

/**
 * Invalida as duas fontes de dados do card Balanço Mensal:
 * - profile do AuthContext (usuários sem grupo familiar)
 * - summary do grupo familiar no React Query (usuários com grupo)
 *
 * Deve ser chamado após qualquer mutação que altere totais financeiros
 * (criar, editar ou excluir despesa/receita, inclusive confirmar recorrência na Home).
 */
export const useInvalidateFinancialSummary = () => {
  const queryClient = useQueryClient();
  const { loadProfile } = useAuth();

  return useCallback(async () => {
    await Promise.all([
      loadProfile(),
      queryClient.invalidateQueries({
        queryKey: [...familyGroupQueryKeys.all, 'summary'],
      }),
    ]);
  }, [loadProfile, queryClient]);
};
