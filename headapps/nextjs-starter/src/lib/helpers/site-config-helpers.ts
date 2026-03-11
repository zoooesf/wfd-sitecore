import { getGraphQlClient } from 'lib/graphql-client';
import { mainLanguage } from 'lib/i18n/i18n-config';
import {
  GetSiteInfoPath,
  GetSiteRootInfo,
  GetPeoplePageId,
  GetAuthConfig,
} from 'graphql/generated/graphql-documents';

type SiteInfoPathResponse = {
  site: {
    siteInfo: {
      rootPath: string;
    };
  };
};

type PeoplePageIdResponse = {
  item: {
    peoplePage: {
      targetItem: {
        id: string;
      };
    };
  };
};

type SiteRootInfoResponse = {
  layout: {
    item: {
      homeItemPath: string;
      contentRoot: {
        id: string;
        path: string;
      };
    };
  };
};

type AuthConfigResponse = {
  item: {
    accountPageLink: {
      targetItem: {
        id: string;
        url: {
          path: string;
        };
      };
    };
    signOutPageLink: {
      targetItem: {
        id: string;
        url: {
          path: string;
        };
      };
    };
  };
};

export type AuthConfig = {
  accountPageLink?: string | null;
  signOutPageLink?: string | null;
};

const fetchSiteRootPath = async (
  graphQLClient: ReturnType<typeof getGraphQlClient>,
  siteName: string
) => {
  const result = (await graphQLClient.request(GetSiteInfoPath, {
    siteName: siteName,
  })) as SiteInfoPathResponse;
  return result?.site?.siteInfo?.rootPath;
};

export const fetchSiteRootInfo = async (
  siteName: string,
  language: string,
  graphQLClient = getGraphQlClient()
) => {
  const requestedLanguageSiteRootInfo = (await graphQLClient.request(GetSiteRootInfo, {
    siteName: siteName,
    language: language,
  })) as SiteRootInfoResponse;

  if (
    requestedLanguageSiteRootInfo?.layout?.item?.homeItemPath &&
    requestedLanguageSiteRootInfo?.layout?.item?.contentRoot
  ) {
    return {
      homeItemPath: requestedLanguageSiteRootInfo.layout.item.homeItemPath,
      contentRoot: requestedLanguageSiteRootInfo.layout.item.contentRoot,
    };
  }

  const mainLanguageSiteRootInfo = (await graphQLClient.request(GetSiteRootInfo, {
    siteName: siteName,
    language: mainLanguage,
  })) as SiteRootInfoResponse;

  return {
    homeItemPath: mainLanguageSiteRootInfo?.layout?.item?.homeItemPath,
    contentRoot: mainLanguageSiteRootInfo?.layout?.item?.contentRoot,
  };
};

export const fetchPeoplePageId = async (siteName: string) => {
  const graphQLClient = getGraphQlClient();
  const siteRootPath = await fetchSiteRootPath(graphQLClient, siteName);
  if (!siteRootPath) {
    return null;
  }

  const result = (await graphQLClient.request(GetPeoplePageId, {
    siteSettingsPath: `${siteRootPath}/Settings`,
  })) as PeoplePageIdResponse;

  return result?.item?.peoplePage?.targetItem?.id;
};

export const fetchAuthConfig = async (siteName: string): Promise<AuthConfig | null> => {
  const graphQLClient = getGraphQlClient();
  const siteRootPath = await fetchSiteRootPath(graphQLClient, siteName);
  if (!siteRootPath) {
    return null;
  }

  const result = (await graphQLClient.request(GetAuthConfig, {
    siteSettingsPath: `${siteRootPath}/Settings`,
  })) as AuthConfigResponse;

  const config = {
    accountPageLink: result?.item?.accountPageLink?.targetItem?.url?.path || null,
    signOutPageLink: result?.item?.signOutPageLink?.targetItem?.url?.path || null,
  };

  return config;
};
