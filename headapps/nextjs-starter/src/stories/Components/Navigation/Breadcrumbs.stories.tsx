import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as Breadcrumbs } from 'components/Navigation/Breadcrumbs/Breadcrumbs';
import { getTheme, stringFieldArgs } from 'lib/helpers/storybook';
import { FrameProvider } from 'lib/hooks/useFrame';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    controls: {
      exclude: [
        'rendering.componentName',
        'rendering.dataSource',
        'params',
        'route.placeholders',
        'fields',
        'route.name',
        'pathList.name',
        'pathList.parent.name',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ComponentArgs = {
  rendering: {
    componentName: 'Breadcrumbs',
    dataSource: '/sitecore',
  },
  route: {
    name: 'About us',
    fields: {
      heading: stringFieldArgs('About us'),
    },
    placeholders: {},
  },
  pathList: {
    name: 'Page B',
    displayName: 'Page B',
    parent: {
      name: 'Page A',
      displayName: 'Page A',
    },
  },
  fields: {},
  params: {},
};

export const Default: Story = {
  parameters: {
    nextjs: {
      router: {
        basePath: '/page-a/page-b/about-us',
        asPath: '/page-a/page-b/about-us',
      },
    },
  },
  args: ComponentArgs,
  render: (args, context) => {
    const theme = getTheme(context);
    const frameParams = { Styles: `theme:${theme}` };
    const componentParams = { ...args.params, ...frameParams };

    return (
      <FrameProvider params={frameParams}>
        <Breadcrumbs {...(args as typeof ComponentArgs)} params={componentParams} />
      </FrameProvider>
    );
  },
};
