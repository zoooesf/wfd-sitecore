import { loremIpsumGenerator } from 'lib/helpers/lorem-ipsum-generator';
import { linkFieldArgs, linkGQLArgs, paramsArgs, stringFieldArgs } from './field-mock';
import { mockLink } from './link-mock';
import {
  Field,
  Item,
  LayoutServicePageState,
  PlaceholdersData,
  RouteData,
} from '@sitecore-content-sdk/nextjs';
import { GenericFieldValue } from '@sitecore-content-sdk/core/types/layout/models';
import { mainLanguage } from 'lib/i18n/i18n-config';

export const generateRandomLink = (index: number) => {
  const links = [
    { text: 'About Us', url: '/about' },
    { text: 'Services', url: '/services' },
    { text: 'Products', url: '/products' },
    { text: 'Article', url: '/article' },
    { text: 'Contact', url: '/contact' },
    { text: 'FAQ', url: '/faq' },
    { text: 'Support', url: '/support' },
    { text: 'Terms of Service', url: '/terms' },
    { text: 'Privacy Policy', url: '/privacy' },
    { text: 'Partnerships', url: '/partners' },
    { text: 'News', url: '/news' },
    { text: 'Events', url: '/events' },
    { text: 'Resources', url: '/resources' },
    { text: 'Testimonials', url: '/testimonials' },
  ];

  const { text, url } = links[index % links.length];
  return linkGQLArgs(text, url);
};

export const mockHeaderLinks = [
  mockLink('Services'),
  mockLink('About'),
  mockLink('Article'),
  mockLink('Contact us'),
];

export const mockHeader = {
  uid: '4e4f1d54-d466-4e48-9d1f-c6652e219dba',
  componentName: 'Header',
  dataSource: '/sitecore',
  params: paramsArgs('88'),
  data: {
    item: {
      links: {
        results: mockHeaderLinks,
      },
    },
  },
  fields: {
    searchLink: linkGQLArgs(),
  },
};

export const mockFooterCol = (heading: string, linkCount: number) => {
  return {
    uid: crypto.randomUUID(),
    componentName: 'FooterCol',
    dataSource: `{${crypto.randomUUID()}}`,
    fields: {
      heading: { value: heading },
    },
    data: {
      item: {
        links: {
          results: Array.from({ length: linkCount }, (_, index) => ({
            link: generateRandomLink(index),
          })),
        },
      },
    },
  };
};

export const mockFooterMain = {
  uid: crypto.randomUUID(),
  componentName: 'FooterMain',
  dataSource: '/sitecore',
  placeholders: {
    'footermenu-88': [mockFooterCol('Company', 5)],
  },
  fields: {
    newsletterHeading: stringFieldArgs('Subscribe to our newsletter'),
    newsletterBody: stringFieldArgs(loremIpsumGenerator(100)),
    newsletterLink: linkFieldArgs('/newsletter', 'Subscribe', '_self'),
  },
  params: {
    GridParameters: 'col-12',
    CacheClearingBehavior: 'Clear on publish',
    DynamicPlaceholderId: '88',
    FieldNames: 'Default',
    styles: 'col-12',
  },
};

export const mockFooterLegalFields = {
  copyright: stringFieldArgs('Your Company Name'),
  privacyPolicyLink: linkFieldArgs('/privacy-policy', 'Privacy Policy', '_self'),
  tosLink: linkFieldArgs('/terms-of-service', 'Terms of Service', '_self'),
  cookiePolicyLink: linkFieldArgs('/cookie-policy', 'Cookie Policy', '_self'),
  landAcknowledgement: stringFieldArgs(loremIpsumGenerator(200)),
};

export const mockSocialIconObject = (icon: string) => ({
  socialIcon: { value: icon },
  link: linkGQLArgs(),
});

export const mockFooterLegal = {
  uid: '4e4f1d54-d466-4e48-9d1f-c6652e219dba',
  componentName: 'FooterLegal',
  dataSource: '/sitecore',
  params: paramsArgs('78'),
  fields: mockFooterLegalFields,
  data: {
    socialIcons: {
      results: [
        mockSocialIconObject('instagram'),
        mockSocialIconObject('linkedin-in'),
        mockSocialIconObject('x-twitter'),
        mockSocialIconObject('youtube'),
      ],
    },
  },
};

const mockPageTypeFields = (type = 'Landing Page') => ({
  name: type,
  displayName: type,
  fields: {
    Value: {
      value: type,
    },
  },
});

const mockPageFields = (type = 'Landing Page', title = 'Home') => ({
  Content: stringFieldArgs(''),
  pageTitle: stringFieldArgs(title),
  pageType: mockPageTypeFields(type),
  NavigationFilter: [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockLayoutRoute = (components: any[], type: string, title: string) => ({
  name: 'Home',
  displayName: 'Home',
  fields: mockPageFields(type, title),
  databaseName: 'master',
  deviceId: 'fe5d7fdf-89c0-4d99-9aa3-b5fbd009c9f3',
  itemId: 'ddc1d9e7-8dc2-44a8-b6d4-f4d564d128e0',
  itemLanguage: mainLanguage,
  itemVersion: 1,
  layoutId: '96e5f4ba-a2cf-4a4c-a4e7-64da88226362',
  templateId: 'b24e0981-e53b-425d-9b71-9b0c68f6a6e6',
  templateName: 'Landing Page',
  placeholders: {
    'headless-header': [mockHeader],
    'headless-main': components,
    'headless-footer': [mockFooterMain, mockFooterLegal],
  } as unknown as PlaceholdersData<string>,
});

export const mockSitecoreContext = {
  pageEditing: false,
  site: {
    name: 'TIDAL Accelerator',
  },
  language: mainLanguage,
  itemPath: '/',
  variantId: '_default',
};

const mockPage = {
  layout: {
    sitecore: {
      context: mockSitecoreContext,
      route: null,
    },
  },
  locale: 'en',
  mode: {
    isPreview: false,
    isEditing: false,
    isNormal: true,
    name: LayoutServicePageState.Normal,
    designLibrary: {
      isVariantGeneration: false,
    },
    isDesignLibrary: false,
  },
};

export const mockPageWithRoute = (
  route: RouteData<Record<string, Field<GenericFieldValue> | Item | Item[]>> | null
) => {
  return {
    page: {
      ...mockPage,
      layout: {
        ...mockPage.layout,
        sitecore: {
          ...mockPage.layout.sitecore,
          route,
        },
      },
    },
  };
};

export const withFullScreenLayout = {
  parameters: {
    docs: {
      canvas: { layout: 'fullscreen' },
    },
  },
};
