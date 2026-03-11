import type { Meta, StoryObj } from '@storybook/nextjs';
import { getTheme, resourceFactory } from 'lib/helpers/storybook';
import { ResourceCard } from 'component-children/Shared/Card/ResourceCard';
import { FrameProvider } from 'lib/hooks/useFrame';

const meta = {
  title: 'Components/Cards/Resource Card',
  component: ResourceCard,
  decorators: [
    (Story) => (
      <div className="mx-auto my-16 max-w-screen-lg">
        <div className="flex flex-col">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ResourceCard>;

export default meta;

type Story = StoryObj<typeof ResourceCard>;

export const ResourcesWithImage: Story = {
  render: (_args, context) => {
    const theme = getTheme(context);
    const params = { Styles: `theme:${theme}` };
    return (
      <FrameProvider params={params}>
        {resourceFactory().map((resource, index) => (
          <ResourceCard fields={resource} key={index} />
        ))}
      </FrameProvider>
    );
  },
};

export const ResourcesWithoutImage: Story = {
  render: (_args, context) => {
    const theme = getTheme(context);
    const params = { Styles: `theme:${theme}` };
    return (
      <FrameProvider params={params}>
        {resourceFactory().map((resource, index) => (
          <ResourceCard fields={{ ...resource, image: { src: '', alt: '' } }} key={index} />
        ))}
      </FrameProvider>
    );
  },
};
