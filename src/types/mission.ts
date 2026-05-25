export const MissionFrequency = {
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY',
  ONCE: 'ONCE',
} as const;

export type MissionFrequency =
  (typeof MissionFrequency)[keyof typeof MissionFrequency];

export interface MissionDefinitionDto {
  id: string;
  key: string;
  title: string;
  description: string;
  frequency: MissionFrequency;
  rewardCoins: number;
  targetValue: number;
}

export interface MissionProgressDto {
  id: string | null;
  currentValue: number;
  isCompleted: boolean;
  isClaimed: boolean;
  resetAt: string | null;
}

export interface MissionWithProgressDto {
  mission: MissionDefinitionDto;
  progress: MissionProgressDto;
}
