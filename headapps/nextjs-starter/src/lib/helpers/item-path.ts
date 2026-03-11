import { getGraphQlClient } from 'lib/graphql-client';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { GetItemPath } from 'graphql/generated/graphql-documents';

/**
 * Retrieves the URL path for a Sitecore item by its ID
 * @param itemId - The ID or path of the Sitecore item
 * @param language - The language code (defaults to mainLanguage)
 * @returns Promise with the item path data
 * @throws Error if the GraphQL request fails
 */
export const getItemPath = async (
  itemId: string,
  language = mainLanguage
): Promise<ItemPathReturnType> => {
  try {
    const graphQLClient = getGraphQlClient();

    const variables = {
      itemId,
      language,
    };

    return await graphQLClient.request(GetItemPath, variables);
  } catch (error) {
    console.error('Error fetching item path:', error);
    throw new Error(
      `Failed to retrieve path for item ${itemId}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

/**
 * Utility function to extract just the path string from the GraphQL response
 * @param itemId - The ID or path of the Sitecore item
 * @param language - The language code (defaults to mainLanguage)
 * @returns Promise with just the path string or null if not found
 */
export const getItemPathString = async (
  itemId: string,
  language = mainLanguage
): Promise<string | null> => {
  try {
    const response = await getItemPath(itemId, language);
    return response?.item?.url?.path || null;
  } catch (error) {
    console.error('Error in getItemPathString:', error);
    return null;
  }
};

export type ItemPathReturnType = {
  item: {
    url: {
      path: string;
    };
  };
};
