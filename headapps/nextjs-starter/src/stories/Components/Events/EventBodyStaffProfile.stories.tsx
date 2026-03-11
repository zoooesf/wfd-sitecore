import type { Meta, StoryObj } from '@storybook/nextjs';
import { EventBodyStaffProfile } from 'component-children/Events/EventPage/EventBodyStaffProfile';
import { ProfileType } from 'lib/types';
import { stringFieldArgs, imageFieldArgs } from 'lib/helpers/storybook';
import { FrameProvider } from 'lib/hooks/useFrame';
import { Field } from '@sitecore-content-sdk/nextjs';

const meta = {
  title: 'Components/Events/Event Body Staff Profile',
  component: EventBodyStaffProfile,
  decorators: [
    (Story, context) => {
      const { theme } = context.globals;
      const params = {
        Styles: theme ? `theme:${theme}` : '',
      };

      return (
        <FrameProvider params={params} componentName="EventBodyStaffProfile">
          <div className="mx-auto max-w-screen-lg p-8">
            <h1 className="mb-lg text-3xl font-bold">Event Body Staff Profile Component</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Story />
            </div>
          </div>
        </FrameProvider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A profile card component for displaying staff/speaker profiles on event pages. Shows image, name, description, role, company, location, and expertise with icons.',
      },
    },
  },
} satisfies Meta<typeof EventBodyStaffProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock profile data
const mockProfileComplete: ProfileType = {
  name: 'John Doe',
  displayName: 'John Doe',
  fields: {
    firstName: stringFieldArgs('John'),
    lastName: stringFieldArgs('Doe'),
    role: stringFieldArgs('Senior Developer'),
    email: stringFieldArgs('john.doe@example.com'),
    description: {
      value:
        '<p>John Doe is a skilled professional with extensive experience in software development, specializing in modern web technologies and innovative solutions that drive business growth.</p>',
    },
    image: imageFieldArgs(400, 400),
    imageMobile: imageFieldArgs(320, 320),
    company: stringFieldArgs('Tech Corp Inc.'),
    location: [
      {
        id: 'location1',
        url: '/locations/calgary',
        name: 'Calgary',
        displayName: 'Calgary',
        fields: {
          contentName: { value: 'Calgary' },
        },
      },
    ] as unknown as Field<string>,
    expertise: [
      {
        fields: {
          Title: {
            value: 'Web Development',
          },
        },
      },
      {
        fields: {
          Title: {
            value: 'Cloud Architecture',
          },
        },
      },
      {
        fields: {
          Title: {
            value: 'DevOps',
          },
        },
      },
    ] as unknown as Field<string>,
    website: {
      value: {
        href: 'https://example.com',
        text: 'Website',
        linktype: 'external',
        url: 'https://example.com',
        anchor: '',
        target: '_blank',
      },
    },
    linkedInLink: {
      value: {
        href: 'https://linkedin.com',
        text: 'LinkedIn',
        linktype: 'external',
        url: 'https://linkedin.com',
        anchor: '',
        target: '_blank',
      },
    },
  },
};

export const Default: Story = {
  args: {
    profile: mockProfileComplete,
    userURL: '/profiles/john-doe',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete profile with all fields populated including image, metadata, and expertise. Use the theme switcher in the toolbar to change icon colors.',
      },
    },
  },
};
