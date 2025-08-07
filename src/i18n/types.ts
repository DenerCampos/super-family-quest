export interface I18nTheme {
  id: string;
  name: string;
  translations: TranslationKeys;
}

export type ThemeNamespace = 'default' | 'rpg';

// Tipagem para as chaves de tradução
export interface TranslationKeys {
  common: {
    welcome: string;
    balance: string;
    expenses: string;
    income: string;
    savings: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
  };
  dashboard: {
    totalBalance: string;
    monthlyExpenses: string;
    monthlyIncome: string;
    savingsGoal: string;
  };
} 