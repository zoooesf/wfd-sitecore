import { GetRecipePageById, SimplePageListingWithTags } from 'graphql/generated/graphql-documents';
import { getGraphQlClient } from 'lib/graphql-client';
import { PageDataType } from 'lib/types';
import { ItemUrl } from 'lib/types/fields';
import { TagItem } from 'lib/helpers/merge-page-tags';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ImageGQLType } from 'lib/types/graphql';

export type RecipePageDataType = PageDataType & {
  title?: { jsonValue: Field<string> };
  prepTime?: { jsonValue: Field<string> };
  cookTime?: { jsonValue: Field<string> };
  imageMobile?: ImageGQLType;
};

type PageListingResponse = {
  item: {
    pages: {
      results: PageBasicData[];
      pageInfo: {
        endCursor: string;
        hasNext: boolean;
      };
      total: number;
    };
  };
};

type PageDetailResponse = {
  item: RecipePageDataType;
};

type PageBasicData = {
  id: string;
  name: string;
  displayName: string;
  url: {
    path: string;
  };
  sxaTags?: { targetItems?: TagItem[] };
};

type RecipeListingResult = {
  results: RecipePageDataType[];
  pageInfo: {
    endCursor: string;
    hasNext: boolean;
  };
  total: number;
};

/**
 * Fetches recipe page listing data using a two-step approach:
 * 1. Gets all IDs using SimplePageListingWithTags
 * 2. Fetches full recipe details for each page using GetRecipePageById
 * 3. Merges the data so tags and recipe-specific fields are available
 * @param {string} pageId - The Sitecore item ID of the parent page
 * @param {string} language - The language code (e.g. "en")
 * @param {string} templateId - The recipe page template ID
 * @param {string} [initialEndCursor] - Optional pagination cursor
 * @param {number} [first=10] - Number of items per page
 * @returns {Promise<RecipeListingResult>} The merged recipe page data
 */
export async function getRecipeListingWithDetails(
  pageId: string,
  language: string,
  templateId: string,
  initialEndCursor?: string,
  first: number = 10
): Promise<RecipeListingResult> {
  const client = getGraphQlClient();

  try {
    let allBasicPages: PageBasicData[] = [];
    let endCursor = initialEndCursor || '';
    let hasNextPage = true;
    let totalPages = 0;
    let finalPageInfo = { endCursor: '', hasNext: false };

    while (hasNextPage) {
      const basicListingResult = await client.request<PageListingResponse>(
        SimplePageListingWithTags.loc?.source.body || '',
        {
          pageID: pageId,
          language,
          endCursor: endCursor || null,
          first,
          templateId,
        }
      );

      if (!basicListingResult?.item?.pages?.results?.length) {
        break;
      }

      allBasicPages = [...allBasicPages, ...basicListingResult.item.pages.results];
      endCursor = basicListingResult.item.pages.pageInfo.endCursor;
      hasNextPage = basicListingResult.item.pages.pageInfo.hasNext;
      totalPages = basicListingResult.item.pages.total || 0;
      finalPageInfo = basicListingResult.item.pages.pageInfo;

      if (!hasNextPage) break;
    }

    if (allBasicPages.length === 0) {
      return {
        results: [],
        pageInfo: { endCursor: '', hasNext: false },
        total: 0,
      };
    }

    const detailedPagesPromises = allBasicPages.map(async (basicPage) => {
      try {
        const detailResult = await client.request<PageDetailResponse>(
          GetRecipePageById.loc?.source.body || '',
          {
            itemId: basicPage.id,
            language,
          }
        );
        return detailResult?.item;
      } catch (error) {
        console.error(`Error fetching recipe details for page ${basicPage.id}:`, error);
        return null;
      }
    });

    const detailedPages = await Promise.all(detailedPagesPromises);

    const mergedPages = allBasicPages
      .map((basicPage, index) => {
        const detailedPage = detailedPages[index];

        if (!detailedPage) {
          return null;
        }

        return {
          ...detailedPage,
          sxaTags: basicPage.sxaTags,
          url: {
            path: basicPage.url.path,
            url: basicPage.url.path,
          } as ItemUrl,
        } as RecipePageDataType;
      })
      .filter(Boolean) as RecipePageDataType[];

    return {
      results: mergedPages,
      pageInfo: finalPageInfo,
      total: totalPages,
    };
  } catch (error) {
    console.error('Error in getRecipeListingWithDetails:', error);
    return {
      results: [],
      pageInfo: { endCursor: '', hasNext: false },
      total: 0,
    };
  }
}
