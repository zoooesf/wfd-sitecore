// CUSTOMIZATION (whole file) - For attestation feature
import { NextApiRequest, NextApiResponse } from 'next';
import { getGraphQlClient } from 'lib/graphql-client';
import { GetPersonas } from 'graphql/generated/graphql-documents';
import { mainLanguage } from 'lib/i18n/i18n-config';

// Type definitions for GraphQL response
type PersonaIdentityResponse = {
  id: string;
  contentName?: {
    value: string;
  };
  description?: {
    value: string;
  };
};

type GetPersonasResponse = {
  item?: {
    children?: {
      results?: PersonaIdentityResponse[];
    };
  };
};

// Type for the API response
type PersonaApiResponse = {
  id: string;
  name: string;
  description?: {
    value: string;
  };
};

// In-memory cache for personas
const personaCache: Record<string, { data: PersonaApiResponse[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { siteName, language = mainLanguage } = req.query;

    // Validate required parameters
    if (!siteName || typeof siteName !== 'string') {
      return res.status(400).json({ error: 'siteName is required' });
    }

    const languageString = Array.isArray(language) ? language[0] : language;
    const cacheKey = `${siteName}-${languageString}`;

    // Check in-memory cache
    const cached = personaCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Set cache headers for browser caching
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.status(200).json({ personas: cached.data });
    }

    const personaFolderPath = `/sitecore/content/Sites/${siteName}/Settings/Component Settings/Persona Identity Folder`;

    const graphQLClient = getGraphQlClient();
    const variables = {
      sitePath: personaFolderPath,
      language: languageString,
    };

    const response = (await graphQLClient.request(
      GetPersonas.loc?.source.body || '',
      variables
    )) as GetPersonasResponse;

    const personas = response?.item?.children?.results || [];

    // Convert to simplified Persona format with localized names
    const simplifiedPersonas: PersonaApiResponse[] = personas.map(
      (persona: PersonaIdentityResponse) => ({
        id: persona.id,
        name: persona.contentName?.value || '',
        description: persona.description?.value ? { value: persona.description.value } : undefined,
      })
    );

    // Update in-memory cache
    personaCache[cacheKey] = {
      data: simplifiedPersonas,
      timestamp: Date.now(),
    };

    // Set cache headers for browser caching (5 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({ personas: simplifiedPersonas });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return res.status(500).json({ error: 'Failed to fetch personas' });
  }
}
