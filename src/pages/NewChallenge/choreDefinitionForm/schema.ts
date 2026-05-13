import * as yup from 'yup';
import { parseBRLCurrency } from '../../../utils/formatCurrency';
import type { ChoreRecurrence } from '../../../types/chore';

export const CHORE_DEFINITION_RECURRENCE_VALUES: ChoreRecurrence[] = [
  'once',
  'daily',
  'weekly',
];

export const buildChoreDefinitionSchema = (
  t: (k: string, o?: Record<string, unknown>) => string,
) =>
  yup.object({
    title: yup.string().max(255).required(t('common.required')),
    description: yup.string().default(''),
    rewardValue: yup
      .string()
      .required(t('common.required'))
      .test(
        'num',
        t('common.invalidValue'),
        (v) => parseBRLCurrency(v || '0') >= 0,
      ),
    coinReward: yup.number().min(0).default(0),
    requirePhoto: yup.boolean().default(false),
    recurrence: yup
      .mixed<ChoreRecurrence>()
      .oneOf(CHORE_DEFINITION_RECURRENCE_VALUES)
      .required(t('common.required')),
    isActive: yup.boolean().default(true),
  });

export type ChoreDefinitionFormValues = {
  title: string;
  description: string;
  rewardValue: string;
  coinReward: number;
  requirePhoto: boolean;
  recurrence: ChoreRecurrence;
  isActive: boolean;
};
