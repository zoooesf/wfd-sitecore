import {
  GetArticleById,
  GetArticleListing,
  GetInsightById,
  GetNewsById,
} from 'graphql/generated/graphql-documents';
import { getGraphQlClient } from 'lib/graphql-client';
import { ArticleDataType } from 'lib/types';
import { TagItem } from 'lib/helpers/merge-page-tags';
import { DocumentNode } from 'graphql';
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ARTICLE_VARIANTS, ArticleVariant } from '../article-variants';

// Define response types to match the GraphQL responses
type ArticleListingResponse = {
  item?: {
    pages?: {
      results: ArticleBasicData[];
      pageInfo: {
        endCursor: string;
        hasNext: boolean;
      };
      total: number;
    };
  };
  search?: {
    results: ArticleBasicData[];
    pageInfo: {
      endCursor: string;
      hasNext: boolean;
    };
    total: number;
  };
};

type ArticleDetailResponse = {
  item: ArticleDataType;
};

type ArticleBasicData = {
  id: string;
  sxaTags?: { targetItems?: TagItem[] };
};

/**
 * Result type for the article listing function
 */
type ArticleListingResult = {
  results: ArticleDataType[];
  pageInfo: {
    endCursor: string;
    hasNext: boolean;
  };
  total: number;
};

/**
 * Fetches articles with tags using a two-step approach with pagination:
 * 1. First gets ALL IDs and tags using listing query (with pagination)
 * 2. Then fetches full details for each article using detail query
 * 3. Merges the data to create complete article objects with tags
 */
async function fetchArticlesWithTags(
  listingQuery: DocumentNode | string,
  queryParams: Record<string, string | number | boolean>,
  detailQueryFn: DocumentNode | string,
  language: string,
  fetchAllPages: boolean = true
): Promise<ArticleListingResult> {
  const client = getGraphQlClient();

  try {
    // Step 1: Fetch article IDs and tags using the listing query
    let queryString;

    // Check if we have a GraphQL document with loc.source.body
    if (
      typeof listingQuery !== 'string' &&
      'loc' in listingQuery &&
      listingQuery.loc?.source?.body
    ) {
      queryString = listingQuery.loc.source.body;
    }
    // Check if it's a string already
    else if (typeof listingQuery === 'string') {
      queryString = listingQuery;
    }
    // Try to extract the query string from the document
    else if (listingQuery.definitions) {
      // This is a last resort attempt to get the query
      queryString = listingQuery.toString();
    } else {
      console.error('Unable to extract query from GraphQL document');
      throw new Error('No query body found');
    }

    // Initialize collection of all articles across pages
    let allBasicArticles: ArticleBasicData[] = [];
    let endCursor = queryParams.endCursor || '';
    let hasNextPage = true;
    let totalArticles = 0;
    let finalPageInfo = { endCursor: '', hasNext: false };

    // Fetch all pages of articles if fetchAllPages is true
    while (hasNextPage) {
      const currentQueryParams = {
        ...queryParams,
        endCursor: endCursor || null, // Pass null if empty string
      };

      const listingResult = await client.request<ArticleListingResponse>(
        queryString,
        currentQueryParams
      );
      // Determine which path to use for results based on query type
      const resultsPath =
        listingResult?.item?.pages?.results || listingResult?.search?.results || [];

      const pageInfo = listingResult?.item?.pages?.pageInfo ||
        listingResult?.search?.pageInfo || { endCursor: '', hasNext: false };

      const total = listingResult?.item?.pages?.total || listingResult?.search?.total || 0;

      // Check if we have results on this page
      if (!resultsPath || resultsPath.length === 0) {
        break;
      }

      // Add this page's articles to our collection
      allBasicArticles = [...allBasicArticles, ...resultsPath];

      // Update pagination info for next iteration
      endCursor = pageInfo.endCursor;
      hasNextPage = pageInfo.hasNext && fetchAllPages; // Only continue if fetchAllPages is true
      totalArticles = total;
      finalPageInfo = pageInfo;

      // Articles added from this page

      // Break if we reached the last page or don't want all pages
      if (!hasNextPage || !fetchAllPages) break;
    }

    if (allBasicArticles.length === 0) {
      return {
        results: [],
        pageInfo: {
          endCursor: '',
          hasNext: false,
        },
        total: 0,
      };
    }

    // Extract IDs from the results
    const articleIds = allBasicArticles.map((item: { id: string }) => item.id);

    // Fetch details for all article IDs

    // Step 2: Fetch detailed data for each article ID in parallel
    const detailedArticlesPromises = articleIds.map(async (id: string) => {
      try {
        let detailQueryString;

        // Check if we have a GraphQL document with loc.source.body
        if (
          typeof detailQueryFn !== 'string' &&
          'loc' in detailQueryFn &&
          detailQueryFn.loc?.source?.body
        ) {
          detailQueryString = detailQueryFn.loc.source.body;
        }
        // Check if it's a string already
        else if (typeof detailQueryFn === 'string') {
          detailQueryString = detailQueryFn;
        }
        // Try to extract the query string from the document
        else if (detailQueryFn.definitions) {
          // This is a last resort attempt to get the query
          detailQueryString = detailQueryFn.toString();
        } else {
          console.error(`Unable to extract detail query for article ${id}`);
          throw new Error(`No detail query body found for article ${id}`);
        }

        const detailResult = await client.request<ArticleDetailResponse>(detailQueryString, {
          itemId: id,
          language,
        });

        if (!detailResult?.item) {
          return null;
        }

        const matchingItem = allBasicArticles.find(
          (item: { id: string; sxaTags?: { targetItems?: TagItem[] } }) => item.id === id
        );

        return {
          ...detailResult.item,
          sxaTags: matchingItem?.sxaTags,
        };
      } catch (error) {
        console.error(`Error fetching details for article ${id}:`, error);
        return null;
      }
    });

    // Wait for all detailed article queries to complete
    const detailedArticles = await Promise.all(detailedArticlesPromises);
    const validArticles = detailedArticles.filter(Boolean) as ArticleDataType[];

    return {
      results: validArticles,
      pageInfo: finalPageInfo,
      total: totalArticles,
    };
  } catch (error) {
    console.error('Error in fetchArticlesWithTags:', error);
    return {
      results: [],
      pageInfo: {
        endCursor: '',
        hasNext: false,
      },
      total: 0,
    };
  }
}

