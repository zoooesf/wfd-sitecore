import { Field } from '@sitecore-content-sdk/nextjs';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';
import { ComponentProps } from 'lib/component-props';

export type HeroBannerFields = BackgroundImageProps & {
  heading: Field<string>;
  subheading?: Field<string>;
};

export type HeroBannerProps = ComponentProps & {
  fields: HeroBannerFields;
};
