import * as yup from 'yup';

export type ForgotPasswordFormValues = {
  email: string;
};

export const buildForgotPasswordSchema = (
  t: (k: string, o?: Record<string, unknown>) => string,
) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t('common.required'))
      .email(t('login.invalidEmail'))
      .max(255, t('login.emailMaxLength')),
  });
