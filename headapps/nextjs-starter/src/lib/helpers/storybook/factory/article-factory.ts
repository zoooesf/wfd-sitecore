import { mockPageCategoryGQL, imageGQLFieldArgs, stringFieldArgs } from '../mock';
import { loremIpsumGenerator } from 'lib/helpers/lorem-ipsum-generator';

// Standard mock tags that can be used across stories
export const mockTagCategories = [
  { id: 'tag1', name: 'Technology', displayName: 'Technology' },
  { id: 'tag2', name: 'Science', displayName: 'Science' },
  { id: 'tag3', name: 'Health', displayName: 'Health' },
  { id: 'tag4', name: 'Business', displayName: 'Business' },
  { id: 'tag5', name: 'Arts', displayName: 'Arts' },
  { id: 'tag6', name: 'Sports', displayName: 'Sports' },
];

// Standard mock people profiles that can be used across stories
const mockPeopleProfiles = [
  { id: 'person1', name: 'Jane Smith', displayName: 'Jane Smith' },
  { id: 'person2', name: 'John Doe', displayName: 'John Doe' },
  { id: 'person3', name: 'Emily Johnson', displayName: 'Emily Johnson' },
  { id: 'person4', name: 'Michael Chen', displayName: 'Michael Chen' },
];

const titles = [
  loremIpsumGenerator(30),
  loremIpsumGenerator(20),
  loremIpsumGenerator(100),
  loremIpsumGenerator(40),
  loremIpsumGenerator(20),
  loremIpsumGenerator(60),
];

const summaries = [
  loremIpsumGenerator(20),
  loremIpsumGenerator(30),
  loremIpsumGenerator(100),
  loremIpsumGenerator(40),
  loremIpsumGenerator(20),
  loremIpsumGenerator(60),
];

const dates = ['10/26/2024', '10/27/2024', '12/26/2024', '11/26/2024', '10/24/2024', '10/30/2024'];

const categories = [
  {
    displayName: 'Category Alpha',
    fields: {
      pageCategory: stringFieldArgs('Category Alpha'),
    },
  },
  {
    displayName: 'Category Beta',
    fields: {
      pageCategory: stringFieldArgs('Category Beta'),
    },
  },
  {
    displayName: 'Category Delta',
    fields: {
      pageCategory: stringFieldArgs('Category Delta'),
    },
  },
  {
    displayName: 'Category Gamma',
    fields: {
      pageCategory: stringFieldArgs('Category Gamma'),
    },
  },
  {
    displayName: 'Category Epsilon',
    fields: {
      pageCategory: stringFieldArgs('Category Epsilon'),
    },
  },
  {
    displayName: 'Category Zeta',
    fields: {
      pageCategory: stringFieldArgs('Category Zeta'),
    },
  },
  {
    displayName: 'Category Theta',
    fields: {
      pageCategory: stringFieldArgs('Category Theta'),
    },
  },
];

export const articleFactory = (includeExtendedFields = true) => {
  return titles.map((title, index) => {
    // Base article object
    const articlePost = {
      id: crypto.randomUUID(),
      name: title.replace(/\s+/g, '-').toLowerCase(),
      image: imageGQLFieldArgs(400, 300),
      imageMobile: imageGQLFieldArgs(320, 400),
      datePublished: {
        formattedDateValue: dates[index],
      },
      pageCategory: [mockPageCategoryGQL(categories[index].fields.pageCategory.value)],
      heading: {
        jsonValue: stringFieldArgs(title),
      },
      subheading: {
        jsonValue: stringFieldArgs(summaries[index]),
      },
      body: {
        jsonValue: stringFieldArgs(summaries[index]),
      },
      url: { path: 'lorem-ipsum', url: 'lorem-ipsum' },
    };

    // Only add extended fields if requested
    if (includeExtendedFields) {
      // Add tags - give each article 2 tags based on its index
      const tagIndex1 = index % mockTagCategories.length;
      const tagIndex2 = (index + 3) % mockTagCategories.length; // Offset to add variety
      const articleTags = [mockTagCategories[tagIndex1], mockTagCategories[tagIndex2]];

      // Add people - first 3 articles get person1, others get distributed
      const personIndex = index < 3 ? 0 : index % mockPeopleProfiles.length;
      const articlePerson = mockPeopleProfiles[personIndex];

      return {
        ...articlePost,
        sxaTags: {
          targetItems: articleTags,
        },
        profiles: {
          targetItems: [articlePerson],
        },
      };
    }

    return articlePost;
  });
};
