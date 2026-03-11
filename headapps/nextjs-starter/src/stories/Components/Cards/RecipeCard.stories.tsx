import type { Meta, StoryObj } from '@storybook/nextjs';
import { Default as RecipeCard } from 'components/Cards/RecipeCard/RecipeCard';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  linkFieldArgs,
  tileImageFieldArgs,
  withDatasourceCheckComponentArgs,
  stringFieldArgs,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Cards/RecipeCard',
  component: RecipeCard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">RecipeCard Component</h1>
        <div className="flex flex-row gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockIngredients = `<div>
<ul><li>1 cup of rice</li>
  <li>2 cups of water</li>
  <li>3 cups of chicken</li>
  <li>4 cups of vegetables</li>
</ul>
</div>`;
const mockInstructions = `<div>
<ol><li>1. boil water</li>
  <li>2. add rice</li>
  <li>3. add beans</li>
  <li>4. add chicken</li>
  <li>5. add vegetables</li>
</ol>
</div>`;
const DefaultFields = {
  heading: stringFieldArgs('Recipe Name'),
  body: stringFieldArgs('yummy yummy recipe description'),
  link: linkFieldArgs('/', 'Get Cookin\'', '_self'),
  image: tileImageFieldArgs(),
  imageMobile: tileImageFieldArgs(),
  title: stringFieldArgs('Recipe Name'),
  description: stringFieldArgs('yummy yummy recipe description'),
  prepTime: stringFieldArgs('5mins'),
  cookTime: stringFieldArgs('20mins'),
  ingredients:{value: mockIngredients},
  instructions: {value: mockInstructions},
  tag: stringFieldArgs('Dinner'),
  servings: stringFieldArgs('2'),
};

const DefaultArgs = {
  fields: DefaultFields,
  ...withDatasourceCheckComponentArgs,
  params: {},
};

const DefaultNoBadgeArgs = {
  fields: { ...DefaultFields, badge: stringFieldArgs('') },
  ...withDatasourceCheckComponentArgs,
  params: {},
};

export const Default: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <RecipeCard {...args} params={params} />
        <RecipeCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(100)) }}
          params={params}
        />
        <RecipeCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(60)) }}
          params={params}
        />
      </>
    );
  },
};

export const NoBadge: Story = {
  args: DefaultNoBadgeArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <>
        <RecipeCard {...args} params={params} />
        <RecipeCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(120)) }}
          params={params}
        />
        <RecipeCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(60)) }}
          params={params}
        />
      </>
    );
  },
};
