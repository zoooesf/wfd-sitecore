import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SitecoreProvider, ComponentPropsContext } from '@sitecore-content-sdk/nextjs';
import components from '../../../.sitecore/component-map';
import scConfig from 'sitecore.config';
import { RecipeSearchModal } from 'component-children/RecipeSearch/RecipeSearchModal';
import RecipeCard, {
  RecipeCardImageLeft,
} from 'component-children/Cards/RecipePreviewCard/RecipePreviewCard';
import { FrameProvider } from 'lib/hooks/useFrame';
import type { RecipePageDataType } from 'lib/helpers/listing/recipe-listing';
import {
  withFullScreenLayout,
  mockPageWithRoute,
  imageGQLFieldArgs,
  recipeFactory,
} from 'lib/helpers/storybook';
import Button from 'component-children/Shared/Button/Button';

type MatchMode = 'all' | 'any';

/**
 * Maps recipeFactory output to RecipePageDataType format for use in RecipePreviewCard.
 */
const allRecipes: RecipePageDataType[] = recipeFactory().map((recipe) => ({
  id: crypto.randomUUID(),
  name: recipe.heading.value || '',
  title: { jsonValue: recipe.heading },
  prepTime: { jsonValue: recipe.prepTime },
  cookTime: { jsonValue: recipe.cookTime },
  image: imageGQLFieldArgs(400, 300),
  imageMobile: imageGQLFieldArgs(320, 400),
  url: { path: '/', url: '/' },
}));

/**
 * Filters recipes by matching search terms against title, prepTime, and cookTime.
 * @param {RecipePageDataType[]} recipes - The full list of recipes to filter
 * @param {string[]} terms - Search terms to match against
 * @param {MatchMode} matchMode - Whether recipes must match 'all' or 'any' of the terms
 * @returns {RecipePageDataType[]} Filtered list of matching recipes
 */
function filterRecipes(
  recipes: RecipePageDataType[],
  terms: string[],
  matchMode: MatchMode
): RecipePageDataType[] {
  if (!terms.length) return recipes;

  return recipes.filter((recipe) => {
    const title = recipe.title?.jsonValue?.value?.toLowerCase() || '';
    const name = recipe.name?.toLowerCase() || '';
    const prepTime = recipe.prepTime?.jsonValue?.value?.toLowerCase() || '';
    const cookTime = recipe.cookTime?.jsonValue?.value?.toLowerCase() || '';
    const searchText = `${title} ${name} ${prepTime} ${cookTime}`;

    if (matchMode === 'all') {
      return terms.every((term) => searchText.includes(term.toLowerCase()));
    }

    return terms.some((term) => searchText.includes(term.toLowerCase()));
  });
}

type RecipeSearchPageProps = {
  theme?: string;
  cardVariant?: 'default' | 'imageLeft';
};

/**
 * Full-page story component demonstrating the Recipe Search experience.
 * The header contains a search trigger that opens the RecipeSearchModal.
 * RecipePreviewCards update in real time based on search results.
 * @param {RecipeSearchPageProps} props - Theme and card layout variant
 * @returns {JSX.Element} The rendered recipe search page story
 */
const RecipeSearchPage: React.FC<RecipeSearchPageProps> = ({
  theme = '',
  cardVariant = 'default',
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipePageDataType[]>(allRecipes);
  const [activeTerms, setActiveTerms] = useState<string[]>([]);
  const [activeMatchMode, setActiveMatchMode] = useState<MatchMode>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const fallbackPage = mockPageWithRoute(null).page;

  useEffect(() => {
    /**
     * Parses the search hash from the navigation URL and updates the filtered recipe list.
     * The RecipeSearchModal navigates to /search#searchQuery=...&matchMode=...
     */
    const handleRouteChange = (url: string) => {
      const hashIndex = url.indexOf('#');
      if (hashIndex === -1) return;

      const hash = url.slice(hashIndex + 1);
      const params = new URLSearchParams(hash);
      const queryParam = params.get('searchQuery');
      const mode = (params.get('matchMode') as MatchMode) || 'all';

      if (queryParam) {
        const terms = decodeURIComponent(queryParam).split('|');
        setActiveTerms(terms);
        setActiveMatchMode(mode);
        setFilteredRecipes(filterRecipes(allRecipes, terms, mode));
        setHasSearched(true);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  const CardComponent = cardVariant === 'imageLeft' ? RecipeCardImageLeft : RecipeCard;
  const termSeparator = activeMatchMode === 'all' ? ' + ' : ' or ';

  const handleClearSearch = () => {
    setFilteredRecipes(allRecipes);
    setActiveTerms([]);
    setHasSearched(false);
  };

  return (
    <ComponentPropsContext value={{}}>
      <SitecoreProvider componentMap={components} api={scConfig.api} page={fallbackPage}>
        <FrameProvider params={{ Styles: '' }}>
          <div className={`min-h-screen bg-surface text-content ${theme}`}>
            {/* Search header */}
            <div className="border-b border-content/10 bg-surface px-4 py-6 shadow-sm">
              <div className="mx-auto flex max-w-outer-content flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="heading-lg">Recipe Search</h1>
                  {activeTerms.length > 0 && (
                    <p className="copy-base mt-1 text-content/70">
                      Showing results for: <strong>{activeTerms.join(termSeparator)}</strong>
                      {' — '}
                      <button
                        className="text-content underline hover:text-content/70"
                        onClick={handleClearSearch}
                      >
                        Clear
                      </button>
                    </p>
                  )}
                </div>
                <Button
                  variant="button"
                  color="tertiary"
                  onClick={() => setIsModalOpen(true)}
                  iconRight="magnifying-glass"
                >
                  {activeTerms.length > 0 ? 'Refine Search' : 'Search Recipes'}
                </Button>
              </div>
            </div>

            {/* Recipe results */}
            <main className="mx-auto max-w-outer-content px-4 py-10">
              {hasSearched && filteredRecipes.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="heading-lg text-content/50">No recipes found</p>
                  <p className="copy-base mt-2 text-content/40">
                    Try different search terms or{' '}
                    <button className="text-content underline" onClick={handleClearSearch}>
                      clear the search
                    </button>
                  </p>
                </div>
              ) : (
                <div
                  className={
                    cardVariant === 'imageLeft'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
                      : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  }
                >
                  {filteredRecipes.map((recipe, index) => (
                    <CardComponent key={index} page={recipe} />
                  ))}
                </div>
              )}
            </main>

            <RecipeSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        </FrameProvider>
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

const meta = {
  title: 'Pages/RecipeSearch',
  component: RecipeSearchPage,
} satisfies Meta<typeof RecipeSearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  ...withFullScreenLayout,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: {} as any,
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  render: (_args, context) => {
    const { theme } = context.globals;
    return <RecipeSearchPage theme={theme} />;
  },
};

export const ImageLeft: Story = {
  ...withFullScreenLayout,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: {} as any,
  globals: {
    paddingTop: '',
    paddingBottom: '',
  },
  render: (_args, context) => {
    const { theme } = context.globals;
    return <RecipeSearchPage theme={theme} cardVariant="imageLeft" />;
  },
};
