// CUSTOMIZATION (whole file) - For codegen setup
import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const graphQLEndpoint = process.env.CODEGEN_GRAPH_QL_ENDPOINT || '';
const sitecoreApiKey = process.env.CODEGEN_SITECORE_API_KEY || '';

if (!sitecoreApiKey) {
  console.warn(
    'Warning: CODEGEN_SITECORE_API_KEY environment variable is not set. GraphQL codegen may fail.'
  );
}

if (!graphQLEndpoint) {
  console.warn(
    'Warning: CODEGEN_GRAPH_QL_ENDPOINT environment variable is not set. GraphQL codegen may fail.'
  );
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [graphQLEndpoint]: {
        headers: {
          sc_apikey: sitecoreApiKey,
        },
      },
    },
  ],

  documents: 'src/**/*.graphql',
  generates: {
    'src/graphql/generated/graphql-documents.ts': {
      plugins: ['typescript-document-nodes'],
      config: {
        dedupeFragments: true,
        preResolveTypes: true,
        prettify: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
