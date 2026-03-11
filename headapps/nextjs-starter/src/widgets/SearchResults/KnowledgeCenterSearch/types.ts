import type { SearchResultsStoreState } from '@sitecore-search/react';
import { GlobalSearchProps } from 'lib/types/components/Search/global-search';

export type KnowledgeCenterModel = {
  id: string;
  name?: string;
  description?: string;
  url?: string;
  source_id?: string;
  type?: string;
  site?: string;
  m_lastupdated?: string;
  m_geography?: string[];
  m_topic?: string[];
  m_year?: string[];
  m_keywords?: string[];
  m_language?: string;
  m_file_extension?: string;
  m_file_size?: number;
  m_content_type?: string;
  highlight?: {
    description?: string[];
  };
};

export type KnowledgeCenterSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  globalSearchFields?: GlobalSearchProps;
};
