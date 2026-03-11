import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { CategoryType } from 'lib/helpers/page-category';
import { TagType } from 'lib/types';

export type SearchListingWithFiltersFields = {
  heading?: Field<string>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  widgetId?: Field<string>;
  PageSizeCount?: Field<number>;
  filterByKeyword?: TagType[];
  tags?: (TagType | CategoryType)[];
};

export type SearchListingWithFiltersProps = ComponentProps & {
  fields: SearchListingWithFiltersFields;
};

export type SearchModel = {
  id: string;
  type?: string;
  m_title?: string;
  name?: string;
  m_subheading?: string;
  m_description?: string;
  url?: string;
  content_text?: string;
  m_featured_image_url?: string;
  m_og_image_url?: string;
  source_id?: string;
  m_location?: string;
  m_category?: string[];
  m_publisheddate?: string;
  m_profile_full_name?: string;
  m_profiles?: string[];
  m_keywords?: string[];
  m_content_type?: string;
  image_url?: string;
};
