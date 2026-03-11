import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';

export type CardBannerFields = BackgroundImageProps & {
  heading: Field<string>;
  subheading: Field<string>;
};

export type CardBannerProps = ComponentProps & {
  fields: CardBannerFields;
};
