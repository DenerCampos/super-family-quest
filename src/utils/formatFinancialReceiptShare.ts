import type { TFunction } from 'i18next';
import type { ExpenseReceipt, RevenueReceipt } from '../types/financial';
import { formatCurrency } from './formatCurrency';
import { formatDateToBR } from './formatDate';
import type { ShareTextPayload } from './nativeShare';

function formatLineTotal(item: ExpenseReceipt['items'][number]): string {
  const total =
    typeof item.total === 'number' ? item.total : item.quantity * item.value;
  return formatCurrency(total);
}

function formatExpenseItems(receipt: ExpenseReceipt, t: TFunction): string[] {
  if (!receipt.items?.length) {
    return [t('share.receipt.emptyItems')];
  }

  return receipt.items.flatMap((item) => {
    const line = t('share.receipt.item', {
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      value: formatLineTotal(item),
    });

    if (item.warrantyDuration && item.warrantyUnit) {
      const warranty = t('share.receipt.warranty', {
        label: t('financialSteps.warranty.label', {
          duration: item.warrantyDuration,
          unit: t(`financialSteps.recurrence.${item.warrantyUnit}`),
        }),
      });
      return [line, warranty];
    }

    return [line];
  });
}

function formatTotals(
  receipt: ExpenseReceipt | RevenueReceipt,
  t: TFunction,
): string[] {
  if (receipt.installment?.isInstallment) {
    return [
      t('share.receipt.installmentValue', {
        value: formatCurrency(receipt.installmentValue ?? receipt.value),
      }),
      t('share.receipt.totalValue', {
        value: formatCurrency(receipt.totalValue ?? receipt.value),
      }),
    ];
  }

  return [
    t('share.receipt.total', {
      value: formatCurrency(receipt.value),
    }),
  ];
}

export function formatFinancialReceiptShare(
  receipt: ExpenseReceipt | RevenueReceipt,
  t: TFunction,
): ShareTextPayload {
  const isExpense = receipt.type === 'expense';
  const title = isExpense
    ? t('share.receipt.expenseTitle')
    : t('share.receipt.revenueTitle');

  const heading = isExpense
    ? (receipt as ExpenseReceipt).store?.name || receipt.name
    : receipt.name;

  const lines: string[] = [title, heading, formatDateToBR(receipt.date)];

  if (receipt.installment?.installmentLabel) {
    lines.push(receipt.installment.installmentLabel);
  }

  if (isExpense) {
    const expense = receipt as ExpenseReceipt;
    if (expense.payment?.name) {
      lines.push(t('share.receipt.payment', { name: expense.payment.name }));
    }

    lines.push('');
    lines.push(t('share.receipt.itemsHeader'));
    lines.push(...formatExpenseItems(expense, t));
  }

  lines.push('');
  lines.push(...formatTotals(receipt, t));

  return {
    title,
    text: lines.join('\n'),
  };
}
