// -------------------------------------------------------------------------------------------------
// #region --- ARG TYPES AND EXCLUDES ---
// Helper functions for generating Storybook ArgTypes configurations
// These functions create controls for common field types like links, text fields, and images
// -------------------------------------------------------------------------------------------------
export const simpleArgType = (name: string, fieldName: string) => {
  return {
    [fieldName]: {
      name,
      if: { arg: fieldName, exists: true },
    },
  };
};

export const linkArgTypes = (fieldName = 'link', name = 'Link') => {
  return {
    [`fields.${fieldName}.value.text`]: {
      name: `${name} Text`,
      if: { arg: `fields.${fieldName}.value.text`, exists: true },
    },
    [`fields.${fieldName}.value.href`]: {
      name: `${name} URL`,
      if: { arg: `fields.${fieldName}.value.text`, exists: true },
    },
  };
};

export const textFieldArgTypes = (fieldName = 'heading', name = 'Heading') => {
  return {
    [`fields.${fieldName}.value`]: {
      name: name,
      if: { arg: `fields.${fieldName}.value`, exists: true },
    },
  };
};

export const imageArgTypes = (fieldName = 'image', name = 'Image') => {
  return {
    [`fields.${fieldName}.value.src`]: {
      name: `${name} URL`,
      if: { arg: `fields.${fieldName}.value.src`, exists: true },
    },
    [`fields.${fieldName}.value.alt`]: {
      name: `${name} Alt`,
      if: { arg: `fields.${fieldName}.value.alt`, exists: true },
    },
  };
};

export const pageArgTypes = () => {
  return {
    'layoutData.sitecore.route.fields.body.value': {
      name: 'Body',
      if: { arg: 'layoutData.sitecore.route.fields.body.value', exists: true },
    },
    'layoutData.sitecore.route.fields.heading.value': {
      name: 'Heading',
      if: { arg: 'layoutData.sitecore.route.fields.heading.value', exists: true },
    },
    'layoutData.sitecore.route.fields.subheading.value': {
      name: 'Heading',
      if: { arg: 'layoutData.sitecore.route.fields.subheading.value', exists: true },
    },
    'layoutData.sitecore.route.fields.startDate.value': {
      name: 'Start Date',
      if: { arg: 'layoutData.sitecore.route.fields.startDate.value', exists: true },
    },
    'layoutData.sitecore.route.fields.endDate.value': {
      name: 'End Date',
      if: { arg: 'layoutData.sitecore.route.fields.endDate.value', exists: true },
    },
    'layoutData.sitecore.route.fields.time.value': {
      name: 'Time',
      if: { arg: 'layoutData.sitecore.route.fields.time.value', exists: true },
    },
    'layoutData.sitecore.route.fields.datePublished.value': {
      name: 'Date Published',
      if: { arg: 'layoutData.sitecore.route.fields.datePublished.value', exists: true },
    },
    'layoutData.sitecore.route.fields.lastUpdated.value': {
      name: 'Last Updated',
      if: { arg: 'layoutData.sitecore.route.fields.lastUpdated.value', exists: true },
    },
    'layoutData.sitecore.route.fields.location.value': {
      name: 'Location',
      if: { arg: 'layoutData.sitecore.route.fields.location.value', exists: true },
    },
    'layoutData.sitecore.route.fields.eventLinkTitle.value': {
      name: 'Event Link Title',
      if: { arg: 'layoutData.sitecore.route.fields.eventLinkTitle.value', exists: true },
    },
    'layoutData.sitecore.route.fields.eventLink.value.href': {
      name: 'Event Link URL',
      if: { arg: 'layoutData.sitecore.route.fields.eventLink.value.href', exists: true },
    },
    'layoutData.sitecore.route.fields.eventLink.value.text': {
      name: 'Event Link Button Text',
      if: { arg: 'layoutData.sitecore.route.fields.eventLink.value.text', exists: true },
    },
    'layoutData.sitecore.route.fields.profiles': {
      name: 'Profiles',
      if: { arg: 'layoutData.sitecore.route.fields.profiles', exists: true },
    },
    'layoutData.sitecore.route.fields.sponsors': {
      name: 'Profiles',
      if: { arg: 'layoutData.sitecore.route.fields.sponsors', exists: true },
    },
  };
};

export const stringArgTypes = (fieldName = 'heading', name = 'Heading') => {
  return {
    [fieldName]: {
      name: name,
      if: { arg: fieldName, exists: true },
    },
  };
};

export const excludeLinkArgs = (fieldName = 'link') => {
  return [
    `fields.${fieldName}.value.class`,
    `fields.${fieldName}.value.id`,
    `fields.${fieldName}.value.url`,
    `fields.${fieldName}.value.querystring`,
    `fields.${fieldName}.value.target`,
    `fields.${fieldName}.value.anchor`,
    `fields.${fieldName}.value.title`,
    // Can be added back
    `fields.${fieldName}.value.linktype`,
  ];
};

export const excludeLayoutDataArgs = () => {
  return [
    'layoutData.sitecore.context.pageEditing',
    'layoutData.sitecore.context.site.name',
    'layoutData.sitecore.context.language',
    'layoutData.sitecore.context.itemPath',
    'layoutData.sitecore.context.variantId',
    'layoutData.sitecore.route.name',
    'layoutData.sitecore.route.displayName',
    'layoutData.sitecore.route.deviceId',
    'layoutData.sitecore.route.itemId',
    'layoutData.sitecore.route.fields.pageType.displayName',
    'layoutData.sitecore.route.fields.pageType.fields.Value.value',
    'layoutData.sitecore.route.fields.NavigationFilter',
    'layoutData.sitecore.route.databaseName',
    'layoutData.sitecore.route.itemLanguage',
    'layoutData.sitecore.route.itemVersion',
    'layoutData.sitecore.route.layoutId',
    'layoutData.sitecore.route.templateId',
    'layoutData.sitecore.route.templateName',
    'layoutData.sitecore.route.fields.Content.value',
    'layoutData.sitecore.route.fields.pageTitle.value',
    'layoutData.sitecore.route.fields.pageType.name',
    'layoutData.sitecore.route.fields.MetaTitle.value',
    'layoutData.sitecore.route.placeholders.headless-footer',
    'layoutData.sitecore.route.placeholders.headless-header',
    'layoutData.sitecore.route.placeholders.headless-main',
  ];
};
