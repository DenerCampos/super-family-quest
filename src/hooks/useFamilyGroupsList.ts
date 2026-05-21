import { useQuery } from '@tanstack/react-query';
import { api } from '../services';
import type { FamilyGroupResponseDto } from '../types/familyGroup';
import { familyGroupQueryKeys } from './familyGroupQueryKeys';

export function useFamilyGroupsList() {
  return useQuery({
    queryKey: familyGroupQueryKeys.list(),
    queryFn: (): Promise<FamilyGroupResponseDto[]> => api.familyGroupList(),
    staleTime: 60_000,
  });
}
