import * as yup from 'yup';

export type ReactivateFormValues = {
  password: string;
};

export const buildReactivateSchema = (
  t: (k: string, o?: Record<string, unknown>) => string,
) =>
  yup.object({
    password: yup
      .string()
      .required(t('reactivateAccount.passwordRequired'))
      .max(64, t('reactivateAccount.passwordMaxLength')),
  });
