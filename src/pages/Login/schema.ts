import * as yup from 'yup';

export type LoginFormValues = {
  email: string;
  password: string;
};

export const buildLoginSchema = (
  t: (k: string, o?: Record<string, unknown>) => string,
) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t('common.required'))
      .email(t('login.invalidEmail'))
      .max(255, t('login.emailMaxLength')),
    password: yup
      .string()
      .required(t('login.passwordRequired'))
      .max(64, t('login.passwordMaxLength')),
  });
