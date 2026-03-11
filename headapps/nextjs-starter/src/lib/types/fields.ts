import { ComponentParams, Field, ImageField, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { LinkGQLType } from './graphql';
import { ThemeType } from './theme';

export type LinkFieldProps = {
  link: LinkField;
};

export type LinkGQLProps = {
  link: LinkGQLType;
  displayName?: string;
};

export type ClassNameProps = {
  className?: string;
};

export type CustomField = {
  value?: string; // Compatible with JSS Text and RichText components
};

export type QueryField = {
  jsonValue: CustomField;
};

export type URLField = {
  path: string;
};
export type ItemUrl = {
  hostName?: string;
  path: string;
  scheme?: string;
  siteName?: string;
  url: string;
};

export type AssetFieldType = {
  fullpath: string;
  filename: string;
  title: string;
};

export type ComponentParameters = ComponentParams & {
  _topPadding?: string;
  _bottomPadding?: string;
  _theme?: ThemeType;
};

export type LocationType = {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    contentName: Field<string>;
  };
};

export type RecipeFields = {
  title?: Field<string>;
  description?: RichTextField;
  image?: ImageField;
  prepTime?: Field<string>;
  cookTime?: Field<string>;
  ingredients?: RichTextField;
  instructions?: RichTextField;
  tag?: Field<string>;
  servings?: Field<string>;
};