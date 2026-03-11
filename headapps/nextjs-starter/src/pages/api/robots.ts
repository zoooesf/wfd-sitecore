// BEGIN CUSTOMIZATION - Required imports for people sitemap
import { SiteResolver } from '@sitecore-content-sdk/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPeoplePageId } from 'lib/helpers/site-config-helpers';
// END CUSTOMIZATION
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

/**
 * API route for serving robots.txt
 *
 * This Next.js API route generates and returns the robots.txt content dynamically
 * based on the resolved site name. It is commonly
 * used by search engine crawlers to determine crawl and indexing rules.
 */

// BEGIN CUSTOMIZATION - Custom robots.txt implementation with people sitemap
// This implementation is based on https://github.com/Sitecore/content-sdk/blob/dev/packages/nextjs/src/middleware/robots-middleware.ts
const robotsApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.setHeader('Content-Type', 'text/plain');

  // Resolve site based on hostname
  const forwardedHost = req.headers['x-forwarded-host'];
  const hostName =
    (typeof forwardedHost === 'string' ? forwardedHost : forwardedHost?.[0]) ||
    req.headers.host?.split(':')[0] ||
    'localhost';
  const site = new SiteResolver(sites).getByHost(hostName);

  try {
    const robotsContent = await scClient.getRobots(site.name);

    if (!robotsContent) {
      return res.status(404).send('User-agent: *\nDisallow: /');
    }

    let robots = robotsContent;
    // if people page id is found, assume people sitemap exists
    const peoplePageId = await fetchPeoplePageId(site.name);
    if (peoplePageId) {
      const reqProtocol = req.headers['x-forwarded-proto'] || 'https';
      const reqHost = req.headers.host;
      const peopleLine = `Sitemap: ${reqProtocol}://${reqHost}/sitemap-people.xml`;
      robots = robots + peopleLine;
    }

    return res.status(200).send(robots);
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
};

export default robotsApi;
// END CUSTOMIZATION
