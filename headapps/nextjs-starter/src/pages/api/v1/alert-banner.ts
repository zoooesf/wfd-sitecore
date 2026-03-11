// CUSTOMIZATION (whole file) - For Alert Banner component
import { NextApiRequest, NextApiResponse } from 'next';
import getAlertBanner from 'lib/helpers/alert-banner';
import { mainLanguage } from 'lib/i18n/i18n-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { datasourceId, language = mainLanguage } = req.query;

    // Validate required parameters
    if (!datasourceId) return res.status(400).json({ error: 'datasourceId is required' });

    const datasourceIdString = Array.isArray(datasourceId) ? datasourceId[0] : datasourceId;
    const languageString = Array.isArray(language) ? language[0] : language;

    const result = await getAlertBanner(datasourceIdString, languageString, 'SiteWideAlertBanner');

    if (!result) return res.status(404).json({ error: 'Alert banner not found' });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching alert banner:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
