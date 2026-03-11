import { EventDataType, TailwindBreakpoint } from 'lib/types';
import { getPageCategories } from 'lib/helpers/page-category';
import { getLocationData } from 'lib/helpers/location';
import { cn, safeStripHtmlTagsPreservingHighlights, getCardImageWrapperClasses } from 'lib/helpers';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { IconFas } from '../Icon/Icon';
import { useFrame } from 'lib/hooks/useFrame';
import { getFormattedDate } from 'lib/helpers/time-date-helper';
import { NextImage } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { SECONDARY_THEME } from 'lib/const';

type EventCardProps = {
  event: EventDataType;
  isTransitioning?: boolean;
  transitionIndex?: number;
  horizontalBreakpoint?: TailwindBreakpoint;
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  isTransitioning,
  transitionIndex,
  horizontalBreakpoint,
}) => {
  const { effectiveTheme } = useFrame();
  if (!event) return null;

  const textTheme = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-secondary';

  // Extract data with proper type handling
  const imageField = event.imageMobile || event.image;
  const title = event.heading?.jsonValue?.value || '';
  const categoryData = getPageCategories(event.pageCategory);
  const category = categoryData?.[0]?.fields?.pageCategory?.value;
  const locationData = getLocationData(event.location);
  const locations =
    locationData?.map((item) => item?.fields?.contentName?.value).filter(Boolean) || [];
  const eventUrl = event.url?.path;

  // Format dates
  const startDateFormatted = event.startDate?.formattedDateValue
    ? getFormattedDate(event?.startDate?.formattedDateValue)
    : '';

  // Get description from body field with proper type handling
  const description = event?.subheading?.jsonValue?.value || '';

  const ariaLabel = [
    'Read event',
    title && `: ${title}`,
    category && `, Category: ${category}`,
    startDateFormatted && `, Date: ${startDateFormatted}`,
  ]
    .filter(Boolean)
    .join('');

  // Determine if horizontal layout should be used
  const isHorizontal = !!horizontalBreakpoint;

  // Get dynamic image wrapper classes based on breakpoint
  const imageWrapperClasses = getCardImageWrapperClasses(horizontalBreakpoint);

  const flexDirectionClass = isHorizontal
    ? `flex-col ${horizontalBreakpoint}:flex-row`
    : 'flex-col';

  // Content padding classes with responsive left padding
  // Safelist: sm:pl-8 md:pl-8 lg:pl-8 xl:pl-8 2xl:pl-8
  const contentPaddingClass = isHorizontal ? `py-4 pr-4 ${horizontalBreakpoint}:pl-8 pl-4` : 'p-4';

  return (
    <div
      data-component="EventCard"
      className={cn(
        'group flex h-full overflow-hidden border border-content/20 transition-all duration-200 ease-in-out',
        flexDirectionClass,
        isTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      )}
      style={{
        transitionDelay: transitionIndex !== undefined ? `${transitionIndex * 50}ms` : '0ms',
      }}
    >
      <Link href={eventUrl || ''} className="no-link-style">
        {/* Image Section */}
        {imageField && (
          <div className={cn('aspect-square overflow-hidden', imageWrapperClasses)}>
            <NextImage
              field={imageField?.jsonValue}
              className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
              alt={title || 'Event image'}
            />
          </div>
        )}

        {/* Content Section */}
        <div className={cn('flex w-full flex-col gap-3', contentPaddingClass)}>
          {/* Type */}
          <span className={cn('copy-sm', textTheme)}>Event</span>

          {/* Title */}
          {eventUrl ? (
            <Link
              href={eventUrl}
              className="no-link-style heading-lg block font-semibold group-hover:underline"
              aria-label={ariaLabel}
            >
              {title}
            </Link>
          ) : (
            <p className="heading-lg font-semibold">{title}</p>
          )}

          {/* Description */}
          {description && (
            <span
              className="line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: safeStripHtmlTagsPreservingHighlights(description),
              }}
            />
          )}

          <div className="flex flex-col gap-2">
            {/* Location */}
            {locations && locations.length > 0 && (
              <div className={cn('copy-xs flex items-center gap-2', textTheme)}>
                <IconFas
                  icon={'map-marker-alt' as IconName}
                  className="w-4 min-w-4"
                  color={effectiveTheme}
                  aria-hidden="true"
                />
                <span>{locations.join(', ')}</span>
              </div>
            )}

            {/* Date */}
            {startDateFormatted && (
              <div className={cn('copy-xs flex items-center gap-2', textTheme)}>
                <IconFas
                  icon={'calendar' as IconName}
                  className="w-4 min-w-4"
                  color={effectiveTheme}
                  aria-hidden="true"
                />
                <time>{startDateFormatted}</time>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
