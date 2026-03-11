import { PeoplePageInfo } from 'lib/types';

/**
 * Helper functions to access People page display names data from .sitecore/people-page-info.json file.
 * The data is populated at build time by the generatePeoplePageInfo tool.
 */

/**
 * Get all people page display name versions across all languages
 * @returns Array of people page info in different languages
 */
const getPeoplePageInfoPerLanguage = async (): Promise<PeoplePageInfo[]> => {
  try {
    const peoplePageInfoModule = await import('../../../.sitecore/people-page-info.json', {
      with: { type: 'json' },
    });
    const peoplePageInfoPerLanguage = peoplePageInfoModule?.default;
    return (peoplePageInfoPerLanguage || []) as unknown as PeoplePageInfo[];
  } catch (error) {
    console.error('Error parsing people page info data:', error);
    return [];
  }
};

/**
 * Get the people page display name for a specific language
 * @param language - The language code (e.g., 'en', 'fr-CA')
 * @returns Display name string or empty string if not found
 */
export const getPeoplePageDisplayName = async (language: string): Promise<string> => {
  const peoplePageInfoPerLanguage = await getPeoplePageInfoPerLanguage();
  return peoplePageInfoPerLanguage.find((item) => item.language === language)?.displayName || '';
};
