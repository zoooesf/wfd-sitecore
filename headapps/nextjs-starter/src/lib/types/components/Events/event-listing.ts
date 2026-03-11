import { ComponentProps } from 'lib/component-props';
import { Field, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { EventDataType } from 'lib/types';

type EventListingFields = {
  heading: Field<string>;
  filterByTags?: Field<boolean>;
  tagsHeading?: Field<string>;
  noResultsText?: Field<string>;
  PageSizeCount?: Field<number>;
};

type EventListingRenderingType = {
  rendering: ComponentRendering & {
    data: EventDataType[];
  };
};

export type EventListingProps = ComponentProps &
  EventListingRenderingType & {
    fields: EventListingFields;
  };
