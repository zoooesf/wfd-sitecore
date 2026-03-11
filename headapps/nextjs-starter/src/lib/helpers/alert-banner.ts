import { getGraphQlClient } from 'lib/graphql-client';
import { GetAlertBanner } from 'graphql/generated/graphql-documents';

export const getAlertBanner = async (datasource: string, language: string, fieldName: string) => {
  const graphQLClient = getGraphQlClient();

  const data = await graphQLClient.request(GetAlertBanner.loc?.source.body || '', {
    datasource,
    language,
    fieldName,
  });

  return {
    data: data,
  };
};

export default getAlertBanner;
