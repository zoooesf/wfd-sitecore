import { useMemo } from 'react';
import type { SearchResponseFacet } from '@sitecore-search/react';
import { PROFILE_LAST_NAME_INITIAL_FACET_NAME } from 'lib/const';
import { LetterButtonGrid } from './LetterButtonGrid';
import { cn } from 'lib/helpers';

type SearchFacetsProps = {
  facets: SearchResponseFacet[];
  className?: string;
};

const Facets = ({ facets, className }: SearchFacetsProps) => {
  const profileLastNameInitialFacet = useMemo(
    () => facets.find((facet) => facet.name === PROFILE_LAST_NAME_INITIAL_FACET_NAME),
    [facets]
  );

  if (!profileLastNameInitialFacet) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full rounded-lg border border-content/20 bg-surface bg-tertiary/10 py-4 text-content',
        className
      )}
      data-component="NameInitialFacets"
    >
      <div role="group" aria-label="Alphabetical filter">
        <LetterButtonGrid facet={profileLastNameInitialFacet} className="justify-center" />
      </div>
    </div>
  );
};

export default Facets;
