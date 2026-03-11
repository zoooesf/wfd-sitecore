import { mockPageCategoryGQL, stringFieldArgs, tileImageFieldArgs } from '../mock';
import { loremIpsumGenerator } from 'lib/helpers/lorem-ipsum-generator';

export const resourceFactory = () => {
  const titles = [
    loremIpsumGenerator(30),
    loremIpsumGenerator(20),
    loremIpsumGenerator(100),
    loremIpsumGenerator(40),
    loremIpsumGenerator(20),
    loremIpsumGenerator(60),
  ];

  const summaries = [
    loremIpsumGenerator(120),
    loremIpsumGenerator(130),
    loremIpsumGenerator(100),
    loremIpsumGenerator(140),
    loremIpsumGenerator(120),
    loremIpsumGenerator(160),
  ];

  const dates = [
    '2024-10-26T00:00:00Z',
    '2024-10-27T00:00:00Z',
    '2024-12-26T00:00:00Z',
    '2024-11-26T00:00:00Z',
    '2024-10-24T00:00:00Z',
    '2024-10-30T00:00:00Z',
  ];
  const categories = [
    'Resource Type',
    'Resource Type',
    'Resource Type',
    'Resource Type',
    'Resource Type',
    'Resource Type',
  ];

  const imageValue = {
    src: `/tile-1.jpg`,
    alt: 'Mock Image Alt',
    jsonValue: {
      ...tileImageFieldArgs(),
      value: { ...tileImageFieldArgs().value, width: '600', height: '400' },
    },
  };

  return titles.map((title, index) => ({
    id: crypto.randomUUID(),
    name: title.replace(/\s+/g, '-').toLowerCase(),
    image: imageValue,
    imageMobile: imageValue,
    datePublished: {
      formattedDateValue: dates[index],
    },
    pageCategory: [mockPageCategoryGQL(categories[index])],
    heading: stringFieldArgs(title),
    subheading: stringFieldArgs(summaries[index]),
    body: stringFieldArgs(summaries[index]),
    url: { path: `lorem-ipsum-${index}`, url: `lorem-ipsum-${index}` },
  }));
};
