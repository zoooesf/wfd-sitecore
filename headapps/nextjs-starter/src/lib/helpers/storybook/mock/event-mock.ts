import { imageFieldArgs, stringFieldArgs } from './field-mock';
import { linkFieldArgs } from './field-mock';
import { paramsArgs } from './field-mock';
import { mockPageCategoryGQL } from './page-category-mock';

export const mockEvent = {
  uid: 'f9688fec-251f-4fff-8a31-f9871bf5c904',
  componentName: 'EventCard',
  dataSource: 'e1eeb985-0172-4b52-8ab2-6c0db1265e24',
  params: paramsArgs('18'),
  data: {},
  fields: {
    startDate: stringFieldArgs('2024-12-31'),
    location: stringFieldArgs('Calgary'),
    pageCategory: mockPageCategoryGQL('Annual'),
    endDate: stringFieldArgs('2025-01-01'),
    datePublished: stringFieldArgs('2024-11-18T00:00:00Z'),
    lastUpdated: stringFieldArgs('2024-11-18T00:00:00Z'),
    profiles: [],
    eventLinkTitle: stringFieldArgs(''),
    eventLink: linkFieldArgs(),
    heading: stringFieldArgs('New Year'),
    subheading: stringFieldArgs(''),
    image: imageFieldArgs(700, 800),
    mobileImage: imageFieldArgs(300, 400),
    body: stringFieldArgs(''),
    sponsors: [],
    time: stringFieldArgs('10:00 AM - 11:00 AM'),
  },
  path: '/',
};
