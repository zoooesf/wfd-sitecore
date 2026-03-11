import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ImageProps } from 'lib/hooks/useImage';

type SplitBannerFields = ImageProps & {
  heading: Field<string>;
  subheading?: Field<string>;
  body?: Field<string>;
  link?: LinkField;
};

export type SplitBannerProps = ComponentProps & {
  fields: SplitBannerFields;
  variant?: string;
};
