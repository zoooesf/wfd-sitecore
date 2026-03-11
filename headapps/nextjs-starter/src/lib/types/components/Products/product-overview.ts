import { RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type ProductOverviewFields = {
  productApplications?: RichTextField;
  productFeatures?: RichTextField;
  productKeyBenefits?: RichTextField;
};

export type ProductOverviewProps = ComponentProps & {
  fields: ProductOverviewFields;
};

export type ProductOverviewCardProps = {
  field?: RichTextField;
  title: string;
  cardClasses: string;
  headingClasses: string;
  richtextClasses: string;
};
