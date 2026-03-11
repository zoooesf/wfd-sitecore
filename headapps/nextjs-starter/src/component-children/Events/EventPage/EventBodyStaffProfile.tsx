import { NextImage, RichText, Link } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { useFrame } from 'lib/hooks/useFrame';
import { useTranslation } from 'lib/hooks/useTranslation';
import { ProfileType } from 'lib/types';

const PROFILE_IMAGE_SIZE = 400;

type EventBodyStaffProfileProps = {
  profile: ProfileType;
  userURL: string;
};

export const EventBodyStaffProfile: React.FC<EventBodyStaffProfileProps> = ({
  profile,
  userURL,
}) => {
  const {
    firstName,
    lastName,
    role,
    image,
    imageMobile,
    company,
    description,
    location,
    expertise,
  } = profile.fields;
  const { effectiveTheme } = useFrame();
  const { t } = useTranslation();

  const profileName = `${firstName?.value} ${lastName?.value}`.trim();
  const displayName = profile.displayName || profileName;

  const desktopImageUrl = image?.value?.src;
  const mobileImageUrl = imageMobile?.value?.src;
  const desktopAlt = (image?.value?.alt as string) || profileName || t('Image');
  const mobileAlt = (imageMobile?.value?.alt as string) || profileName || t('Image');

  const computedDesktopImageUrl = desktopImageUrl || mobileImageUrl;
  const computedDesktopImageAlt = desktopImageUrl
    ? desktopAlt
    : mobileImageUrl
      ? mobileAlt
      : t('Image');

  const computedMobileImageUrl = mobileImageUrl || desktopImageUrl;
  const computedMobileImageAlt = mobileImageUrl
    ? mobileAlt
    : desktopImageUrl
      ? desktopAlt
      : t('Image');

  const ariaLabel = [t('View details'), displayName].filter(Boolean).join(' - ');

  // Handle location array - extract contentName.value from each location object
  const locationText =
    Array.isArray(location) && location.length > 0
      ? location
          .map((loc) => loc?.fields?.contentName?.value)
          .filter(Boolean)
          .join(', ')
      : '';

  // Handle expertise array - extract Title.value from each expertise object
  const expertiseText =
    Array.isArray(expertise) && expertise.length > 0
      ? expertise
          .map((exp) => exp?.fields?.Title?.value)
          .filter(Boolean)
          .join(', ')
      : '';

  return (
    <div
      data-component="EventBodyStaffProfile"
      className={`group flex h-full flex-col border border-content/20 ${effectiveTheme}`}
    >
      <Link
        field={{ value: { href: userURL, target: '_self' } }}
        className="flex h-full flex-col no-underline"
        aria-label={ariaLabel}
      >
        {/* Image Section */}
        {(desktopImageUrl || mobileImageUrl) && (
          <div className="aspect-square w-full">
            {/* Desktop breakpoint */}
            {desktopImageUrl && computedDesktopImageUrl && (
              <NextImage
                field={image}
                width={PROFILE_IMAGE_SIZE}
                height={PROFILE_IMAGE_SIZE}
                className="hidden h-full w-full object-cover md:block"
                alt={computedDesktopImageAlt}
                editable={false}
              />
            )}
            {/* Mobile breakpoint */}
            {mobileImageUrl && computedMobileImageUrl && (
              <NextImage
                field={imageMobile}
                width={PROFILE_IMAGE_SIZE}
                height={PROFILE_IMAGE_SIZE}
                className="block h-full w-full object-cover md:hidden"
                alt={computedMobileImageAlt}
                editable={false}
              />
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-3 bg-surface p-4 pt-6">
          {/* Name */}
          <span className="heading-lg block font-semibold text-content group-hover:underline">
            {displayName}
          </span>

          {/* Description */}
          {description?.value && (
            <div className="line-clamp-3">
              <RichText field={description} className="copy-sm text-content" editable={false} />
            </div>
          )}

          {/* Metadata Grid */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2">
              {role?.value && (
                <div className="copy-xs flex gap-2 text-content">
                  <IconFas
                    icon={'briefcase' as IconName}
                    className="h-4 w-4 min-w-4"
                    color={effectiveTheme}
                  />
                  <span>{role.value}</span>
                </div>
              )}
              {company?.value && (
                <div className="copy-xs flex gap-2 text-content">
                  <IconFas
                    icon={'building' as IconName}
                    className="h-4 w-4 min-w-4"
                    color={effectiveTheme}
                  />
                  <span>{company.value}</span>
                </div>
              )}
              {locationText && (
                <div className="copy-xs flex gap-2 text-content">
                  <IconFas
                    icon={'map-marker-alt' as IconName}
                    className="h-5 w-4 min-w-4"
                    color={effectiveTheme}
                  />
                  <span>{locationText}</span>
                </div>
              )}
            </div>
            {expertiseText && (
              <div className="copy-xs flex gap-2 text-content">
                <IconFas
                  icon={'lightbulb' as IconName}
                  className="h-5 w-4 min-w-4"
                  color={effectiveTheme}
                />
                <span>{expertiseText}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
