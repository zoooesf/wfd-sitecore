import { CustomField, ItemUrl } from '../fields';
import { CommonPageRouteFieldsType } from './page';
import { DateGQLType } from '../graphql';
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ProfileType } from './profile';
import { SponsorType } from './sponsor';
import { PageCategoryField } from 'lib/helpers/page-category';
import { LocationField } from 'lib/helpers/location';
import { TagItem } from 'lib/helpers/merge-page-tags';
import { ImageGQLType } from '../graphql';

export type EventType = {
  displayName: string;
  fields: EventRouteFieldsType;
  id: string;
  name: string;
  url: string;
};

type CommonEventFieldsType = {
  heading?: {
    jsonValue: Field<string>;
  };
  subheading?: {
    jsonValue: Field<string>;
  };
  body?: CustomField;
  location?: LocationField;
  profiles?: ProfileType[];
  eventLinkTitle?: Field<string>;
  eventLink?: LinkField;
};

export type EventRouteFieldsType = CommonEventFieldsType & {
  startDate?: CustomField;
  endDate?: CustomField;
  pageCategory?: PageCategoryField;
  eventTime?: Field<string>;
  eventCost?: Field<string>;
  sponsors?: SponsorType[];
} & CommonPageRouteFieldsType;

type EventGQLType =
  | DateGQLType
  | PageCategoryField
  | LocationField
  | CustomField
  | ItemUrl
  | SponsorType[]
  | ProfileType[]
  | Field<string>
  | LinkField
  | ImageGQLType
  | { targetItems?: TagItem[] };

export type EventDataType =
  | (CommonEventFieldsType & {
      [key: string]: EventGQLType | undefined;
      startDate?: DateGQLType;
      endDate?: DateGQLType;
      pageCategory?: PageCategoryField;
      location?: LocationField;
      eventTime?: Field<string>;
      eventCost?: Field<string>;
      url?: ItemUrl;
      sxaTags?: { targetItems?: TagItem[] };
      image?: ImageGQLType;
      imageMobile?: ImageGQLType;
    })
  | null;
