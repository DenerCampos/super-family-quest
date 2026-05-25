import { useQuery } from '@tanstack/react-query';
import { api } from '../services';
import { missionQueryKeys } from './missionQueryKeys';
import { MissionFrequency } from '../types/mission';

export function useMissions() {
  const listQuery = useQuery({
    queryKey: missionQueryKeys.list(),
    queryFn: api.missionGetAll,
  });

  const missions = listQuery.data ?? [];

  const daily = missions.filter(
    (m) => m.mission.frequency === MissionFrequency.DAILY,
  );
  const monthly = missions.filter(
    (m) => m.mission.frequency === MissionFrequency.MONTHLY,
  );
  const once = missions.filter(
    (m) => m.mission.frequency === MissionFrequency.ONCE,
  );

  return {
    missions,
    daily,
    monthly,
    once,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
  };
}
