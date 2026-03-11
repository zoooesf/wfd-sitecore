import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import Frame from 'component-children/Shared/Frame/Frame';
import { ArticleDataType } from 'lib/types';
import { sortByDatePublished } from 'lib/helpers/sort';
import { useContainer } from 'lib/hooks/useContainer';
import { getGraphQlClient } from 'lib/graphql-client';
import {
  DefaultRendering,
  VerticalListRendering,
} from 'component-children/Articles/LatestArticleGrid/LatestArticleGrid';
import {
  GetLatestArticles,
  GetLatestInsights,
  GetLatestNews,
} from 'graphql/generated/graphql-documents';
import { INSIGHTS_TEMPLATE_ID, NEWS_TEMPLATE_ID, ARTICLE_TEMPLATE_ID } from 'lib/graphql/id';
import {
  contentRootIdNullChecker,
  fetchSiteRootInfo,
  getLayoutLanguage,
  getSiteName,
} from 'lib/helpers';
import { ArticleVariant, ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { getVariantFromRendering } from 'lib/helpers/listing/article-listing';

// Variants
const LatestArticleGridDefault: React.FC<LatestArticleGridProps> = (props) => {
  return (
    <Frame params={props.params}>
      <DefaultRendering {...props} />
    </Frame>
  );
};

const LatestArticleGridVerticalList: React.FC<LatestArticleGridProps> = (props) => {
  const { containerName } = useContainer();

  if (containerName === 'ColumnSplitter') return <VerticalListRendering {...props} />;

  return (
    <Frame params={props.params}>
      <VerticalListRendering {...props} />
    </Frame>
  );
};

// Content variant wrapper components
const InsightsLatestArticleGrid: React.FC<LatestArticleGridProps> = (props) => {
  return (
    <Frame params={props.params}>
      <DefaultRendering {...props} variant={ARTICLE_VARIANTS.INSIGHTS} />
    </Frame>
  );
};

const NewsLatestArticleGrid: React.FC<LatestArticleGridProps> = (props) => {
  return (
    <Frame params={props.params}>
      <DefaultRendering {...props} variant={ARTICLE_VARIANTS.NEWS} />
    </Frame>
  );
};

type ArticleListQueryType = {
  search: {
    results: ArticleDataType[];
    total: number;
    pageInfo: {
      endCursor: string;
      hasNext: boolean;
    };
  };
};

type ArticleListingRenderingType = {
  rendering: ComponentRendering & {
    data: ArticleDataType[];
  };
};

export type LatestArticleGridFields = {
  heading: Field<string>;
};

export type LatestArticleGridProps = ComponentProps &
  ArticleListingRenderingType & {
    className?: string;
    fields: LatestArticleGridFields;
    max?: number;
    variant?: ArticleVariant;
  };

// Helper function to get query and template ID based on variant
const getQueryAndTemplateByVariant = (variant: ArticleVariant) => {
  switch (variant) {
    case ARTICLE_VARIANTS.INSIGHTS:
      return {
        query: GetLatestInsights,
        templateId: INSIGHTS_TEMPLATE_ID,
      };
    case ARTICLE_VARIANTS.NEWS:
      return { query: GetLatestNews, templateId: NEWS_TEMPLATE_ID };
    default:
      return { query: GetLatestArticles, templateId: ARTICLE_TEMPLATE_ID };
  }
};

const queryCache = new Map();

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  try {
    const graphQLClient = getGraphQlClient();
    const language = getLayoutLanguage(layoutData);
    const variant = getVariantFromRendering(rendering);
    const siteName = getSiteName(layoutData);
    const { contentRoot } = await fetchSiteRootInfo(siteName, language, graphQLClient);

    // Get variant-specific query and template ID
    const { query, templateId } = getQueryAndTemplateByVariant(variant);

    // Create a variant-specific cache key using contentRoot.id
    const cacheKey = `latest-articles-${variant}-${templateId}-${
      contentRoot?.id || 'unknown'
    }-${language}-6`;

    // Check cache first
    if (queryCache.has(cacheKey)) {
      return queryCache.get(cacheKey);
    }

    const data: ArticleListQueryType = await graphQLClient.request(query.loc?.source.body || '', {
      language,
      templateId,
      homePath: contentRootIdNullChecker(contentRoot?.id), // Use dynamic content root ID as homePath
      limit: 6,
    });
    const sortedData = data.search.results.sort(sortByDatePublished);
    const result = {
      rendering: { ...rendering, data: sortedData },
      route: layoutData?.sitecore?.route,
    };

    // Store in cache with expiration (e.g., 5 minutes)
    queryCache.set(cacheKey, result);
    setTimeout(() => queryCache.delete(cacheKey), 5 * 60 * 1000);

    return result;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return {
      rendering: { ...rendering, data: [] },
      route: layoutData?.sitecore?.route,
    };
  }
};

export const Default = withDatasourceCheck()<LatestArticleGridProps>(LatestArticleGridDefault);
export const VerticalList = withDatasourceCheck()<LatestArticleGridProps>(
  LatestArticleGridVerticalList
);
export const Insights = withDatasourceCheck()<LatestArticleGridProps>(InsightsLatestArticleGrid);
export const News = withDatasourceCheck()<LatestArticleGridProps>(NewsLatestArticleGrid);
