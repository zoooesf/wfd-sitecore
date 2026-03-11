import { JSX } from 'react';
import { GetComponentServerProps, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import ArticleListingRendering from 'component-children/Articles/ArticleListing/ArticleListing';
import { ArticleListingProps } from 'lib/types/components/Articles/article-listing';
import { ArticleDataType } from 'lib/types';
import {
  contentRootIdNullChecker,
  fetchSiteRootInfo,
  getLayoutLanguage,
  getSiteName,
  normalizeSxaTags,
} from 'lib/helpers';
import { getArticlesByVariant, getVariantFromRendering } from 'lib/helpers/listing/article-listing';
import { ARTICLE_VARIANTS, ArticleVariant } from 'lib/helpers/article-variants';
import { INSIGHTS_TEMPLATE_ID, NEWS_TEMPLATE_ID, ARTICLE_TEMPLATE_ID } from 'lib/graphql/id';

// ArticleListing variant wrapper components
const ArticleListingDefault = (props: ArticleListingProps): JSX.Element => {
  const params = props.rendering?.params || {};
  const variant = (params.Variant as ArticleVariant) || ARTICLE_VARIANTS.DEFAULT;
  return (
    <Frame params={props.params}>
      <ArticleListingRendering {...props} variant={variant} />
    </Frame>
  );
};

const InsightsArticleListing = (props: ArticleListingProps): JSX.Element => {
  const variant = ARTICLE_VARIANTS.INSIGHTS;
  return (
    <Frame params={props.params}>
      <ArticleListingRendering {...props} variant={variant} />
    </Frame>
  );
};

const NewsArticleListing = (props: ArticleListingProps): JSX.Element => {
  const variant = ARTICLE_VARIANTS.NEWS;
  return (
    <Frame params={props.params}>
      <ArticleListingRendering {...props} variant={variant} />
    </Frame>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  const variant = getVariantFromRendering(rendering);
  const siteName = getSiteName(layoutData);
  const { contentRoot } = await fetchSiteRootInfo(siteName, language);

  // Always fetch data from GraphQL for server-side rendering
  // Don't use pre-populated data to ensure server-side fetching
  let pageList: ArticleDataType[] = [];

  const templateIds = {
    INSIGHTS_TEMPLATE_ID,
    NEWS_TEMPLATE_ID,
    ARTICLE_TEMPLATE_ID,
  };
  // Get articles based on variant - fetch ALL pages, not just first 10
  pageList = await getArticlesByVariant(
    variant,
    language,
    contentRootIdNullChecker(contentRoot?.id),
    templateIds
  );
  // Normalize and ensure all tag properties are serializable
  const processedPageList = pageList.map((articleItem) => {
    if (!articleItem) return articleItem;

    // Normalize tags to consistent format and make serializable
    const normalizedTags = normalizeSxaTags(articleItem.sxaTags?.targetItems);
    const serializableSxaTags = articleItem.sxaTags?.targetItems
      ? {
          ...articleItem.sxaTags,
          targetItems: normalizedTags.map((tag) => ({
            id: tag.id || null,
            name: tag.name || null,
            displayName: tag.displayName || null,
            fields: {
              Title: {
                value: tag.fields?.Title?.value || null,
              },
            },
          })),
        }
      : articleItem.sxaTags;

    return {
      ...articleItem,
      sxaTags: serializableSxaTags,
    };
  });

  return {
    rendering: {
      ...rendering,
      data: processedPageList,
    },
    route: layoutData?.sitecore?.route,
  };
};

// Export variant components with withDatasourceCheck
export const Default = withDatasourceCheck()<ArticleListingProps>(ArticleListingDefault);
export const Insights = withDatasourceCheck()<ArticleListingProps>(InsightsArticleListing);
export const News = withDatasourceCheck()<ArticleListingProps>(NewsArticleListing);
