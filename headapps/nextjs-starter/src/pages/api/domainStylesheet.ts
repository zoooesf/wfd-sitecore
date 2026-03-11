// CUSTOMIZATION (whole file) - Hack to have a unique header/footer per industry vertical
import type { NextApiRequest, NextApiResponse } from 'next';

type IndustryInfo = {
  itemName: string;
  caption: string;
};

// Helper function to detect industry from domain patterns
const getIndustryFromDomain = (domain: string): IndustryInfo | null => {
  // Check for tidal-[industry]-dev.getfishtank.com pattern
  const tidalPattern = /^tidal-([^-.]+)(?:-dev)?\.(?:getfishtank\.com|localhost)$/;
  const match = domain.match(tidalPattern);

  if (match) {
    const industryKey = match[1].toLowerCase();

    // Map industry keywords to display names
    const industryMap: Record<string, IndustryInfo> = {
      education: {
        itemName: 'Education',
        caption: 'Education',
      },
      energy: {
        itemName: 'Energy',
        caption: 'Energy',
      },
      financial: {
        itemName: 'Financial',
        caption: 'Financial',
      },
      healthcare: {
        itemName: 'Healthcare',
        caption: 'Healthcare',
      },
      manufacturing: {
        itemName: 'Manufacturing',
        caption: 'Manufacturing',
      },
      nonprofit: {
        itemName: 'NonProfitAssociations',
        caption: 'Nonprofit',
      },
      professionalservices: {
        itemName: 'ProfessionalServices',
        caption: 'Professional Services',
      },
      utilities: {
        itemName: 'Utilities',
        caption: 'Utilities',
      },
    };

    return industryMap[industryKey] || null;
  }

  return null;
};

const domainStylesheetApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  // Set response headers
  res.setHeader('Content-Type', 'text/css');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache

  // Extract hostname and remove port if present
  const hostname = req.headers['host']?.split(':')[0] || 'localhost';

  // Get industry info for the domain (supports both exact matches and patterns)
  const industryInfo = getIndustryFromDomain(hostname);

  if (industryInfo) {
    // Generate CSS for industry-specific domains
    const css = `
/* Domain-specific styling for ${hostname} - Industry: ${industryInfo.caption} */

/* Hide all headers, footers, and tertiary navs by default */
[data-component="Header"],
[data-component="FooterMain"],
[data-component="FooterMenu"],
[data-component="TertiaryNav"] {
  display: none !important;
}

/* Show only headers/footers that match the current industry */
[data-component="Header"][data-source-name="${industryInfo.itemName}"],
[data-component="FooterMain"][data-source-name="${industryInfo.itemName}"],
[data-component="FooterMenu"][data-source-name="${industryInfo.itemName}"],
[data-component="TertiaryNav"][data-source-name="${industryInfo.itemName}"] {
  display: block !important;
}

/* Add industry name after header logo */
[data-component="Header"] a[data-id="headerLogo"]::after {
  content: "for ${industryInfo.caption}";
  display: inline-block;
  margin-left: auto;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  vertical-align: middle;
  text-align: right;
  float: right;
  text-transform: uppercase;
}

/* Add industry name after footer logo */
[data-component="FooterMain"] a[data-id="footerLogo"]::after {
  content: "for ${industryInfo.caption}";
  display: inline-block;
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  vertical-align: middle;
  text-align: right;
  float: right;
  text-transform: uppercase;
}
`;
    return res.status(200).send(css);
  } else {
    // For unknown domains, show all headers and footers (but respect demo field)
    const css = `
/* Default styling - Nothing to do as the non-demo components are displayed and the demo ones have the hidden class already */
`;
    return res.status(200).send(css);
  }
};

export default domainStylesheetApi;
