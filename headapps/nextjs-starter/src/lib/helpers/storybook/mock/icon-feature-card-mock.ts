import { Item } from '@sitecore-content-sdk/nextjs';
import { createMockComponent, linkFieldArgs, nameArgs, stringFieldArgs } from './field-mock';

type IconFeatureCardOptions = {
  heading?: string;
  imageIcon?: string;
  subheading?: string;
  link?: { href: string; text: string; target?: string };
};

const IconFeatureCardFields = ({
  heading = 'Feature Title',
  imageIcon = 'coffee',
  subheading = 'Feature description that explains the benefit in more detail.',
  link,
}: IconFeatureCardOptions) => {
  return {
    heading: stringFieldArgs(heading),
    subheading: stringFieldArgs(subheading),
    imageIcon: nameArgs(imageIcon) as Item,
    ...(link && { link: linkFieldArgs(link.href, link.text, link.target) }),
  };
};

export const mockIconFeatureCard = (options: IconFeatureCardOptions = {}) => {
  return createMockComponent('IconFeatureCard', IconFeatureCardFields(options));
};

export const generatePlaceholderIconFeatureCards = (count = 6) => {
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
