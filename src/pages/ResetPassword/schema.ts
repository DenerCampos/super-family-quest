import * as yup from 'yup';

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export const buildResetPasswordSchema = (
  t: (k: string, o?: Record<string, unknown>) => string,
) =>
  yup.object({
    password: yup
      .string()
      .required(t('passwordReset.passwordRequired'))
      .min(8, t('passwordReset.passwordMinLength'))
      .max(64, t('passwordReset.passwordMaxLength')),
    confirmPassword: yup
      .string()
      .required(t('passwordReset.passwordRequired'))
      .oneOf([yup.ref('password')], t('passwordReset.passwordsDoNotMatch')),
  });
