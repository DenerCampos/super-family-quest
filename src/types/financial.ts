export type RecurrenceMode =
  | 'none'
  | 'installment_finite'
  | 'installment_infinite'
  | 'fixed_repeat';

export type IntervalUnit = 'days' | 'months' | 'years';

export type RecurrenceForm = {
  enabled: boolean;
  mode: RecurrenceMode;
  count?: number;
  intervalUnit: IntervalUnit;
  intervalValue: number;
  dueDay?: number;
};

export type InstallmentInfo = {
  installmentNumber: number | null;
  totalInstallments: number | null;
  installmentGroupId: string | null;
  isInstallment: boolean;
  installmentLabel: string | null;
};

export type ExpenseReceipt = {
  id: string;
  type: 'expense';
  name: string;
  value: number;
  installmentValue?: number;
  totalValue?: number;
  date: string;
  uri: string;
  photos: string[];
  isInstallmentRoot: boolean;
  installment: InstallmentInfo;
  store: { name: string };
  payment: { name: string };
  items: Array<{
    code: string;
    name: string;
    quantity: number;
    unit: string;
    value: number;
    total: number;
    warrantyDuration?: number | null;
    warrantyUnit?: string | null;
    warrantyExpiresAt?: string | null;
    group?: { name: string };
  }>;
  user?: { id: string; name: string };
};

export type RevenueReceipt = {
  id: string;
  type: 'revenue';
  name: string;
  value: number;
  installmentValue?: number;
  totalValue?: number;
  date: string;
  photos: string[];
  installment: InstallmentInfo;
  user?: { id: string; name: string };
};

export type ReceiptTarget = {
  type: 'expense' | 'revenue';
  id: string;
};
