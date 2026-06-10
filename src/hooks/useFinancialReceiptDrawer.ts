import { useCallback, useState } from 'react';
import type { ReceiptTarget } from '../types/financial';

export function useFinancialReceiptDrawer() {
  const [target, setTarget] = useState<ReceiptTarget | null>(null);

  const openReceipt = useCallback((type: 'expense' | 'revenue', id: string) => {
    setTarget({ type, id });
  }, []);

  const closeReceipt = useCallback(() => setTarget(null), []);

  return { target, openReceipt, closeReceipt };
}
