import { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ImageProps } from 'lib/hooks/useImage';
import { TagType } from 'lib/types/page/metadata';

export type ProductHeaderFields = ImageProps & {
  productName: Field<string>;
  productDescription?: RichTextField;
  link?: LinkField;
  link2?: LinkField;
  productSubheading?: Field<string>;
  productSku?: Field<string>;
  SxaTags?: TagType[];
};

export type ProductHeaderProps = ComponentProps & {
  fields: ProductHeaderFields;
};
