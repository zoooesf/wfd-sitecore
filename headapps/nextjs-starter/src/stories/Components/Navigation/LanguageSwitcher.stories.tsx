import type { Meta, StoryObj } from '@storybook/nextjs';
import { LanguageSwitcher } from 'component-children/Navigation/LanguageSwitcher/LanguageSwitcher';
import { getTheme, mockSitecoreContext, paramsArgs } from 'lib/helpers/storybook';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import components from '../../../../.sitecore/component-map';
import { FrameProvider } from 'lib/hooks/useFrame';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/Navigation/Language Switcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  argTypes: {
    rendering: { control: false, table: { disable: true } },
    params: { control: false, table: { disable: true } },
    languages: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story, context) => {
      const theme = getTheme(context);
      return (
        <div className="w-full p-8 pb-32">
          <FrameProvider params={{ Styles: `theme:${theme}` }}>
            <div className={`${theme} flex w-full items-center justify-end bg-surface p-4`}>
              <Story />
            </div>
          </FrameProvider>
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

const ComponentArgs = {
  rendering: {
    componentName: 'LanguageSwitcher',
    dataSource: '/sitecore',
    params: paramsArgs('1'),
  },
  params: paramsArgs('1'),
  languages: [mainLanguage, 'fr-CA'], // Mocking available languages (english and french)
};

export const English: Story = {
  args: ComponentArgs,
  render: (args, context) => {
    const theme = getTheme(context);
    const frameParams = { Styles: `theme:${theme}` };
    const componentParams = { ...args.params, ...frameParams };

    return (
      <LanguageSwitcher
        {...args}
        params={componentParams}
        rendering={{
          ...args.rendering,
          params: componentParams,
        }}
      />
    );
  },
};

export const French: Story = {
  args: ComponentArgs,
  render: (args, context) => {
    const theme = getTheme(context);
    const frameParams = { Styles: `theme:${theme}` };
    const componentParams = { ...args.params, ...frameParams };

    const mockPage = {
      layout: {
        sitecore: {
          context: {
            ...mockSitecoreContext,
            language: 'fr-CA', // Mocking french language in Sitecore Context
          },
          route: null,
        },
      },
      locale: 'fr-CA',
      mode: {
        isEditing: false,
        isNormal: true,
      },
      siteName: 'Fishtank TIDAL',
    } as unknown as Page;

    return (
      <SitecoreProvider componentMap={components} api={scConfig.api} page={mockPage}>
        <LanguageSwitcher
          {...args}
          params={componentParams}
          rendering={{
            ...args.rendering,
            params: componentParams,
          }}
        />
      </SitecoreProvider>
    );
  },
};

export const SingleLanguage: Story = {
  args: {
    ...ComponentArgs,
    languages: [mainLanguage], // Mocking available languages with a single language (english)
  },
  render: (args, context) => {
    const theme = getTheme(context);
    const frameParams = { Styles: `theme:${theme}` };
    const componentParams = { ...args.params, ...frameParams };

    return (
      <LanguageSwitcher
        {...args}
        params={componentParams}
        rendering={{
          ...args.rendering,
          params: componentParams,
        }}
      />
    );
  },
};
