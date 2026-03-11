import { JSX } from 'react';
import {
  ComponentRendering,
  GetComponentServerProps,
  LayoutServiceData,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import RecipePageListingRendering from 'component-children/Page Content/RecipePageListing/RecipePageListing';
export type { RecipeCardVariant } from 'component-children/Page Content/RecipePageListing/RecipePageListing';
import {
  RecipePageListingProps,
  SelectedPage,
} from 'lib/types/components/Page Content/simple-page-listing';
import Frame from 'component-children/Shared/Frame/Frame';
import { getLayoutLanguage } from 'lib/helpers';
import { getRecipeListingWithDetails } from 'lib/helpers/listing/recipe-listing';
import { RECIPE_PAGE_TEMPLATE_ID } from 'lib/graphql/id';

const RecipePageListingDefault = (props: RecipePageListingProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <RecipePageListingRendering {...props} />
    </Frame>
  );
};

const RecipePageListingImageLeft = (props: RecipePageListingProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <RecipePageListingRendering {...props} cardVariant="imageLeft" />
    </Frame>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (
  rendering: ComponentRendering & {
    fields?: {
      selectedPage?: SelectedPage;
    };
  },
  layoutData: LayoutServiceData
) => {
  const pageID = rendering.fields?.selectedPage?.id ?? layoutData?.sitecore?.route?.itemId ?? '';
  const language = getLayoutLanguage(layoutData);

  const recipeListingData = await getRecipeListingWithDetails(
    pageID,
    language,
    RECIPE_PAGE_TEMPLATE_ID,
    undefined,
    10
  );

  return {
    rendering: {
      ...rendering,
      data: recipeListingData.results,
    },
    route: layoutData?.sitecore?.route,
  };
};

export const Default = withDatasourceCheck()<RecipePageListingProps>(RecipePageListingDefault);
export const ImageLeft = withDatasourceCheck()<RecipePageListingProps>(RecipePageListingImageLeft);
