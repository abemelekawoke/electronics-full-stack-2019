// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import en from './locales/en/translation.json';
import am from './locales/am/translation.json';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        am: {
            translation: am,
        },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already safes from xss
    },
});

export default i18n;
