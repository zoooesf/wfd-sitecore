import { backgroundFieldArgs, createMockComponent } from './field-mock';
import { linkFieldArgs, linkFieldArgsEmpty, paramsArgs } from './field-mock';
import { stringFieldArgs } from './field-mock';

export const mockHeroBanner = (
  heading = 'Digitally Different.',
  subheading = 'We are the digital mavericks of enterprise content.',
  primaryLinkText = 'Our Services',
  secondaryLinkText = 'Learn More',
  emptyLinks = false
) => {
  return createMockComponent(
    'HeroBanner',
    {
      heading: stringFieldArgs(heading),
      backgroundImage: backgroundFieldArgs('black'),
      backgroundImageMobile: backgroundFieldArgs('black'),
      subheading: stringFieldArgs(subheading),
      link: emptyLinks ? linkFieldArgsEmpty : linkFieldArgs('/', primaryLinkText, '_self'),
      link2: emptyLinks ? linkFieldArgsEmpty : linkFieldArgs('/', secondaryLinkText, '_self'),
    },
    {},
    paramsArgs('10', 'Default', 'theme:secondary')
  );
};
