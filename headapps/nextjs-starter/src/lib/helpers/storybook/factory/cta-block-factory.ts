import { loremIpsumGenerator } from 'lib/helpers/lorem-ipsum-generator';
import { createMockComponent, linkFieldArgs, stringFieldArgs } from '../mock';

const CTABlockFields = (heading = 'Fast Performance') => {
  return {
    heading: stringFieldArgs(heading),
    body: stringFieldArgs(loremIpsumGenerator(120)),
    link: linkFieldArgs('/', 'CTA Button', '_self'),
  };
};

const mockCTABlock = (componentName = 'CTABlock', heading = 'Fast Performance') => {
  return createMockComponent(componentName, CTABlockFields(heading));
};

export const generatePlaceholderCTABlocks = (count = 3) => {
  return Array.from({ length: count }, () => mockCTABlock());
};
