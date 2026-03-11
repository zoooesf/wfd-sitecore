import { ComponentProps } from 'lib/component-props';
import { TagType } from 'lib/types/page/metadata';

export type ProductResourcesFields = {
  productResources?: Array<{
    name?: string;
    url?: string;
    fields?: { SxaTags?: TagType[] };
  }>;
};

export type ProductResourcesProps = ComponentProps & {
  fields?: ProductResourcesFields;
};

export type ProductResourcesCardProps = {
  fields?: { name?: string; url?: string; fields?: { SxaTags?: TagType[] } };
  effectiveTheme?: string;
};
