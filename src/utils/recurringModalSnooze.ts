import { LOCAL_STORAGE_KEYS } from './constants';

const SNOOZE_DURATION_MS = 24 * 60 * 60 * 1000;

export type RecurringModalType = 'expense' | 'income';

const STORAGE_KEY_BY_TYPE: Record<RecurringModalType, string> = {
  expense: LOCAL_STORAGE_KEYS.RECURRING_EXPENSE_SNOOZE_UNTIL,
  income: LOCAL_STORAGE_KEYS.RECURRING_INCOME_SNOOZE_UNTIL,
};

export function isRecurringModalSnoozed(type: RecurringModalType): boolean {
  const raw = localStorage.getItem(STORAGE_KEY_BY_TYPE[type]);
  if (!raw) return false;

  const snoozeUntil = Number(raw);
  if (Number.isNaN(snoozeUntil)) {
    localStorage.removeItem(STORAGE_KEY_BY_TYPE[type]);
    return false;
  }

  if (Date.now() >= snoozeUntil) {
    localStorage.removeItem(STORAGE_KEY_BY_TYPE[type]);
    return false;
  }

  return true;
}

export function snoozeRecurringModal(type: RecurringModalType): void {
  localStorage.setItem(
    STORAGE_KEY_BY_TYPE[type],
    String(Date.now() + SNOOZE_DURATION_MS),
  );
}
