import { useRef, useMemo, useState } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { EventListingProps } from 'lib/types/components/Events/event-listing';
import { EventDataType, ThemeType } from 'lib/types';
import { useContextPageTags } from 'lib/contexts/page-tags-context';
import { hasMatchingTags, TagItem } from 'lib/helpers/merge-page-tags';
import { useTranslation } from 'lib/hooks/useTranslation';
import EventListGrid from './EventListGrid';
import { useFrame } from 'lib/hooks/useFrame';
import { EditModeClickDisabler } from 'component-children/Shared/Containers/EditModeClickDisabler';

const EventListingRendering: React.FC<EventListingProps> = ({ fields, rendering }) => {
  const { effectiveTheme } = useFrame();
  const searchRef = useRef<HTMLDivElement>(null);
  const { pageTags } = useContextPageTags();
  const { t } = useTranslation();

  const filterEnabled = useMemo(() => {
    const params = rendering?.params || {};
    const filterParam = params.filter || params.tagFilteringEnabled;

    const fields = rendering?.fields || {};
    const filterByTagsField =
      fields.filterByTags &&
      typeof fields.filterByTags === 'object' &&
      'value' in fields.filterByTags
        ? fields.filterByTags.value
        : undefined;

    return (
      filterParam === '1' ||
      filterParam === 'true' ||
      filterByTagsField === true ||
      filterByTagsField === 'true' ||
      filterByTagsField === '1'
    );
  }, [rendering?.params, rendering?.fields]);

  const [filteringFailed, setFilteringFailed] = useState(false);

  const filteredEvents = useMemo(() => {
    const allEvents = (rendering?.data || []) as EventDataType[];
    setFilteringFailed(false);

    if (!filterEnabled || !pageTags.length) {
      return allEvents;
    }

    const filteredResults = allEvents.filter((event) => {
      if (!event) return false;

      const eventRecord = event as unknown as Record<string, EventDataType>;
      const eventTags: TagItem[] = Array.isArray(eventRecord?.sxaTags?.targetItems)
        ? (eventRecord.sxaTags.targetItems as TagItem[])
        : [];

      return hasMatchingTags(pageTags, eventTags);
    });

    if (filteredResults.length === 0) {
      setFilteringFailed(true);
      return allEvents;
    }

    return filteredResults;
  }, [rendering?.data, filterEnabled, pageTags]);

  if (!rendering?.data) {
    return <NoResults theme={effectiveTheme} heading={fields?.heading} />;
  }

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <div data-component="EventListing" ref={searchRef} className="mx-auto flex flex-col py-10">
        <Text tag="h2" field={fields?.heading} className="heading-lg mb-6" />

        {filterEnabled && pageTags.length > 0 && (
          <div className="mb-4 text-sm">
            {fields?.tagsHeading?.value ? (
              <Text field={fields.tagsHeading} tag="span" className="font-semibold" />
            ) : (
              <span className="font-semibold">{t('Filtering by tags:')}</span>
            )}{' '}
            {pageTags.map((tag) => tag.displayName || tag.name).join(', ')}
            {filteringFailed && (
              <div className="mt-2 text-amber-600">
                {fields?.noResultsText?.value ? (
                  <Text field={fields.noResultsText} />
                ) : (
                  <>{t('No event pages found.')}</>
                )}
              </div>
            )}
          </div>
        )}

        <EditModeClickDisabler>
          <EventListGrid
            results={filteredEvents}
            searchRef={searchRef}
            showToggle={true}
            initialShowCurrent={true}
            itemsPerPage={fields?.PageSizeCount?.value}
          />
        </EditModeClickDisabler>
      </div>
    </ContainedWrapper>
  );
};

const NoResults: React.FC<NoResultsProps> = ({ heading, theme }) => {
  const { t } = useTranslation();
  return (
    <ContainedWrapper theme={theme}>
      <div data-component="EventListing" className="py-8">
        <Text tag="h2" field={heading} className="heading-lg mb-6" />
        <p className="text-center text-content">{t('No event pages found.')}</p>
      </div>
    </ContainedWrapper>
  );
};

type NoResultsProps = {
  heading: Field<string>;
  theme?: ThemeType;
};

export default EventListingRendering;
