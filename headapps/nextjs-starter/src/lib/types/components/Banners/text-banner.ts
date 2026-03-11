import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type TextBannerFields = {
  heading: Field<string>;
  subheading?: Field<string>;
};

export type TextBannerProps = ComponentProps & {
  fields: TextBannerFields;
};
