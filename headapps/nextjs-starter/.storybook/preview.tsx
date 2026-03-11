import React from 'react';
import type { Preview } from '@storybook/nextjs';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import components from '../.sitecore/component-map';
import scConfig from '../sitecore.config';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../src/assets/global.scss';
import './preview.css';
import { argTypes, excludeArgs, globalTypes } from './config/preview';
// @ts-ignore: mainLanguage is not a module, but we need its value
import { mainLanguage } from '../src/lib/i18n/i18n-config';

fontAwesomeConfig.autoAddCss = false;
library.add(fas, fab);

const MOCK_SITECORE_ROUTE_DATA = {
  name: 'Home',
  displayName: 'Home',
  databaseName: 'master',
  deviceId: 'fe5d7fdf-89c0-4d99-9aa3-b5fbd009c9f3',
  itemId: 'ddc1d9e7-8dc2-44a8-b6d4-f4d564d128e0',
  itemLanguage: mainLanguage,
  itemVersion: 1,
  layoutId: '96e5f4ba-a2cf-4a4c-a4e7-64da88226362',
  templateId: 'b24e0981-e53b-425d-9b71-9b0c68f6a6e6',
  templateName: 'Landing Page',
  placeholders: {
    'headless-header': [],
    'headless-main': [],
    'headless-footer': [],
  },
};

const preview: Preview = {
  globalTypes: globalTypes,
  initialGlobals: {
    theme: 'none',
    mode: false,
    pageEditing: false,
  },
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    deepControls: { enabled: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      exclude: excludeArgs,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Design System', 'Components'],
      },
    },
  },
  argTypes: argTypes,
};

const createStylesList = (theme: string, paddingTop?: string, paddingBottom?: string) => {
  return [
    `theme:${theme}`,
    paddingTop && `padding:${paddingTop}`,
    paddingBottom && `padding:${paddingBottom}`,
  ].filter(Boolean);
};

export const decorators = [
  (Story, context) => {
    const { theme, pageEditing, paddingTop, paddingBottom } = context.globals;
    const mockPage = {
      layout: {
        sitecore: {
          context: {
            pageEditing: pageEditing || false,
            site: {
              name: 'Fishtank TIDAL',
            },
            language: mainLanguage,
            itemPath: '/',
            variantId: '_default',
          },
          route: MOCK_SITECORE_ROUTE_DATA,
        },
      },
      locale: mainLanguage,
      mode: {
        isEditing: pageEditing || false,
        isNormal: !pageEditing,
      },
      siteName: 'Fishtank TIDAL',
    } as unknown as Page;

    const stylesList = createStylesList(theme, paddingTop, paddingBottom);
    const defaultParams = {
      GridParameters: 'col-12 ms-lg-auto',
      DynamicPlaceholderId: '1',
      FieldNames: 'Default',
      Styles: stylesList.join(' '),
    };

    return (
      <SitecoreProvider componentMap={components} api={scConfig.api} page={context?.args?.page ?? mockPage}>
        <div data-component="Storybook Preview" className="w-full">
          <Story params={defaultParams} />
        </div>
      </SitecoreProvider>
    );
  },
];

export default preview;
