import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type ProductTechSpecsFields = {
  productTechnicalSpecs?: Field<string>;
};

export type ProductTechSpecsProps = ComponentProps & {
  fields: ProductTechSpecsFields;
};
