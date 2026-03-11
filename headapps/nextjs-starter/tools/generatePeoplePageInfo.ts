import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { GetPeoplePageDisplayNamePerLanguage } from 'graphql/generated/graphql-documents';
import { PeoplePageInfo, GetPeoplePageDisplayNamePerLanguageQueryResponse } from 'lib/types';
import { getGraphQlClient } from 'lib/graphql-client';

const DEFAULT_PEOPLE_PAGE_INFO_DIST_PATH = '.sitecore/people-page-info.json';

/**
 * Configuration object for generating people page info.
 */
export type GeneratePeoplePageInfoConfig = {
  /**
   * Optional path where the generated people page info will be saved.
   * If not provided, the default '.sitecore/people-page-info.json' will be used.
   */
  destinationPath?: string;
};

/**
 * Generates people page info and writes it to a specified destination path.
 * @param {GeneratePeoplePageInfoConfig} config - The configuration for generating people page info.
 * @param {SiteInfoService} config.scConfig - The Sitecore configuration used at build and run time.
 * @param {string} config.destinationPath - The optional path where the generated people page info file will be written. Defaults to '.sitecore/people-page-info.json'.
 * @returns {Promise<Function>} - A promise that resolves to an asynchronous function that fetches people page info and writes it to a file.
 */
export const generatePeoplePageInfo = ({
  destinationPath,
}: GeneratePeoplePageInfoConfig): (() => Promise<void>) => {
  return async () => {
    let peoplePageInfoPerLanguage: PeoplePageInfo[] = [];

    // Get item ID from environment variable
    const itemId = process.env.PEOPLE_PAGE_ITEM_ID;

    if (!itemId) {
      console.log(
        chalk.yellow(
          'No PEOPLE_PAGE_ITEM_ID configured. Skipping fetching people page info. Set PEOPLE_PAGE_ITEM_ID in your environment variables to enable this feature.'
        )
      );
    }

    if (itemId) {
      try {
        console.log(chalk.cyan(`Fetching People page names for ID: ${itemId}...`));

        const client = getGraphQlClient();

        peoplePageInfoPerLanguage = await fetchPeoplePageInfoPerLanguage(client, itemId);

        console.log(
          chalk.green(
            `Successfully fetched people page info in ${peoplePageInfoPerLanguage.length} languages`
          )
        );

        // Log each language version
        peoplePageInfoPerLanguage.forEach(({ language, displayName }) => {
          console.log(chalk.gray(`  - ${language}: "${displayName}"`));
        });
      } catch (error) {
        console.error(chalk.red('Error fetching people page display name per language'));
        console.error(error);
      }
    }

    const peoplePageInfoFilePath = path.resolve(
      destinationPath ?? DEFAULT_PEOPLE_PAGE_INFO_DIST_PATH
    );

    try {
      ensurePathExists(peoplePageInfoFilePath);

      fs.writeFileSync(peoplePageInfoFilePath, JSON.stringify(peoplePageInfoPerLanguage, null, 2), {
        encoding: 'utf8',
      });
    } catch (error) {
      console.error(
        chalk.red(`Error writing people page info to file at path: ${peoplePageInfoFilePath}`)
      );
      console.error(error);
    }
  };
};

const fetchPeoplePageInfoPerLanguage = async (
  client: ReturnType<typeof getGraphQlClient>,
  itemId: string
): Promise<PeoplePageInfo[]> => {
  const query = GetPeoplePageDisplayNamePerLanguage.loc?.source.body || '';

  if (!query) {
    throw new Error(
      'GetPeoplePageDisplayNamePerLanguage query not found in generated GraphQL documents'
    );
  }

  const response: GetPeoplePageDisplayNamePerLanguageQueryResponse = await client.request(query, {
    itemId,
  });

  if (!response.item) {
    throw new Error(`Item not found with ID: ${itemId}`);
  }

  return response.item.languages.map((language) => ({
    language: language.language.name,
    displayName: language.displayName,
  }));
};

const ensurePathExists = (filePath: string) => {
  const outputDir = path.dirname(filePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};
