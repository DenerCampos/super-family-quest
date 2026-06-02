import { useEffect, useRef } from 'react';
import { useCoinFlight } from '../contexts/CoinFlightContext';
import { useAuth } from '../contexts/AuthContext';
import { useFamilyGroup } from './useFamilyGroup';
import { api } from '../services';
import { runAfterNextPaint } from '../utils/coinsNumber';

/** Exibe animação de moedas de tarefas aprovadas ao abrir o hub de quests. */
export function useChoreCoinCelebration() {
  const { playReward } = useCoinFlight();
  const { loadProfile } = useAuth();
  const { familyGroup } = useFamilyGroup({
    fetchSummary: false,
    fetchInvitations: false,
  });
  const ranRef = useRef(false);

  useEffect(() => {
    const groupId = familyGroup?.id;
    if (!groupId || ranRef.current) return;

    ranRef.current = true;

    const celebrate = async () => {
      try {
        const pending = await api.choreGetPendingCoinRewards(groupId);
        if (pending.totalCoins <= 0) return;

        const celebrated = await api.choreCelebrateCoinRewards(groupId);
        if (celebrated.totalCoins <= 0) return;

        await loadProfile();
        runAfterNextPaint(() =>
          playReward({
            delta: celebrated.totalCoins,
            skipBalanceUpdate: true,
          }),
        );
      } catch {
        // Falha silenciosa — não bloqueia a tela de quests.
      }
    };

    void celebrate();
  }, [familyGroup?.id, loadProfile, playReward]);
}
