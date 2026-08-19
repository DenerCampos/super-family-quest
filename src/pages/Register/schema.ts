import * as yup from 'yup';

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const buildRegisterSchema = (
  t: (k: string, o?: Record<string, unknown>) => string,
) =>
  yup.object({
    name: yup
      .string()
      .trim()
      .required(t('register.nameRequired'))
      .min(3, t('register.nameMinLength'))
      .max(255, t('register.nameMaxLength')),
    email: yup
      .string()
      .trim()
      .required(t('common.required'))
      .email(t('register.invalidEmail'))
      .max(255, t('register.emailMaxLength')),
    password: yup
      .string()
      .required(t('register.passwordRequired'))
      .min(8, t('register.passwordMinLength'))
      .max(64, t('register.passwordMaxLength')),
    confirmPassword: yup
      .string()
      .required(t('register.passwordRequired'))
      .oneOf([yup.ref('password')], t('register.passwordsDoNotMatch')),
  });
