import { CustomField, ItemUrl, URLField } from '../fields';
import { DateGQLType, ImageGQLType } from '../graphql';
import { PageCategoryField } from 'lib/helpers/page-category';

type ResourceGQLDataType =
  | CustomField
  | string
  | ImageGQLType
  | URLField
  | ItemUrl
  | undefined
  | PageCategoryField
  | DateGQLType;

export type ResourceDataType = {
  [key: string]: ResourceGQLDataType;
  id: string;
  name: string;
  image: ImageGQLType;
  datePublished: DateGQLType;
  pageCategory: PageCategoryField;
  heading?: CustomField;
  subheading?: CustomField;
  body?: CustomField;
  url: ItemUrl;
} | null;
