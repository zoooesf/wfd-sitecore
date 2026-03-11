import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { PersonItemCardStyled } from './styled';
import { cn, getHighlightedText, getCardImageWrapperClasses } from 'lib/helpers';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { useFrame } from 'lib/hooks/useFrame';
import SearchResultLink from 'src/widgets/SearchResults/components/SearchResultLink';
import type { TailwindBreakpoint } from 'lib/types';
import { SECONDARY_THEME } from 'lib/const';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

type Person = {
  id: string;
  source_id?: string;
  m_content_type?: string;
  m_profile_desktop_portrait_image_url?: string;
  m_profile_desktop_portrait_image_alt?: string;
  m_profile_mobile_portrait_image_url?: string;
  m_profile_mobile_portrait_image_alt?: string;
  url?: string;
  title?: string;
  description?: string;
  m_profile_full_name?: string;
  m_profile_description?: string;
  m_profile_location?: string[];
  m_profile_role?: string;
  m_profile_email?: string;
  m_profile_phone?: string;
  m_profile_expertise?: string[];
  highlight?: {
    m_profile_description?: string[];
  };
};

type PersonItemCardProps = {
  person: Person;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
  horizontalBreakpoint?: TailwindBreakpoint;
};

const PersonItemCard = ({
  person,
  onItemClick,
  index,
  horizontalBreakpoint,
}: PersonItemCardProps) => {
  return (
    <Wrapper
      person={person}
      onItemClick={onItemClick}
      index={index}
      horizontalBreakpoint={horizontalBreakpoint}
    >
      <BodyContent person={person} horizontalBreakpoint={horizontalBreakpoint} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  person,
  onItemClick,
  index,
}: {
  children: React.ReactNode;
  person: Person;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
  horizontalBreakpoint?: TailwindBreakpoint;
}) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  if (isEditing || !onItemClick || index === undefined) {
    return <>{children}</>;
  }

  return (
    <SearchResultLink result={person} onItemClick={onItemClick} index={index}>
      {children}
    </SearchResultLink>
  );
};

const BodyContent = ({ person, horizontalBreakpoint }: PersonItemCardProps) => {
  const { effectiveTheme } = useFrame();
  const textColor = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-content';
  const type = (person.m_content_type as string) || 'Profile';
  const displayTitle =
    person.m_profile_full_name || person.title?.replace(/\s*-\s*TIDAL.*$/i, '') || person.title;
  const desktopImageUrl = person.m_profile_desktop_portrait_image_url;
  const mobileImageUrl = person.m_profile_mobile_portrait_image_url;
  const desktopAlt =
    person.m_profile_desktop_portrait_image_alt ||
    person.m_profile_full_name ||
    person.title ||
    'Person image';
  const mobileAlt =
    person.m_profile_mobile_portrait_image_alt ||
    person.m_profile_full_name ||
    person.title ||
    'Person image';

  const computedDesktopImageUrl = desktopImageUrl || mobileImageUrl;
  const computedDesktopImageAlt = desktopImageUrl
    ? desktopAlt
    : mobileImageUrl
      ? mobileAlt
      : 'Person image';

  const computedMobileImageUrl = mobileImageUrl || desktopImageUrl;
  const computedMobileImageAlt = mobileImageUrl
    ? mobileAlt
    : desktopImageUrl
      ? desktopAlt
      : 'Person image';

  const ariaLabel = ['Read person profile', displayTitle].filter(Boolean).join('');

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
    person.highlight?.m_profile_description,
    person.m_profile_description
  );

  return (
    <PersonItemCardStyled.Root
      key={person.id}
      data-component="PersonItemCard"
      className={cn('group h-full w-full border border-content/20', flexDirectionClass)}
      aria-label={ariaLabel}
    >
      {desktopImageUrl || mobileImageUrl ? (
        <PersonItemCardStyled.ImageWrapper className={imageWrapperClasses}>
          {/* Desktop breakpoint */}
          {desktopImageUrl && computedDesktopImageUrl && (
            <PersonItemCardStyled.Image
              src={computedDesktopImageUrl}
              alt={computedDesktopImageAlt}
              className="hidden object-cover md:block"
            />
          )}
          {/* Mobile breakpoint */}
          {mobileImageUrl && computedMobileImageUrl && (
            <PersonItemCardStyled.Image
              src={computedMobileImageUrl}
              alt={computedMobileImageAlt}
              className="block object-cover md:hidden"
            />
          )}
        </PersonItemCardStyled.ImageWrapper>
      ) : (
        /* Empty space when no image is available */
        <div />
      )}
      <PersonItemCardStyled.Content className={cn('gap-3', contentPaddingClass, textColor)}>
        {type && <span className="copy-xs">{type}</span>}

        <p className="heading-lg block font-semibold group-hover:underline">{displayTitle}</p>

        {person.m_profile_description && (
          <PersonItemCardStyled.Text className="line-clamp-3">
            <span
              className="copy-sm"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          </PersonItemCardStyled.Text>
        )}
        <div className="flex flex-col gap-2">
          <div className={cn('grid grid-cols-1 gap-2', isHorizontal && 'sm:grid-cols-2')}>
            {person.m_profile_role && (
              <div className="copy-xs flex gap-2">
                <IconFas
                  icon={'briefcase' as IconName}
                  className="h-4 w-4 min-w-4"
                  color={textColor}
                />
                <span>{person.m_profile_role}</span>
              </div>
            )}
            {person.m_profile_location && person.m_profile_location.length > 0 && (
              <div className="copy-xs flex gap-2">
                <IconFas
                  icon={'map-marker-alt' as IconName}
                  className="h-5 w-4 min-w-4"
                  color={textColor}
                />
                <span>{person.m_profile_location.join(', ')}</span>
              </div>
            )}
          </div>
          {person.m_profile_expertise && person.m_profile_expertise.length > 0 && (
            <div className="copy-xs flex gap-2">
              <IconFas
                icon={'lightbulb' as IconName}
                className="h-5 w-4 min-w-4"
                color={textColor}
              />
              <span>{person.m_profile_expertise.join(', ')}</span>
            </div>
          )}
        </div>
      </PersonItemCardStyled.Content>
    </PersonItemCardStyled.Root>
  );
};

export default PersonItemCard;
