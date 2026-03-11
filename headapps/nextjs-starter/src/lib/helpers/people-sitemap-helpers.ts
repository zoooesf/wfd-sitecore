import type { NextApiRequest } from 'next';
import { getGraphQlClient } from 'lib/graphql-client';
import { Field, SiteResolver } from '@sitecore-content-sdk/nextjs';
import { PROFILE_TEMPLATE_ID } from 'lib/graphql';
import { contentRootIdNullChecker } from 'lib/helpers';
import sites from '.sitecore/sites.json';
import {
  GetPeoplePageDisplayName,
  GetSiteItemData,
  GetAllProfiles,
} from 'graphql/generated/graphql-documents';

type ContentRootItem = {
  id: string;
  path: string;
};

type SiteItemDataResponse = {
  layout: {
    item: {
      contentRoot: ContentRootItem;
    };
  };
};

type PeopleData = {
  displayName: string;
  updatedDateTime: {
    value: string;
  };
  language: {
    name: string;
  };
  sitemapPriority: {
    jsonValue: {
      fields: {
        Value: Field<string>;
      };
    };
  };
  sitemapChangeFreq: {
    jsonValue: {
      fields: {
        Value: Field<string>;
      };
    };
  };
};

type PeoplePageDisplayNamePerLanguageResponse = {
  item: {
    languages: {
      language: {
        name: string;
      };
      displayName: string;
    }[];
  };
};

const PEOPLE_SITEMAP_PAGINATION_SIZE = 50;

export const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidPeopleData = (person: unknown): person is PeopleData => {
  const a = person as PeopleData;
  return (
    a &&
    typeof a === 'object' &&
    isValidString(a.displayName) &&
    a.updatedDateTime &&
    isValidString(a.updatedDateTime.value) &&
    a.language &&
    isValidString(a.language.name)
  );
};

export const nameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const formatDateFromSitecore = (sitecoreDateTime: string): string => {
  if (!isValidString(sitecoreDateTime) || sitecoreDateTime.length < 8) {
    console.warn('⚠️ Invalid Sitecore datetime format:', sitecoreDateTime);
    return new Date().toISOString().split('T')[0];
  }

  try {
    const dateStr = sitecoreDateTime.substring(0, 8);
    const formatted = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(
      6,
      8
    )}`;

    if (isNaN(Date.parse(formatted))) {
      throw new Error('Invalid date format');
    }

    return formatted;
  } catch (error) {
    console.warn('⚠️ Error formatting Sitecore date:', error);
    return new Date().toISOString().split('T')[0];
  }
};

export const generateSitemapXml = (entries: string[] = []): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${entries.join('\n')}
  </urlset>`;
};

