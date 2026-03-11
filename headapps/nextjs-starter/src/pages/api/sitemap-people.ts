// CUSTOMIZATION (whole file) - For people feature
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createSitemapEntries,
  fetchAllPeople,
  fetchPeoplePageDisplayNames,
  generateSitemapXml,
  getRequestInfo,
  groupPeopleBySlug,
} from 'lib/helpers/people-sitemap-helpers';
import { fetchPeoplePageId } from 'lib/helpers/site-config-helpers';

// Main API handler
const peopleSitemapApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  try {
    const { site, reqtHost, reqProtocol } = getRequestInfo(req);

    const peoplePageId = await fetchPeoplePageId(site.name);

    if (!peoplePageId) {
      res.setHeader('Content-Type', 'text/xml;charset=utf-8');
      return res.send(generateSitemapXml());
    }

    const peoplePageDisplayNamesByLanguage = await fetchPeoplePageDisplayNames(peoplePageId);
    const people = await fetchAllPeople(site.name);

    // Return empty sitemap if no people or site has no people page
    if (!people.length || Object.entries(peoplePageDisplayNamesByLanguage).length === 0) {
      res.setHeader('Content-Type', 'text/xml;charset=utf-8');
      return res.send(generateSitemapXml());
    }

    const peopleGroups = groupPeopleBySlug(people);
    const sitemapEntries = createSitemapEntries(
      peopleGroups,
      peoplePageDisplayNamesByLanguage,
      reqProtocol,
      reqtHost
    );

    const sitemapXml = generateSitemapXml(sitemapEntries);
    res.setHeader('Content-Type', 'text/xml;charset=utf-8');
    return res.send(sitemapXml);
  } catch (error) {
    console.error('❌ Error generating people sitemap:', error);
    return res.status(500).json({
      error: 'Error generating people sitemap',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default peopleSitemapApi;
