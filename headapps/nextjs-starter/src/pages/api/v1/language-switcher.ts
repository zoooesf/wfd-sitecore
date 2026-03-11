// CUSTOMIZATION (whole file) - For the language switcher feature
import { NextApiRequest, NextApiResponse } from 'next';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetUrlByItemId } from 'graphql/generated/graphql-documents';

interface LanguageSwitcherRequest {
  destinationLanguage: string;
  itemId: string;
}

interface LanguageSwitcherResponse {
  path?: string;
  error?: string;
}

interface ItemResponse {
  item?: {
    url?: {
      path: string;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LanguageSwitcherResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destinationLanguage, itemId }: LanguageSwitcherRequest =
    req.query as unknown as LanguageSwitcherRequest;

  if (
    !destinationLanguage ||
    !itemId ||
    typeof destinationLanguage !== 'string' ||
    typeof itemId !== 'string'
  ) {
    return res.status(400).json({
      error: 'Missing required parameters: destinationLanguage and itemId',
    });
  }

  const urlByItemIdQuery = GetUrlByItemId.loc?.source.body;

  if (!urlByItemIdQuery) {
    return res.status(500).json({ error: 'Missing GetUrlByItemId query' });
  }

  try {
    const graphQLClient = getGraphQlClient();
    // Retrieve the URL path from the item ID
    const localizedResult = (await graphQLClient.request(urlByItemIdQuery, {
      itemId,
      language: destinationLanguage,
    })) as ItemResponse;

    const returnPath = localizedResult?.item?.url?.path
      ? `${localizedResult.item.url.path}`
      : `/${destinationLanguage}`;

    return res.status(200).json({
      path: returnPath,
    });
  } catch (error) {
    console.error('Error in language switcher API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
