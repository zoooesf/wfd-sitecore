import { LinkGQLType } from '../graphql';

export type MegaMenuType = {
  id: string;
  active?: boolean;
  items: {
    links: LinksType | undefined;
    linkGroup: LinkGroupType | undefined;
  };
};

export type LinksType = { results: { link: LinkGQLType; displayName?: string }[] };

export type LinkGroupType = {
  results: { link: LinkGQLType; links: LinksType; displayName?: string }[];
};
