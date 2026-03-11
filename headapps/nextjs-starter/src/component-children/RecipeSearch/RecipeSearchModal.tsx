import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'component-children/Shared/Button/Button';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { useTranslation } from 'lib/hooks/useTranslation';
import { FrameProvider } from 'lib/hooks/useFrame';

/** Controls whether results must contain all search terms or at least one. */
type MatchMode = 'all' | 'any';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for recipe search supporting multiple search terms and match-mode selection.
 * Terms are added as removable chips; the match mode toggle appears once two or more
 * terms are present.
 */
export const RecipeSearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentInput, setCurrentInput] = useState('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>('all');

  /** Commits the current input value as a search-term chip if it is non-empty and unique. */
  const commitCurrentInput = () => {
    const trimmed = currentInput.trim();
    if (trimmed && !searchTerms.includes(trimmed)) {
      setSearchTerms((prev) => [...prev, trimmed]);
    }
    setCurrentInput('');
  };

  /**
   * Adds a term when the user presses Enter inside the text input.
   * Prevents default form submission so only the explicit Search button submits.
   */
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitCurrentInput();
    }
  };

  /** Removes a term chip by value. */
  const removeTerm = (term: string) => {
    setSearchTerms((prev) => prev.filter((t) => t !== term));
  };

  const resetState = () => {
    setCurrentInput('');
    setSearchTerms([]);
    setMatchMode('all');
  };

  /**
   * Builds the search hash from all terms (including any uncommitted input) and
   * navigates to /search. Multiple terms are pipe-delimited; the match mode is
   * appended as a separate parameter.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const allTerms = currentInput.trim()
      ? [...searchTerms, currentInput.trim()]
      : [...searchTerms];

    if (allTerms.length === 0) return;

    const encodedTerms = encodeURIComponent(allTerms.join('|'));
    const hashValue =
      allTerms.length > 1
        ? `searchQuery=${encodedTerms}&matchMode=${matchMode}`
        : `searchQuery=${encodedTerms}`;

    router
      .push(
        {
          pathname: '/search',
          // window.location.search includes the '?' if there is a querystring.
          // This caused extra '?' to be added each time.
          // If there is no querystring, there is no '?' so this issue wasn't caught earlier.
          hash: hashValue,
        },
        undefined,
        { scroll: false }
      )
      .catch((err) => {
        // workaround for https://github.com/vercel/next.js/issues/37362
        if (!err.cancelled) {
          throw err;
        }
      });

    onClose();
    resetState();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const totalTermCount = searchTerms.length + (currentInput.trim() ? 1 : 0);
  const canSearch = totalTermCount > 0;
  const showMatchMode = searchTerms.length >= 2;

  if (!isOpen) return null;

  return (
    <FrameProvider params={{ Styles: 'theme:secondary' }}>
      <div
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        <div
          className="black fixed inset-0 bg-surface/50"
          onClick={handleClose}
          aria-hidden="true"
        />
        <div className="secondary absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-content/20 bg-surface text-content shadow-lg">
          <div className="m-auto max-w-outer-content px-4 py-8 sm:px-12 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <h4 className="heading-lg mb-4" id="search-modal-title">
                {t('Search recipes by ingredient')}
              </h4>

              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                {/* Term input row */}
                <div className="relative flex flex-col sm:flex-row">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    aria-label={t('Add a search word')}
                    placeholder={t('Type a word and press Enter or Add')}
                    className="mb-2 flex-1 rounded-lg border border-content/50 bg-white px-4 py-2 text-black sm:mb-0 sm:pr-7"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="button"
                    color="tertiary"
                    className="flex w-full justify-center sm:absolute sm:right-0 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:rounded-l-none"
                    aria-label={t('Add search term')}
                    onClick={commitCurrentInput}
                  >
                    {t('Add')}
                  </Button>
                </div>

                {/* Term chips */}
                {searchTerms.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2"
                    role="list"
                    aria-label={t('Added search terms')}
                  >
                    {searchTerms.map((term) => (
                      <span
                        key={term}
                        role="listitem"
                        className="flex items-center gap-1 rounded-full border border-content/30 bg-content/10 px-3 py-1 text-sm"
                      >
                        {term}
                        <button
                          type="button"
                          onClick={() => removeTerm(term)}
                          aria-label={`${t('Remove')} ${term}`}
                          className="ml-1 leading-none hover:text-content/60"
                        >
                          <IconFas icon="xmark" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Match mode selector — only relevant when 2+ terms are present */}
                {showMatchMode && (
                  <fieldset className="flex flex-col gap-2 rounded-lg border border-content/20 p-4">
                    <legend className="copy-base px-1 font-semibold">
                      {t('Show results that contain')}
                    </legend>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="matchMode"
                          value="all"
                          checked={matchMode === 'all'}
                          onChange={() => setMatchMode('all')}
                          className="accent-content"
                        />
                        {t('All of the ingredients')}
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="matchMode"
                          value="any"
                          checked={matchMode === 'any'}
                          onChange={() => setMatchMode('any')}
                          className="accent-content"
                        />
                        {t('Any of the ingredients')}
                      </label>
                    </div>
                  </fieldset>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  variant="button"
                  color="tertiary"
                  disabled={!canSearch}
                  className="flex w-full justify-center"
                  aria-label={t('Submit search')}
                  iconRight="magnifying-glass"
                >
                  {t('Search')}
                </Button>
              </form>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="copy-base absolute right-6 top-8 flex items-center gap-1 text-content hover:text-content/70"
            aria-label={t('Close search modal')}
          >
            {t('Close')} <IconFas icon="xmark" variant="white" />
          </button>
        </div>
      </div>
    </FrameProvider>
  );
};
