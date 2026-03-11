import type React from 'react';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import { Field, LinkField, RichTextField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { ImageProps } from 'lib/hooks/useImage';
import RecipePreviewCard, { RecipeCardImageLeft } from 'component-children/Cards/RecipePreviewCard/RecipePreviewCard';
import { RecipeFields } from 'lib/types';
import { RecipePageDataType } from 'lib/helpers/listing/recipe-listing';
import { ImageGQLType } from 'lib/types/graphql';
import type { QueryField } from 'lib/types/fields';

/**
 * Maps datasource CardFields to the RecipePageDataType shape expected by the card sub-component.
 * @param {RecipeCardFields} fields - The datasource fields from the Sitecore component
 * @returns {RecipePageDataType} The mapped page data for rendering
 */
function mapFieldsToPage(fields: RecipeCardFields): RecipePageDataType {
  return {
    id: '',
    name: fields.heading?.value || '',
    image: {
      src: fields.image?.value?.src || '',
      alt: fields.image?.value?.alt || '',
      jsonValue: fields.image,
    } as ImageGQLType,
    imageMobile: { jsonValue: fields.imageMobile } as unknown as { jsonValue: ImageField },
    url: {
      path: fields.link?.value?.href || '',
      url: fields.link?.value?.href || '',
    },
    heading: { jsonValue: { value: fields.heading?.value } } as QueryField,
    title: { jsonValue: fields.title } as { jsonValue: Field<string> },
    prepTime: { jsonValue: fields.prepTime } as { jsonValue: Field<string> },
    cookTime: { jsonValue: fields.cookTime } as { jsonValue: Field<string> },
  } as RecipePageDataType;
}

const CardDefault: React.FC<RecipeCardComponentProps> = (props) => {
  const { params, fields } = props;
  const page = mapFieldsToPage(fields);

  return (
    <Frame params={params} className="w-full" containerClassName="h-full">
      <RecipePreviewCard page={page} />
    </Frame>
  );
};

const CardImageLeft: React.FC<RecipeCardComponentProps> = (props) => {
  const { params, fields } = props;
  const page = mapFieldsToPage(fields);

  return (
    <Frame params={params} className="w-full" containerClassName="h-full">
      <RecipeCardImageLeft page={page} />
    </Frame>
  );
};

export type RecipeCardBadgeProps = {
  badge?: Field<string>;
};

export type RecipeCardFields = RecipeCardBadgeProps &
  ImageProps &
  RecipeFields & {
    heading: Field<string>;
    body: RichTextField;
    link: LinkField;
  };

export type RecipeCardFieldsProps = {
  fields: RecipeCardFields;
  textColor?: string;
};

export type RecipeCardComponentProps = ComponentProps & RecipeCardFieldsProps;

export const Default = withDatasourceCheck()<RecipeCardComponentProps>(CardDefault);
export const ImageLeft = withDatasourceCheck()<RecipeCardComponentProps>(CardImageLeft);
