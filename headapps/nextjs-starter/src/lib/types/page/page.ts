import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { ItemUrl, QueryField, URLField } from '../fields';
import { ImageProps } from 'lib/hooks/useImage';
import { ImageGQLType } from '../graphql';
import { TagType } from './metadata';
import { PageCategoryField } from 'lib/helpers/page-category';
import { LocationField } from 'lib/helpers/location';
import { TagItem } from 'lib/helpers/merge-page-tags';

export type CommonPageRouteFieldsType = ImageProps & {
  heading?: Field<string>;
  subheading?: Field<string>;
  image?: ImageField;
  datePublished?: Field<string>;
  lastUpdated?: Field<string>;
  SxaTags?: TagType[];
};

export type CommonPageRouteMetaDataFieldsType = {
  fields: {
    heading?: Field<string>;
    subheading?: Field<string>;
    image?: ImageField;
    imageMobile?: ImageField;
    datePublished?: Field<string>;
    lastUpdated?: Field<string>;
    location?: LocationField;
  };
};

type PageGQLDataType =
  | QueryField
  | string
  | ImageGQLType
  | URLField
  | ItemUrl
  | undefined
  | PageCategoryField
  | LocationField
  | { targetItems?: TagItem[] }
  | TagItem[];

export type PageDataType = {
  id: string;
  name: string;
  [key: string]: PageGQLDataType;
  heading?: QueryField;
  summaryImage?: QueryField;
  image: ImageGQLType;
  url: ItemUrl;
  pageCategory?: PageCategoryField;
  sxaTags?: { targetItems?: TagItem[] };
} | null;
