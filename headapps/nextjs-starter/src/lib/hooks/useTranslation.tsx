import { useI18n } from 'next-localization';

export const useTranslation = () => {
  const i18nResult = useI18n();

  const translate = (key: string): string => {
    // Verify that the i18n context is properly initialized and the translate function is available
    if (!i18nResult || typeof i18nResult.t !== 'function') {
      console.warn(
        `Translation warning: i18n context not available. Returning key "${key}" as fallback.`
      );
      return key;
    }

    const result = i18nResult.t(key);

    // Ensure the translation result is a valid string, as the i18n library might return
    // empty string, undefined, null, or other types when a translation key is missing from the dictionary
    if (result === '' || typeof result !== 'string') {
      console.warn(`Translation warning: No translation found for key "${key}" in the dictionary.`);
      return key;
    }

    return result;
  };

  // Return the translate function with the same interface as standard i18n libraries
  return { t: translate };
};