// Core business logic functions
export const fetchAllPeople = async (siteName: string): Promise<PeopleData[]> => {
  try {
    const allPeople: PeopleData[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    const graphQLClient = getGraphQlClient();

    // Get site ID
    const siteResult = (await graphQLClient.request(GetSiteItemData, {
      siteName: siteName,
    })) as SiteItemDataResponse;
    const siteId = contentRootIdNullChecker(siteResult.layout.item.contentRoot?.id);

    // Paginate through all people
    while (hasNextPage) {
      const result = await graphQLClient.request(GetAllProfiles, {
        templateId: PROFILE_TEMPLATE_ID,
        siteId,
        first: PEOPLE_SITEMAP_PAGINATION_SIZE,
        after: cursor,
      });

      const typedResult = result as {
        search: {
          results: PeopleData[];
          pageInfo: {
            hasNext: boolean;
            endCursor: string;
          };
        };
      };

      const pagePeople = (typedResult.search.results || []).filter(isValidPeopleData);
      const pageInfo = typedResult.search.pageInfo;

      allPeople.push(...pagePeople);

      hasNextPage = pageInfo?.hasNext || false;
      cursor = pageInfo?.endCursor || null;
    }

    return allPeople;
  } catch (error) {
    console.error('❌ Error fetching people profiles:', error);
    return [];
  }
};

export const fetchPeoplePageDisplayNames = async (
  peoplePageId: string
): Promise<{ [language: string]: string }> => {
  const graphQLClient = getGraphQlClient();
  const peoplePageDisplayNames: { [language: string]: string } = {};

  const result = (await graphQLClient.request(GetPeoplePageDisplayName, {
    peoplePageId: peoplePageId,
  })) as PeoplePageDisplayNamePerLanguageResponse;

  if (result?.item?.languages) {
    result.item.languages.forEach((item) => {
      peoplePageDisplayNames[item.language.name] = item.displayName.toLowerCase();
    });
  }

  return peoplePageDisplayNames;
};

export const groupPeopleBySlug = (people: PeopleData[]): Map<string, PeopleData[]> => {
  const peopleGroups = new Map<string, PeopleData[]>();

  people.forEach((person) => {
    if (!isValidPeopleData(person)) {
      console.warn('⚠️ Skipping invalid person data:', person);
      return;
    }

    const slug = nameToSlug(person.displayName);
    const existingPeople = peopleGroups.get(slug) || [];
    peopleGroups.set(slug, [...existingPeople, person]);
  });

  return peopleGroups;
};

export const createAlternateLinks = (
  peopleVersions: PeopleData[],
  peoplePageDisplayNames: { [language: string]: string },
  reqProtocol: string,
  reqtHost: string
): string => {
  const alternateLinks = peopleVersions
    .map((person) => {
      const langName = person.language.name;
      const langPath = peoplePageDisplayNames[langName];
      const langPrefix = langName;
      const slug = nameToSlug(person.displayName);

      if (!langPath) return null;

      return `    <xhtml:link rel="alternate" hreflang="${langName}" href="${reqProtocol}://${reqtHost}/${langPrefix}/${langPath}/${slug}" />`;
    })
    .filter((link): link is string => link !== null)
    .join('\n');

  return alternateLinks;
};

export const createSitemapEntries = (
  peopleGroups: Map<string, PeopleData[]>,
  peoplePageDisplayNames: { [language: string]: string },
  reqProtocol: string,
  reqtHost: string
): string[] => {
  const peopleEntries: string[] = [];

  peopleGroups.forEach((peopleVersions, slug) => {
    // Sort so en versions come first
    const sortedPeopleVersions = peopleVersions.sort((a, b) => {
      const aLang = a?.language?.name || '';
      const bLang = b?.language?.name || '';
      if (aLang === 'en' && bLang !== 'en') return -1;
      if (aLang !== 'en' && bLang === 'en') return 1;
      return 0;
    });

    const alternateLinks = createAlternateLinks(
      sortedPeopleVersions,
      peoplePageDisplayNames,
      reqProtocol,
      reqtHost
    );

    // Create URL entry for each language version
    sortedPeopleVersions.forEach((person) => {
      const langName = person.language.name;
      const defaultLangPath = peoplePageDisplayNames['en'];
      const xDefaultLink = `<xhtml:link rel="alternate" hreflang="x-default" href="${reqProtocol}://${reqtHost}/${defaultLangPath}/${slug}" />`;
      const langPath = peoplePageDisplayNames[langName];
      const langPrefix = langName;
      const primaryUrl = `${reqProtocol}://${reqtHost}/${langPrefix}/${langPath}/${slug}`;
      const lastModDate = formatDateFromSitecore(person.updatedDateTime.value);
      const changeFreq = person?.sitemapChangeFreq?.jsonValue?.fields?.Value?.value || 'daily';
      const priority = person?.sitemapPriority?.jsonValue?.fields?.Value?.value || '0.5';

      const urlEntry = `<url>
          <loc>${primaryUrl}</loc>
          <lastmod>${lastModDate}</lastmod>
          <changefreq>${changeFreq.toLowerCase()}</changefreq>
          <priority>${priority}</priority>
          ${xDefaultLink}
          ${alternateLinks}
        </url>`;

      peopleEntries.push(urlEntry);
    });
  });

  return peopleEntries;
};

export const getRequestInfo = (req: NextApiRequest) => {
  const hostName = req.headers['host']?.split(':')[0] || 'localhost';
  const site = new SiteResolver(sites).getByHost(hostName);
  const reqtHost = Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host || '';
  const reqProtocol = Array.isArray(req.headers['x-forwarded-proto'])
    ? req.headers['x-forwarded-proto'][0]
    : req.headers['x-forwarded-proto'] || 'https';

  return { site, reqtHost, reqProtocol };
};