/**
 * Helper function to determine variant from rendering object
 */
export function getVariantFromRendering(rendering: ComponentRendering): ArticleVariant {
  const params = rendering?.params || {};

  // Simply use FieldNames parameter as variant
  return (params.FieldNames as ArticleVariant) || ARTICLE_VARIANTS.DEFAULT;
}

/**
 * Returns appropriate "no results" message based on article variant
 */
export function getNoResultsMessageByVariant(variant: ArticleVariant | undefined): string {
  // As these dictionary keys are used indirectly, we added t('') comments for the analyze-dictionary-usage tool to report those keys as used.
  switch (variant) {
    case ARTICLE_VARIANTS.INSIGHTS:
      return 'No insight pages found.'; // t('No insight pages found.')
    case ARTICLE_VARIANTS.NEWS:
      return 'No news pages found.'; // t('No news pages found.')
    default:
      return 'No article posts found.'; // t('No article posts found.')
  }
}

/**
 * Helper function to get articles based on variant
 */
export async function getArticlesByVariant(
  variant: ArticleVariant,
  language: string,
  contentRootId: string,
  templateIds: Record<string, string>,
  fetchAllPages: boolean = true
): Promise<ArticleDataType[]> {
  try {
    if (!contentRootId || contentRootId.trim() === '') {
      console.error(`Error getting articles for variant ${variant}: contentRootId is empty`);
      return [];
    }

    let variantTemplateId = '';
    let detailedQueryNode = GetArticleById;
    switch (variant) {
      case ARTICLE_VARIANTS.INSIGHTS:
        variantTemplateId = templateIds.INSIGHTS_TEMPLATE_ID;
        detailedQueryNode = GetInsightById;
        break;
      case ARTICLE_VARIANTS.NEWS:
        variantTemplateId = templateIds.NEWS_TEMPLATE_ID;
        detailedQueryNode = GetNewsById;
        break;
      default:
        variantTemplateId = templateIds.ARTICLE_TEMPLATE_ID;
        detailedQueryNode = GetArticleById;
        break;
    }
    const result = await fetchArticlesWithTags(
      GetArticleListing,
      {
        pageID: contentRootId,
        templateId: variantTemplateId,
        language,
        first: 10,
      },
      detailedQueryNode,
      language,
      fetchAllPages
    );
    return result.results;
  } catch (error) {
    console.error(`Error getting articles for variant ${variant}:`, error);
    return [];
  }
}

/**
 * Filters articles by person name
 * @param articles - Array of articles to filter
 * @param personName - The full name of the person to filter by
 * @returns Array of articles where the person is listed in profiles
 */
export function filterArticlesByPerson(
  articles: ArticleDataType[],
  personName: string
): ArticleDataType[] {
  if (!articles || articles.length === 0 || !personName) {
    return [];
  }

  return articles.filter((article: ArticleDataType) => {
    if (!article?.profiles) return false;
    const profiles = article.profiles as { targetItems?: { name: string }[] };
    const targetItems = profiles?.targetItems || [];
    return targetItems.some((item) => {
      const personItemName = item?.name;
      if (!personItemName) return false;
      return personItemName.toLowerCase() === personName.toLowerCase();
    });
  });
}
