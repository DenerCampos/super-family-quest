export const LOCAL_STORAGE_KEYS = {
  SHOW_VALUES: '@SuperFamilyQuest:showValues',
  USER_THEME: '@SuperFamilyQuest:userTheme',
  RECURRING_EXPENSE_SNOOZE_UNTIL: '@SuperFamilyQuest:recurringExpenseSnoozeUntil',
  RECURRING_INCOME_SNOOZE_UNTIL: '@SuperFamilyQuest:recurringIncomeSnoozeUntil',
} as const;

// Namespace para outras constantes que possam ser adicionadas no futuro
export const APP_CONFIG = {
  APP_NAME: 'Super Family Quest',
  APP_VERSION: '1.0.0',
} as const; 