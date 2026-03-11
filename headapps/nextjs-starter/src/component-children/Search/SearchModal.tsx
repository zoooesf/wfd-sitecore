import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'component-children/Shared/Button/Button';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { useTranslation } from 'lib/hooks/useTranslation';
import { FrameProvider } from 'lib/hooks/useFrame';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query parameter
      router
        .push(
          {
            pathname: '/search',
            // window.location.search includes the '?' if there is a querystring.
            // This caused extra '?' to be added each time.
            // If there is no querystring, there is no '?' so this issue wasn't caught earlier.
            hash: `searchQuery=${encodeURIComponent(searchQuery.trim())}`,
          },
          undefined,
          { scroll: false }
        )
        .catch((e) => {
          // workaround for https://github.com/vercel/next.js/issues/37362
          if (!e.cancelled) {
            throw e;
          }
        });
      onClose(); // Close the modal after navigation
      setSearchQuery(''); // Reset search query
    }
  };

  const handleClose = () => {
    setSearchQuery(''); // Reset search query when closing
    onClose();
  };

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
              <h4 className="heading-lg mb-4">{t('Search')}</h4>
              <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t('Search site content')}
                  placeholder="Find activities, events, places, and more"
                  className="mb-2 flex-1 rounded-lg border border-content/50 bg-white px-4 py-2 text-black sm:mb-0 sm:pr-7"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="button"
                  color="tertiary"
                  className="flex w-full justify-center sm:absolute sm:right-0 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:rounded-l-none"
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
