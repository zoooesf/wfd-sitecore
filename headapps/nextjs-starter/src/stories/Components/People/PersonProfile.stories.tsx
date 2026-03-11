import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  stringFieldArgs,
  imageGQLFieldArgs,
  withDatasourceCheckComponentArgs,
} from 'lib/helpers/storybook';
import { Default as PersonProfile } from 'components/People/PersonProfile/PersonProfile';
import { PersonContext } from 'lib/contexts/person-context';

const meta = {
  title: 'Components/People/PersonProfile',
  component: PersonProfile,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PersonProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPersonProfileRendering = () => {
  return {
    componentName: 'PersonProfile',
    dataSource: '/sitecore',
  };
};

const mockPersonData = {
  name: 'Anna Example',
  displayName: 'Anna Example',
  id: '870A22B610C348DE80CAC1B65D6C5DCC',
  description: {
    value:
      '<h1>The Comprehensive Guide to Modern Web Development: Building Scalable Applications with Advanced Technologies and Best Practices</h1><h2>Understanding the Fundamentals of Frontend Development: From HTML Semantics to Advanced JavaScript Patterns</h2><h3>Mastering Responsive Design Principles: Creating Mobile-First Applications That Work Across All Devices</h3><h4>Implementing CSS Grid and Flexbox: Advanced Layout Techniques for Modern Web Applications</h4><h5>Optimizing Performance and Accessibility: Ensuring Your Web Applications Meet Industry Standards</h5><h6>Debugging and Testing Strategies: Comprehensive Approaches to Quality Assurance in Web Development</h6><p>Anna is a skilled professional with extensive experience in her field, specializing in cutting-edge technologies and innovative solutions that drive business growth and enhance user experiences across multiple platforms and industries.</p>',
    jsonValue: {
      value:
        '<h1>The Comprehensive Guide to Modern Web Development: Building Scalable Applications with Advanced Technologies and Best Practices</h1><h2>Understanding the Fundamentals of Frontend Development: From HTML Semantics to Advanced JavaScript Patterns</h2><h3>Mastering Responsive Design Principles: Creating Mobile-First Applications That Work Across All Devices</h3><h4>Implementing CSS Grid and Flexbox: Advanced Layout Techniques for Modern Web Applications</h4><h5>Optimizing Performance and Accessibility: Ensuring Your Web Applications Meet Industry Standards</h5><h6>Debugging and Testing Strategies: Comprehensive Approaches to Quality Assurance in Web Development</h6><p>Anna is a skilled professional with extensive experience in her field, specializing in cutting-edge technologies and innovative solutions that drive business growth and enhance user experiences across multiple platforms and industries.</p>',
    },
  },
  email: stringFieldArgs('AnnaExample@example.com'),
  phone: stringFieldArgs('123-456-7890'),
  role: stringFieldArgs('Senior Consultant'),
  company: stringFieldArgs('Example Inc.'),
  image: imageGQLFieldArgs(),
  imageMobile: imageGQLFieldArgs(),
  expertise: {
    jsonValue: [
      {
        fields: {
          Title: {
            value: 'Business Strategy',
          },
        },
      },
      {
        fields: {
          Title: {
            value: 'Project Management',
          },
        },
      },
    ],
  },
  firstName: {
    value: 'Anna',
  },
  lastName: {
    value: 'Example',
  },
  location: {
    value: 'Toronto',
    jsonValue: [
      {
        id: 'location2',
        url: '/locations/toronto',
        name: 'Toronto',
        displayName: 'Toronto',
        fields: {
          contentName: { value: 'Toronto' },
        },
      },
    ],
  },
  website: {
    jsonValue: {
      value: {
        href: 'http://www.google.com',
        text: 'My Blog',
        linktype: 'external',
        url: 'http://www.google.com',
        anchor: '',
        target: '_blank',
      },
    },
  },
  linkedInLink: {
    jsonValue: {
      value: {
        href: 'http://www.microsoft.com',
        text: 'My Profile',
        linktype: 'external',
        url: 'http://www.microsoft.com',
        anchor: '',
        target: '_blank',
      },
    },
  },
};

// Create a mock wrapper for the PersonContext
const PersonContextWrapper = (props: { children: React.ReactNode }) => {
  return <PersonContext.Provider value={mockPersonData}>{props.children}</PersonContext.Provider>;
};

const DefaultArgs = {
  ...withDatasourceCheckComponentArgs,
  rendering: mockPersonProfileRendering(),
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  decorators: [
    (Story) => (
      <PersonContextWrapper>
        <Story />
      </PersonContextWrapper>
    ),
  ],
  render: (args, globals) => {
    const { params } = globals;
    return <PersonProfile {...args} params={params} />;
  },
};
