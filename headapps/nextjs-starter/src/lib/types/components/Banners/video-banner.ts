import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BackgroundImageProps } from 'lib/hooks/useBackgroundImage';

type VideoBannerFields = BackgroundImageProps & {
  backgroundVideo: ImageField;
  heading: Field<string>;
};

export type VideoBannerProps = ComponentProps & {
  fields: VideoBannerFields;
};
