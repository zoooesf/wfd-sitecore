// CUSTOMIZATION (whole file): Reusable GraphQL client
import {
  createGraphQLClientFactory,
  GraphQLRequestClient,
} from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

const factory = createGraphQLClientFactory({
  api: scConfig.api,
  retries: scConfig.retries.count,
  retryStrategy: scConfig.retries.retryStrategy,
});

export const getGraphQlClient = (): GraphQLRequestClient => {
  return factory();
};

export const getGraphQlKey = (): string => {
  return scConfig.api.edge.contextId;
};
