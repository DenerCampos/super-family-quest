import type { RecurrenceForm } from '../types/financial';
import type { CreateExpense, CreateRevenue, ItemsCreate } from '../services/resources';
import { parseBRLCurrency } from './formatCurrency';
import { parseGrams } from './formatGrams';

type InstallmentRecord = {
  repeat: boolean;
  isInstallment?: boolean;
  totalInstallments?: number | null;
  date: string;
};

type ExpenseFormItem = {
  code: string | null;
  name: string;
  quantity: number | string;
  unit: string;
  value: number | string;
  total?: number | string;
  group: { name: string };
  warrantyDuration?: number | null;
  warrantyUnit?: string | null;
  warrantyExpiresAt?: string | null;
  id?: string;
};

export function formatExpenseItemsForApi(items: ExpenseFormItem[]): ItemsCreate[] {
  return items.map((item) => ({
    code: item.code ?? null,
    name: item.name,
    quantity: Number(parseGrams(item.quantity)),
    unit: item.unit,
    value: Number(parseBRLCurrency(item.value).toFixed(2)),
    group: item.group,
    warrantyDuration: item.warrantyDuration,
    warrantyUnit: item.warrantyUnit,
  }));
}

export function buildExpenseCreatePayload(
  data: {
    uri?: string;
    date: string;
    store: { name: string };
    payment: { name: string };
    items: ExpenseFormItem[];
    recurrence?: RecurrenceForm;
    repeat?: boolean;
  },
): CreateExpense {
  const recurrence = data.recurrence?.enabled ? data.recurrence : undefined;

  return {
    name: data.store.name.trim(),
    uri: data.uri?.trim() ?? '',
    date: data.date,
    repeat:
      recurrence?.mode === 'fixed_repeat' ? true : Boolean(data.repeat),
    payment: data.payment,
    store: data.store,
    recurrence,
    items: normalizeItemsWarrantyForApi(formatExpenseItemsForApi(data.items)),
  };
}

/** Payload para POST /expense/recurring/confirm — sem value (API soma itens). */
export function buildExpenseRecurringConfirmPayload(expense: {
  name: string;
  uri?: string;
  date: string;
  repeat?: boolean;
  payment: { name: string };
  store: { name: string };
  items: ExpenseFormItem[];
  recurrence?: RecurrenceForm;
}): CreateExpense {
  return buildExpenseCreatePayload({
    uri: expense.uri,
    date: expense.date,
    store: { ...expense.store, name: expense.name },
    payment: expense.payment,
    items: expense.items,
    recurrence: expense.recurrence,
    repeat: expense.repeat,
  });
}

/**
 * Receita não tem itens: `value` é o valor informado pelo usuário (não é soma).
 * Backend valida e persiste; parcelamento divide esse valor no servidor.
 */
export function buildRevenueCreatePayload(data: {
  name: string;
  value: string | number;
  date: string;
  repeat?: boolean;
  recurrence?: RecurrenceForm;
}): CreateRevenue {
  const recurrence = data.recurrence?.enabled ? data.recurrence : undefined;

  return {
    name: data.name.trim(),
    value: Number(parseBRLCurrency(data.value).toFixed(2)),
    date: data.date,
    repeat: recurrence?.mode === 'fixed_repeat' ? true : Boolean(data.repeat),
    recurrence,
  };
}

export function buildRecurrenceFromRecord(
  record: InstallmentRecord,
): RecurrenceForm {
  const dueDayFromDate = (() => {
    const dayPart = record.date.split('T')[0]?.split('-')[2];
    const parsed = dayPart ? parseInt(dayPart, 10) : NaN;
    return Number.isNaN(parsed) ? 10 : parsed;
  })();

  if (record.isInstallment && record.totalInstallments != null) {
    return {
      enabled: true,
      mode: 'installment_finite',
      count: record.totalInstallments,
      intervalUnit: 'months',
      intervalValue: 1,
      dueDay: 10,
    };
  }

  if (record.isInstallment && record.totalInstallments == null) {
    return {
      enabled: true,
      mode: 'installment_infinite',
      count: 2,
      intervalUnit: 'months',
      intervalValue: 1,
      dueDay: 10,
    };
  }

  if (record.repeat) {
    return {
      enabled: true,
      mode: 'fixed_repeat',
      count: 2,
      intervalUnit: 'months',
      intervalValue: 1,
      dueDay: dueDayFromDate,
    };
  }

  return {
    enabled: false,
    mode: 'none',
    count: 2,
    intervalUnit: 'months',
    intervalValue: 1,
    dueDay: 10,
  };
}

export function normalizeItemsWarrantyForApi<
  T extends {
    warrantyDuration?: number | null;
    warrantyUnit?: string | null;
    warrantyExpiresAt?: string | null;
  },
>(items: T[]): T[] {
  return items.map((item) => {
    const duration = Number(item.warrantyDuration ?? 0);
    const unit = item.warrantyUnit;
    if (!duration || !unit) {
      return {
        ...item,
        warrantyDuration: null,
        warrantyUnit: null,
        warrantyExpiresAt: null,
      };
    }
    return {
      ...item,
      warrantyDuration: duration,
      warrantyUnit: unit,
      warrantyExpiresAt: null,
    };
  });
}
