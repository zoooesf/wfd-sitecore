import React from 'react';
import { cn } from 'lib/helpers/classname';
import { getFormattedDate, getDateRange } from 'lib/helpers/time-date-helper';
import { IconFas } from '../Icon/Icon';
import Button from '../Button/Button';
import { useTranslation } from 'lib/hooks/useTranslation';
import { LinkField } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { useFrame } from 'lib/hooks/useFrame';
import { SECONDARY_THEME } from 'lib/const';

// Normalized data interface that both parent components will transform their data to
export interface EventCardInnerData {
  id: string;
  title: string;
  category?: string;
  startDate: string; // ISO format: "2025-12-24T00:00:00.000Z"
  endDate?: string; // ISO format: "2025-12-25T04:00:00.000Z"
  eventTime?: string; // "2:00 PM EST"
  locations: string[]; // ["Calgary", "Toronto"]
  url?: string; // For navigation
}

interface EventCardInnerProps {
  data: EventCardInnerData;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  // Transition animation props
  isTransitioning?: boolean;
  transitionIndex?: number;
}

export const EventCardInner: React.FC<EventCardInnerProps> = ({
  data,
  onClick,
  className,
  isTransitioning,
  transitionIndex,
}) => {
  return (
    <div
      className={cn(
        // Unified styling - adopting the better search card styling
        'relative flex w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-lg border-2 border-surface/15 bg-surface p-4 text-content',
        'md:flex-row md:gap-8',
        'lg:gap-15',
        onClick ? 'cursor-pointer' : '',
        'transition-all duration-200 ease-in-out',
        isTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100',
        className
      )}
      style={{
        transitionDelay: transitionIndex !== undefined ? `${transitionIndex * 50}ms` : '0ms',
      }}
      data-component="EventCardInner"
      onClick={onClick}
    >
      <EventDateBlock startDate={data.startDate} />
      <BodySection data={data} />
      <DetailsButton data={data} />
    </div>
  );
};

// Date block component - unified from both versions
const EventDateBlock: React.FC<{ startDate?: string }> = ({ startDate }) => {
  if (!startDate) return null;

  const month = getFormattedDate(startDate, { month: 'short' });
  const day = getFormattedDate(startDate, { day: '2-digit' });

  return (
    <div
      className={cn(
        'flex aspect-square flex-shrink-0 flex-grow-0 flex-col items-center justify-center rounded-md p-4 uppercase',
        'heading-base h-20 w-20',
        'bg-secondary text-tertiary', // fallback for components without the group/theme
        'group-[.primary]/theme:bg-secondary group-[.primary]/theme:text-tertiary',
        'group-[.secondary]/theme:bg-tertiary group-[.secondary]/theme:text-secondary',
        'group-[.tertiary]/theme:bg-secondary group-[.tertiary]/theme:text-primary'
      )}
      aria-hidden="true"
    >
      <p>{month}</p>
      <p>{day}</p>
    </div>
  );
};

// Body section containing header and details
const BodySection: React.FC<{ data: EventCardInnerData }> = ({ data }) => {
  return (
    <div className={cn('flex w-full flex-col gap-4', 'md:w-1/2')}>
      <EventHeader title={data.title} category={data.category} />
      <EventDetails
        startDate={data.startDate}
        endDate={data.endDate}
        eventTime={data.eventTime}
        locations={data.locations}
      />
    </div>
  );
};

// Header with title and category
const EventHeader: React.FC<{ title: string; category?: string }> = ({ title, category }) => {
  if (!title) return null;

  return (
    <div className="flex flex-col items-start justify-start gap-2 pt-1">
      {category && <span className="heading-base uppercase">{category}</span>}
      <h3 className="heading-xl">{title}</h3>
    </div>
  );
};

// Event details with icons (date, time, location)
const EventDetails: React.FC<{
  startDate: string;
  endDate?: string;
  eventTime?: string;
  locations: string[];
}> = ({ startDate, endDate, eventTime, locations }) => {
  const { t } = useTranslation();

  if (!startDate) return null;

  // Format date range or single date
  const dateValue = endDate
    ? getDateRange({ startDate, endDate })
    : getFormattedDate(startDate, { month: 'short', day: '2-digit', year: 'numeric' });

  // Build details array
  const details = [
    {
      icon: 'calendar' as IconName,
      label: `${t('Date')}:`,
      value: dateValue,
    },
    ...(eventTime
      ? [
          {
            icon: 'clock' as IconName,
            label: `${t('Time')}:`,
            value: eventTime,
          },
        ]
      : []),
    ...(locations.length > 0
      ? [
          {
            icon: 'location-dot' as IconName,
            label: `${t('Location')}:`,
            value: locations.join(', '),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      {details.map((detail, key) => (
        <IconLabelField key={key} icon={detail.icon} text={detail.value} label={detail.label} />
      ))}
    </div>
  );
};

// Icon + label field component
const IconLabelField: React.FC<{
  icon: IconName;
  text?: string;
  label: string;
}> = ({ icon, text, label }) => {
  const { effectiveTheme } = useFrame();

  // Smart theming based on the parent component theme
  // If theme is secondary (dark) → yellow icon, otherwise → dark icon
  const componentTheme = effectiveTheme; // Default to primary if no theme set
  const iconVariant = componentTheme === SECONDARY_THEME ? 'tertiary' : 'secondary';

  const displayText = `${label} ${text}`;

  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <IconFas icon={icon} className="h-4 w-4" aria-hidden="true" variant={iconVariant} />
      <p className="copy-sm">{displayText}</p>
    </div>
  );
};

// Details button
const DetailsButton: React.FC<{ data: EventCardInnerData }> = ({ data }) => {
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();

  if (!data.url) return null;

  // Create LinkField structure for Button component
  const buttonLink: LinkField = {
    value: {
      href: data.url,
      text: t('View details'),
      target: '_self',
      linktype: data.url.startsWith('http') ? 'external' : 'internal',
      title: t('View details'),
    },
  };

  // Smart theming based on the parent component theme
  // If theme is secondary (dark) → yellow button, otherwise → dark button
  const componentTheme = effectiveTheme; // Default to primary if no theme set
  const buttonColor = componentTheme === SECONDARY_THEME ? 'tertiary' : 'secondary';

  return (
    <Button
      link={buttonLink}
      variant="button"
      color={buttonColor}
      className="mt-6 h-fit md:ml-auto"
    />
  );
};

export default EventCardInner;
