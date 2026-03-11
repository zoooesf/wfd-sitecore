import { JSX } from 'react';
import {
  ComponentRendering,
  GetComponentServerProps,
  LayoutServiceData,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import SimplePageListingRendering from 'component-children/Page Content/SimplePageListing/SimplePageListing';
import {
  SimplePageListingProps,
  SelectedPage,
} from 'lib/types/components/Page Content/simple-page-listing';
import Frame from 'component-children/Shared/Frame/Frame';
import { getLayoutLanguage } from 'lib/helpers';
import { getPageListingWithDetails } from 'lib/helpers/listing/page-listing';
import { LANDING_PAGE_TEMPLATE_ID } from 'lib/graphql/id';

const SimplePageListingDefault = (props: SimplePageListingProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <SimplePageListingRendering {...props} />
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
  // Fetch page data with the two-step approach
  const pageListingData = await getPageListingWithDetails(
    pageID,
    language,
    LANDING_PAGE_TEMPLATE_ID,
    undefined, // initialEndCursor
    10 // first
  );

  return {
    rendering: {
      ...rendering,
      data: pageListingData.results,
    },
    route: layoutData?.sitecore?.route,
  };
};

export const Default = withDatasourceCheck()<SimplePageListingProps>(SimplePageListingDefault);
