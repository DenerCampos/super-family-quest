import api from './api';
import type { MissionWithProgressDto } from '../types/mission';

export const MissionsService = {
  async getMissions(): Promise<MissionWithProgressDto[]> {
    const response = await api.get<MissionWithProgressDto[]>('/missions');
    return response.data;
  },

  async claimReward(progressId: string): Promise<void> {
    await api.post(`/missions/${progressId}/claim`);
  },
};
