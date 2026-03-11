import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as ContentTreeSideNav } from 'components/Navigation/ContentTreeSideNav/ContentTreeSideNav';
import { getTheme, paramsArgs } from 'lib/helpers/storybook';
import { FrameProvider } from 'lib/hooks/useFrame';

const meta: Meta<typeof ContentTreeSideNav> = {
  title: 'Components/Navigation/ContentTreeSideNav',
  component: ContentTreeSideNav,
  tags: ['autodocs'],
  argTypes: {
    'rendering.data.item.parent.displayName': {
      control: 'text',
      name: 'Parent Display Name',
    } as const,
  } as Meta['argTypes'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const createPageData = (displayName: string, basePath = '') => {
  const slug = displayName.toLowerCase().replace(/\s+/g, '-');
  const path = `${basePath.replace(/\/$/, '')}/${slug}`;
  return {
    id: path,
    name: displayName,
    displayName,
    url: { path },
  };
};

const mockTreeData = {
  item: {
    id: '/articles',
    name: 'Articles',
    displayName: 'Articles',
    url: { path: '/articles' },
    children: {
      results: [
        createPageData('First Article Post', '/articles'),
        createPageData('Second Article Post', '/articles'),
      ],
    },
    parent: {
      ...createPageData('Home'),
      children: {
        results: [createPageData('About'), createPageData('Articles'), createPageData('Contact')],
      },
    },
  },
};

const ComponentArgs = {
  rendering: {
    componentName: 'ContentTreeSideNav',
    dataSource: '/sitecore',
    data: mockTreeData,
  },
  fields: {},
  params: {},
};

export const Default: Story = {
  args: ComponentArgs,
  render: (args, context) => {
    const theme = getTheme(context);
    const frameParams = { Styles: `theme:${theme}` };
    const componentParams = { ...paramsArgs('1'), ...frameParams };

    return (
      <FrameProvider params={frameParams}>
        <ContentTreeSideNav {...(args as typeof ComponentArgs)} params={componentParams} />
      </FrameProvider>
    );
  },
};
