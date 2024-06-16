import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translations
import en from "./locale/en.json";
import fr from "./locale/fr.json";

// Detect the device language
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const savedDataJSON = await AsyncStorage.getItem("user-language");
    const savedLanguage = savedDataJSON ? JSON.parse(savedDataJSON) : null;
    const locale = Localization.locale;
    callback(savedLanguage || locale);
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    await AsyncStorage.setItem("user-language", JSON.stringify(language));
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
