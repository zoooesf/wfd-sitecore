import MetadataTwitter from './MetadataTwitter';
import MetadataOpenGraph from './MetadataOpenGraph';
import { CustomPageMetaFieldsType } from 'lib/types';
import { Field, Item, RouteData } from '@sitecore-content-sdk/nextjs';
import { GenericFieldValue } from '@sitecore-content-sdk/core/types/layout/models';
import { MetadataPage } from './MetadataPage';
import Head from 'next/head';
import { useTranslation } from 'lib/hooks/useTranslation';
import { ensureCurlyBraces } from 'lib/helpers/guid-helpers';
import {
  ARTICLE_TEMPLATE_ID,
  NEWS_TEMPLATE_ID,
  INSIGHTS_TEMPLATE_ID,
  EVENT_TEMPLATE_ID,
  PROFILE_TEMPLATE_ID,
  PEOPLE_PAGE_TEMPLATE_ID,
  PRODUCT_PAGE_TEMPLATE_ID,
} from 'lib/graphql/id';

export type MetadataProps = {
  route:
    | RouteData<Record<string, Field<GenericFieldValue> | Item | Item[]>>
    | null
    | CustomPageMetaFieldsType;
};

// Map of Template IDs to content type dictionary keys
// As these dictionary keys are used indirectly, we added t('') comments for the analyze-dictionary-usage tool to report those keys as used.
const CONTENT_TYPE_MAP: { [key: string]: string } = {
  [ARTICLE_TEMPLATE_ID]: 'Article', // t('Article')
  [NEWS_TEMPLATE_ID]: 'News', // t('News')
  [INSIGHTS_TEMPLATE_ID]: 'Insight', // t('Insight')
  [EVENT_TEMPLATE_ID]: 'Event', // t('Event')
  [PROFILE_TEMPLATE_ID]: 'Person', // t('Person')
  [PEOPLE_PAGE_TEMPLATE_ID]: 'Person', // t('Person')
  [PRODUCT_PAGE_TEMPLATE_ID]: 'Product', // t('Product')
};

const Metadata: React.FC<MetadataProps> = (props) => {
  const { t } = useTranslation();
  const { route } = props;

  // Get template ID from route
  const rawTemplateId = (route as { templateId?: string })?.templateId;

  // Normalize template ID: ensure braces and convert to uppercase
  const templateId = ensureCurlyBraces(rawTemplateId).toUpperCase();

  // Determine content type based on template (default to 'Generic Page')
  const contentTypeDictionaryKey = CONTENT_TYPE_MAP[templateId] || 'Generic Page'; // t('Generic Page')
  const contentType = t(contentTypeDictionaryKey);

  return (
    <>
      <Head>
        {/*
          CRITICAL: The 'key' prop ensures Next.js only renders ONE meta tag
          with this property, preventing duplicates from other components
        */}
        <meta property="content:type" content={contentType} key="sitecore-search-content-type" />
      </Head>
      <MetadataPage route={props.route} />
      <MetadataTwitter {...props} />
      <MetadataOpenGraph {...props} />
    </>
  );
};

export default Metadata;
