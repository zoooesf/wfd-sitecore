import { mainLanguage } from 'lib/i18n/i18n-config';
import { LayoutServiceData, Page } from '@sitecore-content-sdk/nextjs';

export const getLanguageName = (contextLanguage: string, code?: string): string | undefined => {
  if (!contextLanguage) {
    console.error('Context language is required to get language name');
    return;
  }

  const langCode = code || contextLanguage;
  const displayNames = new Intl.DisplayNames([contextLanguage], { type: 'language' });
  const languageName = displayNames.of(langCode.split('-')[0]);

  if (!languageName) {
    console.error('Language name could not be found');
    return;
  }

  return languageName;
};

/**
 * Get language from Sitecore page
 * @param page - The Sitecore page object
 * @returns The language code or main language
 */
export const getPageLanguage = (page?: Page): string => {
  return page?.locale ?? mainLanguage;
};

/**
 * Get language from layout data
 * @param layoutData - The layout service data
 * @returns The language code or main language
 */
export const getLayoutLanguage = (layoutData?: LayoutServiceData): string => {
  return layoutData?.sitecore?.context?.language ?? mainLanguage;
};
