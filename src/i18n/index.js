import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import fr from './locales/fr/translation.json'
import en from './locales/en/translation.json'
import ar from './locales/ar/translation.json'

const SUPPORTED_LANGS = ['fr', 'en', 'ar']

const applyDocumentLangDir = (lng) => {
  if (typeof document === 'undefined') return
  const lang = SUPPORTED_LANGS.includes(lng) ? lng : 'fr'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

applyDocumentLangDir('fr')

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lang',
    },
    react: {
      useSuspense: false,
    },
  })

// Keep html[lang]/dir in sync.
i18n.on('languageChanged', (lng) => applyDocumentLangDir(lng))

export default i18n
