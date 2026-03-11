import { ItemUrl, QueryField, URLField } from '../fields';
import { DateGQLType, ImageGQLType } from '../graphql';
import { CommonPageRouteFieldsType } from './page';
import { ProfileType } from './profile';
import { PageCategoryField } from 'lib/helpers/page-category';
import { TagItem } from 'lib/helpers/merge-page-tags';
import { Field } from '@sitecore-content-sdk/nextjs';

export type ArticleRouteFieldsType = {
  pageCategory?: PageCategoryField;
  profiles?: ProfileType[];
  displayDateTime?: QueryField | Field<string>;
} & CommonPageRouteFieldsType;

type ArticleGQLDataType =
  | QueryField
  | string
  | ImageGQLType
  | URLField
  | ItemUrl
  | undefined
  | PageCategoryField
  | DateGQLType
  | TagItem[]
  | { targetItems?: TagItem[] };

export type ArticleDataType = {
  [key: string]: ArticleGQLDataType;
  id: string;
  name: string;
  image: ImageGQLType;
  datePublished: DateGQLType;
  displayDateTime?: QueryField;
  pageCategory: PageCategoryField;
  heading?: QueryField;
  subheading?: QueryField;
  body?: QueryField;
  url: ItemUrl;
  sxaTags?: { targetItems?: TagItem[] };
} | null;
