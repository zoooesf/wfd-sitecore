import { SimplePageListingWithTags, GetSimplePageById } from 'graphql/generated/graphql-documents';
import { getGraphQlClient } from 'lib/graphql-client';
import { PageDataType } from 'lib/types';
import { ItemUrl } from 'lib/types/fields';
import { TagItem } from 'lib/helpers/merge-page-tags';

// Define response types to match the GraphQL responses
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
  item: PageDataType;
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

/**
 * Result type for the page listing function
 */
type PageListingResult = {
  results: PageDataType[];
  pageInfo: {
    endCursor: string;
    hasNext: boolean;
  };
  total: number;
};

/**
 * Fetches page listing data using a two-step approach:
 * 1. First gets IDs and tags using SimplePageListingWithTags
 * 2. Then fetches full details for each page using GetSimplePageById
 * 3. Merges the data to create complete page objects with tags
 */
export async function getPageListingWithDetails(
  pageId: string,
  language: string,
  templateId: string,
  initialEndCursor?: string,
  first: number = 10
): Promise<PageListingResult> {
  const client = getGraphQlClient();

  try {
    // Initialize collection of all pages across pages
    let allBasicPages: PageBasicData[] = [];
    let endCursor = initialEndCursor || '';
    let hasNextPage = true;
    let totalPages = 0;
    let finalPageInfo = { endCursor: '', hasNext: false };

    // Fetch all pages of items
    while (hasNextPage) {
      // Step 1: Get basic page data with IDs and tags for current page
      const basicListingResult = await client.request<PageListingResponse>(
        SimplePageListingWithTags.loc?.source.body || '',
        {
          pageID: pageId,
          language,
          endCursor: endCursor || null, // Pass null if empty string
          first,
          templateId,
        }
      );

      // Check if we have results
      if (!basicListingResult?.item?.pages?.results?.length) {
        console.log('No page results found on this page');
        break;
      }

      // Add this page's items to our collection
      allBasicPages = [...allBasicPages, ...basicListingResult.item.pages.results];

      // Update pagination info for next iteration
      endCursor = basicListingResult.item.pages.pageInfo.endCursor;
      hasNextPage = basicListingResult.item.pages.pageInfo.hasNext;
      totalPages = basicListingResult.item.pages.total || 0;
      finalPageInfo = basicListingResult.item.pages.pageInfo;

      // Break if we reached the last page
      if (!hasNextPage) break;
    }

    // If no pages were found across all pages
    if (allBasicPages.length === 0) {
      console.log('No page results found across all pages');
      return {
        results: [],
        pageInfo: {
          endCursor: '',
          hasNext: false,
        },
        total: 0,
      };
    }

    const basicPages = allBasicPages;

    // Step 2: Fetch detailed data for each page in parallel
    const detailedPagesPromises = basicPages.map(async (basicPage) => {
      try {
        const detailResult = await client.request<PageDetailResponse>(
          GetSimplePageById.loc?.source.body || '',
          {
            itemId: basicPage.id,
            language,
          }
        );
        return detailResult?.item;
      } catch (error) {
        console.error(`Error fetching details for page ${basicPage.id}:`, error);
        // Return basic data if detail fetch fails
        return null;
      }
    });

    // Wait for all detailed page queries to complete
    const detailedPages = await Promise.all(detailedPagesPromises);

    // Step 3: Merge data (basic page tags with detailed page data)
    const mergedPages = basicPages
      .map((basicPage, index) => {
        const detailedPage = detailedPages[index];

        if (!detailedPage) {
          return null;
        }

        const mergedData = {
          ...detailedPage,
          sxaTags: basicPage.sxaTags,
          url: {
            path: basicPage.url.path,
            url: basicPage.url.path,
          } as ItemUrl,
        };

        return mergedData as unknown as PageDataType;
      })
      .filter(Boolean) as PageDataType[]; // Remove any null entries from failed detail fetches

    return {
      results: mergedPages,
      pageInfo: finalPageInfo,
      total: totalPages,
    };
  } catch (error) {
    console.error('Error in getPageListingWithDetails:', error);
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
