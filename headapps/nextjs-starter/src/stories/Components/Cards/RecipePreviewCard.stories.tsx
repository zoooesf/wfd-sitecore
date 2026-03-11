import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Default as RecipePreviewCard,
  ImageLeft as RecipePreviewCardImageLeft,
} from 'components/Cards/RecipePreviewCard/RecipePreviewCard';
import { loremIpsumGenerator } from 'lib/helpers';
import {
  linkFieldArgs,
  tileImageFieldArgs,
  withDatasourceCheckComponentArgs,
  stringFieldArgs,
  recipeFactory,
} from 'lib/helpers/storybook';

const meta = {
  title: 'Components/Cards/RecipePreviewCard',
  component: RecipePreviewCard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-screen-lg">
        <h1 className="mb-md text-3xl font-bold">RecipePreviewCard Component</h1>
        <div className="flex flex-row gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof RecipePreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultFields = {
  heading: stringFieldArgs('Recipe Name'),
  body: stringFieldArgs('yummy yummy recipe description'),
  link: linkFieldArgs('/', "Get Cookin'", '_self'),
  image: tileImageFieldArgs(),
  imageMobile: tileImageFieldArgs(),
  title: stringFieldArgs('Recipe Name'),
  description: stringFieldArgs('yummy yummy recipe description'),
  prepTime: stringFieldArgs('5mins'),
  cookTime: stringFieldArgs('20mins'),
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
        <RecipePreviewCard {...args} params={params} />
        <RecipePreviewCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(100)) }}
          params={params}
        />
        <RecipePreviewCard
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
        <RecipePreviewCard {...args} params={params} />
        <RecipePreviewCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(120)) }}
          params={params}
        />
        <RecipePreviewCard
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(60)) }}
          params={params}
        />
      </>
    );
  },
};

export const ImageLeftVariant: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    return (
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <RecipePreviewCardImageLeft {...args} params={params} />
        <RecipePreviewCardImageLeft
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(80)) }}
          params={params}
        />
        <RecipePreviewCardImageLeft
          {...args}
          fields={{ ...args.fields, heading: stringFieldArgs(loremIpsumGenerator(40)) }}
          params={params}
        />
      </div>
    );
  },
};

export const RecipeList: Story = {
  args: DefaultArgs,
  render: (args, globals) => {
    const { params } = globals;
    const recipes = recipeFactory();
    return (
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        <h2 className="heading-lg mb-6">Recipe Collection</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipeFields, index) => (
            <RecipePreviewCard key={index} {...args} fields={recipeFields} params={params} />
          ))}
        </div>
      </div>
    );
  },
};
