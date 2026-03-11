import type { Meta, StoryObj } from '@storybook/nextjs';
import { EventBodySponsors } from 'component-children/Events/EventPage/EventBodySponsors';
import { sponsorFactory } from 'lib/helpers/storybook/factory/sponsor-factory';
import { mockSponsor } from 'lib/helpers/storybook/mock';

const meta = {
  title: 'Components/Events/Event Body Sponsors',
  component: EventBodySponsors,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg p-8">
        <h1 className="mb-lg text-3xl font-bold">Event Body Sponsors Component</h1>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive sponsors section for event pages. Displays sponsor logos in a grid layout with hover effects and optional links.',
      },
    },
  },
} satisfies Meta<typeof EventBodySponsors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sponsors: sponsorFactory(3),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default sponsors display with 3 sponsors in a responsive grid.',
      },
    },
  },
};

export const ManySponors: Story = {
  args: {
    sponsors: sponsorFactory(8),
  },
  parameters: {
    docs: {
      description: {
        story: 'Display with many sponsors showing grid responsiveness and thank you message.',
      },
    },
  },
};

export const FewSponsors: Story = {
  args: {
    sponsors: sponsorFactory(2),
  },
  parameters: {
    docs: {
      description: {
        story: 'Display with just 2 sponsors.',
      },
    },
  },
};

export const SingleSponsor: Story = {
  args: {
    sponsors: [mockSponsor],
  },
  parameters: {
    docs: {
      description: {
        story: 'Single sponsor display.',
      },
    },
  },
};

export const SponsorsWithoutLogos: Story = {
  args: {
    sponsors: [
      {
        fields: {
          contentName: { value: 'Text Only Sponsor' },
          link: {
            value: {
              href: 'https://example.com',
              text: 'Text Only Sponsor',
              target: '_blank',
              linktype: 'external',
            },
          },
        },
      },
      {
        fields: {
          contentName: { value: 'Another Text Sponsor' },
        },
      },
      mockSponsor,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Mixed display with some sponsors having logos and others being text-only.',
      },
    },
  },
};

export const NoSponsors: Story = {
  args: {
    sponsors: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state - component does not render when no sponsors are provided.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    sponsors: sponsorFactory(4),
    className: 'bg-secondary/5',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom styling applied via className prop.',
      },
    },
  },
};
