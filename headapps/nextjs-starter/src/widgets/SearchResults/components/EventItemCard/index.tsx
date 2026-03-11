import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { EventCardStyled } from './styled';
import {
  getHighlightedText,
  normalizeTitleText,
  cn,
  getCardImageWrapperClasses,
} from 'lib/helpers';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { useFrame } from 'lib/hooks/useFrame';
import SearchResultLink from 'src/widgets/SearchResults/components/SearchResultLink';
import type { TailwindBreakpoint } from 'lib/types';
import { SECONDARY_THEME } from 'lib/const';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

type EventItemCardProps = {
  event: Record<string, unknown> & {
    highlight?: {
      description?: string[];
    };
  };
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
  horizontalBreakpoint?: TailwindBreakpoint;
};

const EventsItemCard = ({
  event,
  onItemClick,
  index,
  horizontalBreakpoint,
}: EventItemCardProps) => {
  return (
    <Wrapper event={event} onItemClick={onItemClick} index={index}>
      <BodyContent event={event} horizontalBreakpoint={horizontalBreakpoint} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  event,
  onItemClick,
  index,
}: {
  children: React.ReactNode;
  event: Record<string, unknown>;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
}) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  if (isEditing || !onItemClick || index === undefined) {
    return <>{children}</>;
  }

  return (
    <SearchResultLink result={event} onItemClick={onItemClick} index={index}>
      {children}
    </SearchResultLink>
  );
};
const BodyContent = ({ event, horizontalBreakpoint }: EventItemCardProps) => {
  const { effectiveTheme } = useFrame();
  const textColor = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-content';
  const imageUrl = event?.image_url as string;
  const type = (event.m_content_type as string) || 'Event';
  const firstCategory = (event?.m_category as string[])?.[0];
  const title = normalizeTitleText((event.title as string) || (event.name as string));
  const formattedStartDate = event.formattedStartDate as string;
  const formattedEndDate = event.formattedEndDate as string;

  const ariaLabel = [
    'Read event',
    title && `: ${title}`,
    firstCategory && `, Category: ${firstCategory}`,
    event.formattedStartDate && `, Date: ${event.formattedStartDate as string}`,
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

  const highlightedDescription = getHighlightedText(
    event.highlight?.description,
    event.description as string
  );

  return (
    <EventCardStyled.Root
      key={event.id as string}
      data-component="EventItemCard"
      className={cn('group h-full w-full border border-content/20', flexDirectionClass)}
      aria-label={ariaLabel}
    >
      {imageUrl && (
        <EventCardStyled.ImageWrapper className={imageWrapperClasses}>
          <EventCardStyled.Image src={imageUrl} alt={title} />
        </EventCardStyled.ImageWrapper>
      )}
      <EventCardStyled.Content className={cn('gap-3', contentPaddingClass, textColor)}>
        {type && <span className="copy-xs">{type}</span>}

        <p className="heading-lg block font-semibold group-hover:underline">{title}</p>

        {(event.description as string) && (
          <EventCardStyled.Text className="line-clamp-3">
            <span
              className="copy-sm"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          </EventCardStyled.Text>
        )}
        <div className="flex flex-col gap-2">
          {(event.m_event_location as string[])?.length > 0 && (
            <div className="copy-xs flex gap-2">
              <IconFas
                icon={'map-marker-alt' as IconName}
                className="h-5 w-4 min-w-4"
                color={textColor}
              />
              <span>{(event.m_event_location as string[]).join(', ')}</span>
            </div>
          )}

          {formattedStartDate && (
            <div className="copy-xs flex gap-2">
              <IconFas
                icon={'calendar' as IconName}
                className="h-4 w-4 min-w-4"
                color={textColor}
              />
              <time>
                {formattedStartDate === formattedEndDate
                  ? formattedStartDate
                  : `${formattedStartDate} - ${formattedEndDate}`}
              </time>
            </div>
          )}
        </div>
      </EventCardStyled.Content>
    </EventCardStyled.Root>
  );
};

export default EventsItemCard;
