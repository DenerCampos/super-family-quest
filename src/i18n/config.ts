import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import defaultPt from './locales/default/pt.json';
import rpgPt from './locales/rpg/pt.json';

const resources = {
  pt: {
    default: defaultPt,
    rpg: rpgPt,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    defaultNS: 'default',
    ns: ['default', 'rpg'],
    fallbackNS: 'default',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 