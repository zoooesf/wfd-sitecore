// CUSTOMIZATION (whole file) - For knowledge center feature

/**
 * Knowledge Center Resources API
 *
 * This API endpoint returns a JSON document containing a list of all knowledge center
 * resources from the current site's "Knowledge Center Resources" folder.
 *
 * The API:
 * - Resolves the current site from the request domain
 * - Queries the Knowledge Center Resources folder via GraphQL for all available languages
 * - Returns resource items with tags, item ID, and file information
 *
 * Endpoint: GET /api/knowledge-center-resources
 *
 * Response includes:
 * - Site name
 * - Array of knowledge center resources with language, tags and file details (all language versions)
 * - Total count of resources (across all languages)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getGraphQlClient } from 'lib/graphql-client';
import { SiteResolver } from '@sitecore-content-sdk/nextjs';
import type {
  KnowledgeCenterResource,
  GraphQLKnowledgeCenterResponse,
} from 'lib/types/knowledge-center';
import { groupSxaTagsByPrefix, formatGroupedTagsForMeta, getFileNameFromSrc } from 'lib/helpers';
import { availableLanguages } from 'lib/i18n/i18n-config';
import { GetKnowledgeCenterResources } from 'graphql/generated/graphql-documents';
import { TagType } from 'lib/types/page/metadata';
import { KNOWLEDGE_CENTER_PAGE_SIZE } from 'lib/const';
import sites from '.sitecore/sites.json';

// Error codes for API responses
const MCR_ERROR_MESSAGE = {
  METHOD_NOT_ALLOWED: 'Method not allowed',
  SITE_NOT_FOUND: 'Site not found',
  FETCH_ERROR: 'Error fetching knowledge center resources',
  UNKNOWN_ERROR: 'Unknown error',
} as const;

/**
 * Recursively fetch all knowledge center resources for a given language using pagination
 */
const fetchAllResourcesForLanguage = async (
  graphQLClient: ReturnType<typeof getGraphQlClient>,
  knowledgeCenterPath: string,
  language: string,
  after: string | null = null,
  accumulatedResults: KnowledgeCenterResource[] = []
): Promise<KnowledgeCenterResource[]> => {
  const result = (await graphQLClient.request(GetKnowledgeCenterResources.loc?.source.body || '', {
    sitePath: knowledgeCenterPath,
    language,
    first: KNOWLEDGE_CENTER_PAGE_SIZE,
    after,
  })) as GraphQLKnowledgeCenterResponse;

  const resources =
    result.item?.children?.results?.map((resource) => {
      const fileJsonValue = resource.file?.jsonValue;
      const fileValue =
        fileJsonValue && 'value' in fileJsonValue ? fileJsonValue.value : fileJsonValue;

      const sxaTags = resource.sxaTags?.targetItems || [];
      const groupedTags = groupSxaTagsByPrefix(sxaTags as TagType[]);
      const formattedTags = formatGroupedTagsForMeta(groupedTags);

      return {
        itemId: resource.id,
        language: resource.language?.name || language,
        tags: formattedTags,
        file: {
          fileName: fileValue
            ? getFileNameFromSrc(fileValue.src, resource.displayName)
            : resource.displayName,
          title: fileValue?.title || '',
          keywords: fileValue?.keywords || '',
          description: fileValue?.description || '',
          extension: fileValue?.extension || '',
          size: fileValue?.size || '',
          url: fileValue?.src || '',
          lastUpdated: resource.updatedDateTime?.value || '',
        },
      };
    }) || [];

  const allResults = [...accumulatedResults, ...resources];

  // Check if there are more pages to fetch
  const pageInfo = result.item?.children?.pageInfo;
  if (pageInfo?.hasNext && pageInfo?.endCursor) {
    // Recursively fetch the next page
    return fetchAllResourcesForLanguage(
      graphQLClient,
      knowledgeCenterPath,
      language,
      pageInfo.endCursor,
      allResults
    );
  }

  return allResults;
};

// Main API handler
const knowledgeCenterResourcesApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: MCR_ERROR_MESSAGE.METHOD_NOT_ALLOWED });
    }

    // Resolve site based on hostname
    const hostName = req.headers['host']?.split(':')[0] || 'localhost';
    const site = new SiteResolver(sites).getByHost(hostName);

    if (!site) {
      return res.status(404).json({ error: MCR_ERROR_MESSAGE.SITE_NOT_FOUND });
    }

    // As of right now, the assumption is that every site WILL have a /Data/Knowledge Center Resources folder and therefore can be always found at the below path
    // TODO: eventually craft a more dynamic way of handling this in case the folder gets changed or removed
    const knowledgeCenterPath = `/sitecore/content/Sites/${site.name}/Data/Knowledge Center Resources`;
    const graphQLClient = getGraphQlClient();

    // Fetch resources for all available languages and combine results
    const allResources: KnowledgeCenterResource[] = [];

    for (const language of availableLanguages) {
      const resources = await fetchAllResourcesForLanguage(
        graphQLClient,
        knowledgeCenterPath,
        language
      );
      allResources.push(...resources);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      site: site.name,
      knowledgeCenterResources: allResources,
      totalCount: allResources.length,
    });
  } catch (error) {
    console.error(MCR_ERROR_MESSAGE.FETCH_ERROR, error);
    return res.status(500).json({
      error: MCR_ERROR_MESSAGE.FETCH_ERROR,
      message: error instanceof Error ? error.message : MCR_ERROR_MESSAGE.UNKNOWN_ERROR,
    });
  }
};

export default knowledgeCenterResourcesApi;
