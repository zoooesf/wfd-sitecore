import { JSX } from 'react';
import { GetComponentServerProps, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { getEventListingWithDetails } from 'lib/helpers/listing/event-listing';
import EventListingRendering from 'component-children/Events/EventListing/EventListing';
import { EventListingProps } from 'lib/types/components/Events/event-listing';
import { getLayoutLanguage } from 'lib/helpers/language';
import { contentRootIdNullChecker, fetchSiteRootInfo, getSiteName } from 'lib/helpers';

const EventListingDefault = (props: EventListingProps): JSX.Element => {
  return (
    <Frame params={props.params}>
      <EventListingRendering {...props} />
    </Frame>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  // Get the language from the layout data
  const language = getLayoutLanguage(layoutData);
  const siteName = getSiteName(layoutData);
  const { contentRoot } = await fetchSiteRootInfo(siteName, language);

  // Fetch event data with our new two-step approach
  const eventListingData = await getEventListingWithDetails(
    contentRootIdNullChecker(contentRoot?.id),
    language
  );

  return {
    rendering: { ...rendering, data: eventListingData.results },
    route: layoutData?.sitecore?.route,
  };
};

export const Default = withDatasourceCheck()<EventListingProps>(EventListingDefault);
