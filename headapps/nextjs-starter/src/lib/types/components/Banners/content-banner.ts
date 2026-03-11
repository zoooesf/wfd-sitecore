import { Field } from '@sitecore-content-sdk/nextjs';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';
import { ComponentProps } from 'lib/component-props';

type ContentBannerFields = BackgroundImageProps & {
  heading: Field<string>;
  body?: Field<string>;
};

export type ContentBannerProps = ComponentProps & {
  fields: ContentBannerFields;
};
