import { ComponentRendering, RichTextField } from '@sitecore-content-sdk/nextjs';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { PageDataType } from 'lib/types';

type SelectedPageFields = {
  OpenGraphSiteName?: Field<string>;
  OpenGraphAdmins?: Field<string>;
  OpenGraphAppId?: Field<string>;
  OpenGraphDescription?: Field<string>;
  OpenGraphImageUrl?: Field<{
    src: string;
    alt: string;
    width: string;
    height: string;
  }>;
  OpenGraphTitle?: Field<string>;
  OpenGraphType?: Field<string>;
  TwitterImage?: Field<Record<string, unknown>>;
  TwitterDescription?: Field<string>;
  TwitterTitle?: Field<string>;
  TwitterCardType?: {
    id: string;
    url: string;
    name: string;
    displayName: string;
    fields: {
      Value: Field<string>;
    };
  };
  TwitterSite?: Field<string>;
  NavigationClass?: null;
  NavigationTitle?: Field<string>;
  NavigationFilter?: unknown[];
  SxaTags?: unknown[];
  'Page Design'?: null;
  heading?: Field<string>;
  subheading?: Field<string>;
  image?: Field<Record<string, unknown>>;
  imageMobile?: Field<Record<string, unknown>>;
  datePublished?: Field<string>;
  lastUpdated?: Field<string>;
  pageRequiresAuth?: Field<boolean>;
};

export type SelectedPage = {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: SelectedPageFields;
};

type SimplePageListingFields = {
  heading: Field<string>;
  selectedPage: SelectedPage;
  filterByTags: Field<boolean>;
  tagsHeading: Field<string>;
  noResultsText: Field<string>;
  PageSizeCount?: Field<number>;
};

export type SimplePageListingProps = ComponentProps & {
  rendering: ComponentRendering & {
    data: PageDataType[];
  };
  fields: SimplePageListingFields;
};
type RecipePageListingFields = {
  title?: Field<string>;
  prepTime?: Field<string>;
  cookTime?: Field<string>;
  servings?: Field<string>;
  ingredients?: RichTextField;
  instructions?: RichTextField;
  image?: Field<Record<string, unknown>>;
  selectedPage?: SelectedPage;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  PageSizeCount?: Field<number>;
};

export type RecipePageListingProps = ComponentProps & {
  rendering: ComponentRendering & {
    data: PageDataType[];
  };
  fields: RecipePageListingFields;
};
