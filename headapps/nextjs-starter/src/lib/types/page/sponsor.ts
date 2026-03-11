import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export type SponsorType = {
  fields: {
    contentName: Field<string>;
    logo?: ImageField;
    link?: LinkField;
  };
};
