import { useQuery } from '@tanstack/react-query';
import { HealthService } from '../services/health';
import { healthQueryKeys } from './healthQueryKeys';
import { useHealthViewerId } from './useHealthViewerId';
import type {
  HealthLabItemEvolutionParams,
  HealthLabItemNamesParams,
} from '../types/health';

export const useHealthLabItemNames = (
  params: HealthLabItemNamesParams = {},
  enabled = true,
) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.labItemNames(viewerId, params),
    queryFn: () => HealthService.listLabItemNames(params),
    staleTime: 30_000,
    enabled,
  });
};

export const useHealthLabItemEvolution = (
  params: HealthLabItemEvolutionParams | null,
) => {
  const viewerId = useHealthViewerId();

  return useQuery({
    queryKey: healthQueryKeys.labItemEvolution(viewerId, params ?? undefined),
    queryFn: () => HealthService.getLabItemEvolution(params!),
    staleTime: 30_000,
    enabled: Boolean(params?.itemName),
  });
};
