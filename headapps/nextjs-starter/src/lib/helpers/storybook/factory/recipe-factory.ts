import { stringFieldArgs, tileImageFieldArgs, linkFieldArgs } from '../mock';
import { loremIpsumGenerator } from 'lib/helpers/lorem-ipsum-generator';

const recipeNames = [
  'Grilled Salmon with Lemon Butter',
  'Chicken Tikka Masala',
  'Classic Beef Bolognese',
  'Vegetable Stir Fry',
  'Creamy Mushroom Risotto',
  'Spicy Thai Basil Pork',
];

const recipeTags = ['Dinner', 'Lunch', 'Dinner', 'Lunch', 'Dinner', 'Lunch'];

const prepTimes = ['10 mins', '15 mins', '20 mins', '5 mins', '30 mins', '25 mins'];
const cookTimes = ['20 mins', '45 mins', '60 mins', '15 mins', '30 mins', '35 mins'];

const descriptions = [
  loremIpsumGenerator(80),
  loremIpsumGenerator(60),
  loremIpsumGenerator(100),
  loremIpsumGenerator(50),
  loremIpsumGenerator(90),
  loremIpsumGenerator(70),
];

/**
 * Generates an array of mock recipe card field objects for use in Storybook stories.
 * @returns An array of recipe card field data matching CardFields shape
 */
export const recipeFactory = () => {
  return recipeNames.map((name, index) => ({
    heading: stringFieldArgs(name),
    body: stringFieldArgs(descriptions[index]),
    link: linkFieldArgs('/', "Get Cookin'", '_self'),
    image: tileImageFieldArgs(),
    imageMobile: tileImageFieldArgs(),
    title: stringFieldArgs(name),
    description: stringFieldArgs(descriptions[index]),
    prepTime: stringFieldArgs(prepTimes[index]),
    cookTime: stringFieldArgs(cookTimes[index]),
    tag: stringFieldArgs(recipeTags[index]),
    servings: stringFieldArgs(String(index + 2)),
  }));
};
