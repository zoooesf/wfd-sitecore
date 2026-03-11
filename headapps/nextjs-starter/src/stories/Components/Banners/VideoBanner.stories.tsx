import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as VideoBanner } from 'components/Banners/VideoBanner/VideoBanner';
import {
  stringFieldArgs,
  imageFieldArgs,
  linkFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Banners/Video Banner',
  component: VideoBanner,
} satisfies Meta<typeof VideoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultFields = {
  heading: stringFieldArgs('Video Banner'),
  backgroundVideo: {
    value: {
      src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  },
  link: linkFieldArgs('/', 'Call To Action', '_self'),
  backgroundImage: imageFieldArgs(1400, 800),
  backgroundImageMobile: imageFieldArgs(768, 1024),
};

const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return <VideoBanner {...args} params={params} />;
  },
};
