import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import ca from './i18n/ca.json';
import en from './i18n/en.json';
import es from './i18n/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ca: {
        translation: ca
      },
      en: {
        translation: en
      },
      es: {
        translation: es
      },
    },
    load: 'languageOnly',
    fallbackLng: 'ca',
    debug: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  });
