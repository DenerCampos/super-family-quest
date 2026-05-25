import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCoinFlight } from '../contexts/CoinFlightContext';
import { api } from '../services';
import { missionQueryKeys } from './missionQueryKeys';
import { useThemedTranslation } from './useThemedTranslation';
import { runAfterNextPaint } from '../utils/coinsNumber';

type ClaimMissionVariables = {
  progressId: string;
  rewardCoins: number;
  origin?: { x: number; y: number };
};

export function useMissionClaimReward() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useThemedTranslation();
  const { playReward } = useCoinFlight();

  return useMutation({
    mutationFn: ({ progressId }: ClaimMissionVariables) =>
      api.missionClaimReward(progressId),
    onSuccess: (_, { rewardCoins, origin }) => {
      runAfterNextPaint(() =>
        playReward({ delta: rewardCoins, from: origin }),
      );
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.root });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('missions.claimError'),
        status: 'error',
        duration: 3000,
      });
    },
  });
}
