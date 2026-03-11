import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Link,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { EventRouteFieldsType } from 'lib/types';
import { getItemPath, ItemPathReturnType } from 'lib/helpers/item-path';
import { EventCardDateBlock } from 'component-children/Shared/Event/EventCardDateBlock';
import { EventCardHeader } from 'component-children/Shared/Event/EventCardHeader';
import { EventCardDetails } from 'component-children/Shared/Event/EventCardDetails';
import { pageEditCheck } from 'lib/helpers';
import { ComponentProps } from 'lib/component-props';
import { getLayoutLanguage } from 'lib/helpers';
import { getPageCategories } from 'lib/helpers/page-category';
import { getLocationData } from 'lib/helpers/location';

const EventCardDefault: React.FC<EventCardProps & EventCardFields> = (props) => {
  const { path } = props?.rendering;
  const { page } = useSitecore();

  return pageEditCheck(
    page,
    <div className="flex w-full flex-grow items-start justify-start gap-3 bg-white p-4">
      <EventCardContent {...props} />
    </div>,
    path,
    <Link
      field={{
        value: {
          href: path || '',
          target: '_self',
        },
      }}
      className="flex w-full flex-grow items-start justify-start gap-3 bg-white p-4"
    >
      <EventCardContent {...props} />
    </Link>
  );
};

const EventCardContent: React.FC<EventCardProps & EventCardFields> = (props) => {
  const { fields } = props;
  const categoryData = getPageCategories(fields?.pageCategory);
  const category = categoryData?.[0]?.fields?.pageCategory;
  const locationData = getLocationData(fields?.location);
  const locations = locationData?.map((item) => item?.fields?.contentName?.value).filter(Boolean);
  const eventTime = fields?.eventTime?.value;

  return (
    <>
      <EventCardDateBlock dateTime={fields?.startDate?.value} className="hidden lg:flex" />
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="mb-4 flex flex-row items-start justify-start gap-2">
          <EventCardDateBlock dateTime={fields?.startDate?.value} className="flex lg:hidden" />
          <EventCardHeader heading={fields?.heading} category={category} />
        </div>
        <EventCardDetails
          startDate={fields?.startDate?.value}
          endDate={fields?.endDate?.value}
          location={locations}
          time={eventTime}
        />
      </div>
    </>
  );
};

type EventCardProps = {
  fields?: EventRouteFieldsType;
  rendering: ComponentRendering & {
    path?: string;
  };
} & ComponentProps;

type EventCardFields = {
  fields: {
    dateLabel?: Field<string>;
    timeLabel?: Field<string>;
    locationLabel?: Field<string>;
  };
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const language = getLayoutLanguage(layoutData);
  try {
    const itemPath = await getItemPath(rendering?.dataSource as string, language);
    return {
      rendering: { ...rendering, path: (itemPath as ItemPathReturnType)?.item?.url?.path },
    };
  } catch (error) {
    console.error('Error fetching item path:', error);
    return {
      rendering: { ...rendering, data: [] },
      route: layoutData?.sitecore?.route,
    };
  }
};

export const Default = withDatasourceCheck()<EventCardProps & EventCardFields>(EventCardDefault);
