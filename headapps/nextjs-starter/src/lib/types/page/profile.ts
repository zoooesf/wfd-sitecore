import { Field, ImageField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { LocationType } from '../fields';
import { ImageGQLType } from '../graphql';
import { EventDataType } from './event';
import { ArticleDataType } from './article';

export type ProfileType = {
  name: string;
  displayName: string;
  fields: {
    firstName: Field<string>;
    lastName: Field<string>;
    role: Field<string>;
    email: Field<string>;
    description: RichTextField;
    image?: ImageField;
    imageMobile?: ImageField;
    location: Field<string>;
    expertise: Field<string>;
    company: Field<string>;
    website: LinkField;
    linkedInLink: LinkField;
  };
};

export type ExpertiseTag = {
  fields: {
    Title: {
      value: string;
    };
  };
};

export type AchievementItem = {
  name: string;
  displayName: string;
  description: {
    value: string;
  };
};

export type EducationItem = {
  name: string;
  displayName: string;
  description: {
    value: string;
  };
};

export type InvolvementItem = {
  name: string;
  displayName: string;
  heading: {
    value: string;
  };
  description: {
    value: string;
  };
};

export type ProfileChildrenFolder = {
  name: string;
  children: {
    results: (AchievementItem | EducationItem | InvolvementItem)[];
  };
};

export type ProfileGQL = {
  name: string;
  displayName: string;
  id: string;
  description: {
    value: string;
    jsonValue: {
      value: string;
    };
  };
  email: {
    value: string;
  };
  phone: {
    value: string;
  };
  role: {
    value: string;
  };
  image?: ImageGQLType;
  imageMobile?: ImageGQLType;
  expertise: {
    jsonValue: ExpertiseTag[];
  };
  company: {
    value: string;
  };
  firstName: {
    value: string;
  };
  lastName: {
    value: string;
  };
  location: {
    value: string;
    jsonValue: LocationType[];
  };
  website: {
    jsonValue: LinkField;
  };
  linkedInLink: {
    jsonValue: LinkField;
  };
  children?: {
    results: ProfileChildrenFolder[];
  };
  achievements?: AchievementItem[];
  education?: EducationItem[];
  involvements?: InvolvementItem[];
  events?: EventDataType[];
  articles?: ArticleDataType[];
};

export type AccordionSection = {
  id: string;
  title: { value: string };
  items?: Array<{
    heading?: { value: string };
    description?: { value: string };
  }>;
  type: string;
  events?: EventDataType[];
  articles?: ArticleDataType[];
};

export type AccordionProps = {
  sections: AccordionSection[];
  effectiveTheme: string;
};
