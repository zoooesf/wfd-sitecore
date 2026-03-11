import { enUS, frCA } from 'date-fns/locale';
import type { Locale } from 'date-fns';

/**
 * Map Sitecore locale codes to date-fns locale objects
 */
const LOCALE_MAP: Record<string, Locale> = {
  en: enUS,
  'en-US': enUS,
  'fr-CA': frCA,
};

/**
 * Get date-fns locale object from Sitecore locale code
 * @param localeCode - Sitecore locale code (e.g., 'en', 'en-US', 'fr-CA')
 * @returns date-fns Locale object
 */
export const getDateFnsLocale = (localeCode?: string): Locale => {
  if (!localeCode) return enUS;

  // Try exact match first
  if (LOCALE_MAP[localeCode]) {
    return LOCALE_MAP[localeCode];
  }

  // Try language code only (e.g., 'fr' from 'fr-CA')
  const languageCode = localeCode.split('-')[0];
  if (LOCALE_MAP[languageCode]) {
    return LOCALE_MAP[languageCode];
  }

  // Default to English
  return enUS;
};

/**
 * Normalize locale code for Intl API usage
 * Ensures the locale is in the correct format for Intl.DateTimeFormat
 * @param localeCode - Sitecore locale code (e.g., 'en', 'fr-CA')
 * @returns Normalized locale code for Intl API
 */
export const normalizeLocaleForIntl = (localeCode?: string): string => {
  if (!localeCode) return 'en-US';

  // Map common locale codes
  const localeMap: Record<string, string> = {
    en: 'en-US',
    fr: 'fr-CA',
  };

  // Return mapped value or original if already in correct format
  return localeMap[localeCode] || localeCode;
};
