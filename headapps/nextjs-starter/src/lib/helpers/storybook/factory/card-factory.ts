import {
  stringFieldArgs,
  linkFieldArgs,
  createMockComponent,
  mockIconFeatureCard,
  paramsArgs,
  tileImageFieldArgs,
} from '../mock';

const CardFields = (heading = 'Fast Performance') => {
  return {
    heading: stringFieldArgs(heading),
    image: tileImageFieldArgs(),
    mobileImage: tileImageFieldArgs(),
    link: linkFieldArgs(),
    updatedDate: stringFieldArgs('10/11/2021'),
    subheading: stringFieldArgs(
      'Big beefy subheading, definately will make you want to read an article.'
    ),
  };
};

export const mockCard = (componentName = 'Card', heading = 'Fast Performance') => {
  return createMockComponent(componentName, CardFields(heading));
};

export const generatePlaceholderCards = (componentName?: string, count = 3) => {
  return Array.from({ length: count }, () => mockCard(componentName));
};

// Card Grid
export const mockCardGrid = createMockComponent(
  'CardGrid',
  {
    heading: stringFieldArgs('Discover Our Exclusive Features'),
    link: linkFieldArgs('/', 'View All', '_self'),
  },
  {
    'cardgrid-20': [
      mockCard('Card', 'Fast Performance'),
      mockCard('Card', 'Tailor-Made Designs for Every Style'),
      mockCard('Card', 'Round-the-Clock Support for Uninterrupted Service'),
    ],
  },
  paramsArgs('20', 'Default', 'padding:top-md padding:bottom-md')
);

export const iconFeatureCardFactory = (count = 6) => {
  const icons = ['coffee', 'rocket', 'bolt', 'star', 'heart', 'shield'];
  return Array.from({ length: count }, (_, index) => {
    // Add links to alternating cards
    const hasLink = index % 2 === 0;

    return mockIconFeatureCard({
      heading: `Feature ${index + 1}`,
      imageIcon: icons[index % icons.length],
      ...(hasLink && {
        link: {
          href: '/features',
          text: 'Learn More',
          target: '_self',
        },
      }),
    });
  });
};
