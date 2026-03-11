import {
  imageArgTypes,
  linkArgTypes,
  excludeLinkArgs,
  textFieldArgTypes,
  simpleArgType,
  pageArgTypes,
  excludeLayoutDataArgs,
} from '../../src/lib/helpers/storybook/arg-types';
import { InputType } from 'storybook/internal/types';

// Constants for reusable values
const PADDING_VALUES = ['none', 'sm', 'md', 'lg', 'xl'];

// Helper function to generate padding items
const generatePaddingItems = (direction: 'Top' | 'Bottom') =>
  PADDING_VALUES.map((value) => ({
    value: `${direction.toLowerCase()}-${value}`,
    title: `${direction} - ${value === 'none' ? 'None' : value.toUpperCase()}`,
  }));

const iconArgTypes = {
  'fields.imageIcon': {
    name: 'Icon',
    type: 'select' as string,
    options: [
      'calendar-days',
      'droplet',
      'eye',
      'icons',
      'fish',
      'facebook',
      'twitter',
      'instagram',
      'linkedin',
      'youtube',
      'linkedin-in',
      'x-twitter',
      'envelope',
    ],
    if: { arg: 'fields.imageIcon', exists: true },
  } as InputType,
};

const breadcrumbArgTypes = {
  'route.fields.heading.value': {
    name: 'Current Page Heading',
    if: { arg: 'route.fields.heading.value', exists: true },
  },
  'pathList.displayName': {
    name: 'Page #2 Name',
    if: { arg: 'pathList.displayName', exists: true },
  },
  'pathList.parent.displayName': {
    name: 'Page #1 Name',
    if: { arg: 'pathList.parent.displayName', exists: true },
  },
};

export const argTypes = {
  ...pageArgTypes(),
  // Text Fields
  ...textFieldArgTypes(),
  ...textFieldArgTypes('subheading', 'Subheading'),
  ...textFieldArgTypes('badge', 'Badge'),
  ...textFieldArgTypes('body', 'Body'),
  // Links
  ...linkArgTypes(),
  ...linkArgTypes('link2', 'Link 2'),
  ...linkArgTypes('secondaryLink', 'Secondary Link'),
  // Simple Args
  ...simpleArgType('Search Link URL', 'fields.searchLink.value.href'),
  ...simpleArgType('Icon', 'fields.imageIcon.value'),
  ...simpleArgType('Feedback', 'fields.feedback.value'),
  ...simpleArgType('Name', 'fields.contentName.value'),
  ...simpleArgType('Role', 'fields.role.value'),
  ...simpleArgType('Rating', 'fields.rating.value'),
  ...simpleArgType('Rating', 'fields.rating.displayName'),
  ...simpleArgType('Path', 'rendering.path'),
  // Images
  ...imageArgTypes(),
  ...imageArgTypes('backgroundImage', 'Background Image'),
  ...imageArgTypes('imageMobile', 'Image Mobile'),
  ...imageArgTypes('backgroundImageMobile', 'Background Image Mobile'),
  // Icons
  ...iconArgTypes,
  // Breadcrumbs
  ...breadcrumbArgTypes,
};

export const excludeArgs = [
  'params',
  'variant',
  'page',
  'fields',
  'rendering.uid',
  'rendering.data',
  'rendering.componentName',
  'rendering.dataSource',
  'rendering.data.item.links.results',
  'rendering.data.item.id',
  'rendering.data.item.name',
  'rendering.data.item.children.results',
  'rendering.data.item.parent.children.results',
  'rendering.data.item.parent.name',
  'rendering.data.item.parent.id',
  'rendering.data.item.displayName',
  'rendering.data.item.url.path',
  'rendering.data.item.parent.url.path',
  'rendering.placeholders.cardgrid-1',
  'rendering.placeholders.buttons-1',
  'rendering.placeholders.accordion-1',
  'rendering.placeholders.cardcarousel-1',
  'rendering.placeholders.featuredevents-1',
  'rendering.placeholders.iconfeaturecardgrid-1',
  'fields.image.value.alt',
  'fields.searchLink.value.text',
  'fields.backgroundImage.value.src',
  'fields.backgroundImage.value.alt',
  'fields.backgroundImageMobile.value.src',
  'fields.backgroundImageMobile.value.alt',
  'fields.videoUrl.value',
  'rendering.placeholders.spotlightbanner-1',
  'rendering.placeholders.sidenav-1',
  'params.Styles',
  'params.CacheClearingBehavior',
  'params.DynamicPlaceholderId',
  'params.GridParameters',
  'fields.navigationGroups',
  'params.FieldNames',
  'params.name',
  'params.styles',
  ...excludeLinkArgs(),
  ...excludeLinkArgs('link2'),
  ...excludeLinkArgs('searchLink'),
  ...excludeLinkArgs('secondaryLink'),
  ...excludeLayoutDataArgs(),
];

export const globalTypes = {
  theme: {
    description: 'Theme',
    defaultValue: '',
    toolbar: {
      title: 'Theme',
      icon: 'mirror',
      items: [
        { value: '', title: 'Not set' },
        { value: 'primary', title: 'Primary' },
        { value: 'secondary', title: 'Secondary' },
        { value: 'tertiary', title: 'Tertiary' },
      ],
      dynamicTitle: true,
    },
  },
  paddingTop: {
    description: 'Top Padding',
    defaultValue: 'top-md',
    toolbar: {
      title: 'Top Padding',
      icon: 'ruler',
      items: generatePaddingItems('Top'),
      dynamicTitle: true,
    },
  },
  paddingBottom: {
    description: 'Bottom Padding',
    defaultValue: 'bottom-md',
    toolbar: {
      title: 'Bottom Padding',
      icon: 'ruler',
      items: generatePaddingItems('Bottom'),
      dynamicTitle: true,
    },
  },
  pageEditing: {
    name: 'Edit Mode',
    description: 'Global toggle for edit mode',
    defaultValue: false,
    toolbar: {
      icon: 'edit',
      items: [
        { value: true, title: 'Enabled' },
        { value: false, title: 'Disabled' },
      ],
      dynamicTitle: true,
    },
  },
};
