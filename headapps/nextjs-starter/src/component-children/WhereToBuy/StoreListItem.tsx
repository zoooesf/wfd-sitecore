import React, { useState, useEffect } from 'react';
import { cn } from 'lib/helpers/classname';
import type { LocationDataWithPosition } from 'lib/types/components/WhereToBuy';

interface StoreListItemProps {
  location: LocationDataWithPosition;
  itemNumber: number;
  isMapHidden: boolean;
  isMobileView: boolean;
  isSelected?: boolean;
  onTitleClick?: (location: LocationDataWithPosition) => void;
  buttonColorClass: string;
  labels: {
    websiteLabel: string;
    getDirectionsLabel: string;
    readMoreLabel: string;
    readLessLabel: string;
  };
}

export const StoreListItem: React.FC<StoreListItemProps> = ({
  location,
  itemNumber,
  isMapHidden,
  isMobileView,
  isSelected = false,
  onTitleClick,
  buttonColorClass,
  labels,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);

  useEffect(() => {
    // Check if there's additional content that can be expanded
    const hasAdditionalContent =
      location &&
      ((location.services && location.services.length > 0) ||
        location.phone ||
        location.email ||
        location.hours ||
        location.website);
    setNeedsReadMore(!!hasAdditionalContent);
  }, [location]);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTitleClick) {
      onTitleClick(location);
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      location.lat + ',' + location.lng
    )}`;
  };

  const directionsButtonClasses = cn(
    'no-link-style mt-2 inline-block rounded-md px-4 py-2 text-sm no-underline transition-colors',
    buttonColorClass,
    'bg-button-surface text-content',
    'md:hidden',
    'hover:bg-button-surface/90'
  );

  return (
    <div
      className={cn('store-item primary relative rounded-lg border p-4 transition-colors', {
        'border-content/20 bg-surface': !isSelected,
        'border-[rgb(var(--next-tertiary-bg))] bg-[rgb(var(--next-tertiary-bg)/0.2)]': isSelected,
        'hover:border-content/40': !isMapHidden && !isMobileView && !isSelected,
        'cursor-pointer': !isMapHidden && !isMobileView,
      })}
      data-location-id={location.name}
      data-item-number={itemNumber}
      onClick={!isMapHidden && !isMobileView ? handleTitleClick : undefined}
    >
      <div className="store-content relative">
        <div className="flex items-start gap-3">
          <div className="secondary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-button-surface text-xs font-bold text-content">
            {itemNumber}
          </div>
          <div className="flex flex-col gap-2 text-left">
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <p className="location-title w-fit flex-1 break-words pr-2 text-base font-bold text-content">
                  {location.name}
                </p>
                {location.distance && (
                  <p className="w-fit text-sm text-content/80">{location.distance.toFixed(1)} km</p>
                )}
              </div>

              {/* Address */}
              {location.address && (
                <p className="mb-1 w-fit break-words text-sm text-content">{location.address}</p>
              )}

              {/* Additional Details - Only shown when expanded */}
              {isExpanded && (
                <>
                  {/* Services Badges */}
                  {location.services && location.services.length > 0 && (
                    <div className="my-2">
                      <div className="flex flex-wrap gap-1">
                        {location.services.map((service, index) => (
                          <span
                            key={index}
                            className="secondary inline-block w-fit rounded-full bg-button-surface px-2 py-1 text-xs text-content"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {location.phone && (
                    <a
                      href={`tel:${location.phone}`}
                      className="mb-1 block w-fit break-all text-sm text-content hover:underline hover:opacity-80"
                    >
                      {location.phone}
                    </a>
                  )}

                  {/* Email */}
                  {location.email && (
                    <a
                      href={`mailto:${location.email}`}
                      className="mb-1 block w-fit break-all text-sm text-content hover:underline hover:opacity-80"
                    >
                      {location.email}
                    </a>
                  )}

                  {/* Hours */}
                  {location.hours && (
                    <p
                      className="mb-1 w-fit break-words text-sm text-content"
                      dangerouslySetInnerHTML={{ __html: location.hours.replace(/\n/g, '<br>') }}
                    />
                  )}

                  {/* Website */}
                  {location.website && (
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-1 block w-fit break-all text-sm text-content hover:underline hover:opacity-80"
                    >
                      {labels.websiteLabel}
                    </a>
                  )}

                  {/* Get Directions Button (Mobile Only) */}
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={directionsButtonClasses}
                  >
                    {labels.getDirectionsLabel}
                  </a>
                </>
              )}
            </div>

            {/* Read More/Less Button */}
            {needsReadMore && (
              <button
                onClick={handleReadMoreClick}
                className="read-more-btn block w-fit cursor-pointer border-none bg-transparent p-0 text-xs text-content hover:underline hover:opacity-80"
                style={{ fontWeight: 500 }}
              >
                {isExpanded ? labels.readLessLabel : labels.readMoreLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
