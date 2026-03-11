import Head from 'next/head';
import { EventRouteFieldsType } from 'lib/types';
import { getLocationData, getPageCategories, normalizeDateTimeFieldValue } from 'lib/helpers';

export const EventMetadata: React.FC<EventMetadataProps> = ({ routeFields }) => {
  const { startDate, endDate, pageCategory, profiles, location, sponsors, eventTime } = routeFields;

  const eventStartDate = normalizeDateTimeFieldValue(startDate?.value);
  const eventEndDate = normalizeDateTimeFieldValue(endDate?.value);
  const eventTimeValue = eventTime?.value || '';
  const categoryData = getPageCategories(pageCategory);
  const categoryText = Array.isArray(categoryData)
    ? categoryData
        .map((item) => item.fields?.pageCategory?.value)
        .filter(Boolean)
        .join(', ')
    : '';
  const profileText = Array.isArray(profiles)
    ? profiles
        .map((profile) =>
          (profile?.fields?.firstName?.value + ' ' + profile?.fields?.lastName?.value).trim()
        )
        .join(', ')
    : '';
  const sponsorsInfo = Array.isArray(sponsors)
    ? sponsors.map((sponsors) => sponsors?.fields?.contentName?.value).join(', ')
    : '';
  const locationData = getLocationData(location);
  const locationText = locationData
    ?.map((location) => location?.fields?.contentName?.value)
    .join(', ');

  return (
    <Head>
      {eventStartDate && <meta property="event:eventStartDate" content={eventStartDate} />}
      {eventEndDate && <meta property="event:eventEndDate" content={eventEndDate} />}
      <meta property="event:eventTime" content={eventTimeValue} />
      {categoryText && <meta property="event:category" content={categoryText} />}
      {profileText && <meta property="event:profiles" content={profileText} />}
      {sponsorsInfo && <meta property="event:sponsors" content={sponsorsInfo} />}
      {locationText && <meta property="event:location" content={locationText} />}
    </Head>
  );
};

type EventMetadataProps = {
  routeFields: EventRouteFieldsType;
};
