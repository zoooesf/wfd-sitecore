import { Environment } from '@sitecore-search/react';

const searchSourceBySite = (process.env.NEXT_PUBLIC_SITECORE_SEARCH_SOURCE_BY_SITE || '').replace(
  /`/g,
  '"'
);
let searchSourceBySiteArray: { siteName: string; sourceID: string }[] = [];
try {
  if (searchSourceBySite) {
    searchSourceBySiteArray = JSON.parse(searchSourceBySite);
  }
} catch (error) {
  console.error('Failed to parse sitecoreSearchSourceBySite from .env:', error);
}

export const getSitecoreSearchSourceBySite = (siteName: string) => {
  return searchSourceBySiteArray.find((item) => item.siteName === siteName)?.sourceID || '';
};

export const SEARCH_CONFIG = {
  env: process.env.NEXT_PUBLIC_SITECORE_SEARCH_ENV as Environment,
  customerKey: process.env.NEXT_PUBLIC_SITECORE_SEARCH_CUSTOMER_KEY,
  apiKey: process.env.NEXT_PUBLIC_SITECORE_SEARCH_API_KEY,
  searchPageUrl: process.env.NEXT_PUBLIC_SITECORE_SEARCH_PAGE_URL,
  sitecoreSearchKnowledgeCenterSource:
    process.env.NEXT_PUBLIC_SITECORE_SEARCH_KNOWLEDGE_CENTER_SOURCE,
};

type LocaleConfig = {
  country: string;
  language: string;
};

export const LOCALE_CONFIG = {
  en: { country: 'us', language: 'en' },
  'fr-CA': { country: 'ca', language: 'fr' },
  default: { country: 'us', language: 'en' },
} as Record<string, LocaleConfig>;

export const PROFILE_LAST_NAME_INITIAL_FACET_NAME = 'm_profile_last_name_initial';
export const LANGUAGE_ATTRIBUTE_NAME = 'm_language';
export const SITE_ATTRIBUTE_NAME = 'site';
export const NON_ALPHABETIC_INITIAL = '#';
export const KNOWLEDGE_CENTER_RESOURCE = 'knowledgeCenterResource';
export const KNOWLEDGE_CENTER_PAGE_SIZE = 100;
export const FACET_PREFIX = 'f-';
export const AMPERSAND_SEPARATOR = '&';
export const EQUAL_SEPARATOR = '=';
export const PIPE_SEPARATOR = '|';
export const HASH_SEPARATOR = '#';
export const EVENT_START_DATE_ASC_SORT_TYPE = 'm_event_startdate_asc';
export const EVENT_START_DATE_DESC_SORT_TYPE = 'm_event_startdate_desc';
export const DATE_FORMAT_ISO = 'YYYY-MM-DD';
export const HIGHLIGHT_FRAGMENT_SIZE = 500;
export const DEFAULT_PAGE_SIZE = 10;
