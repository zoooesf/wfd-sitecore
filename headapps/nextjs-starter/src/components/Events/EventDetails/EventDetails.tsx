import {
  Field,
  LinkField,
  RichText,
  Text,
  useSitecore,
  withDatasourceCheck,
  NextImage,
  GetComponentServerProps,
} from '@sitecore-content-sdk/nextjs';
import Button from 'component-children/Shared/Button/Button';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import { EventRouteFieldsType, ProfileType } from 'lib/types';
import { getDateRange, isNullishDateTime } from 'lib/helpers/time-date-helper';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { SocialShare } from 'component-children/Shared/SocialShare/SocialShare';
import { EventMetadata } from 'component-children/Events/EventPage/EventMetadata';
import { useTranslation } from 'lib/hooks/useTranslation';
import { getLocationData } from 'lib/helpers/location';
import { EventBodySponsors } from 'component-children/Events/EventPage/EventBodySponsors';
import { pageEditCheck, getPeoplePageDisplayName, downloadICS } from 'lib/helpers';
import { mockProfile, mockSponsor } from 'lib/helpers/storybook/mock';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { EventBodyStaffProfile } from 'component-children/Events/EventPage/EventBodyStaffProfile';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { useFrame } from 'lib/hooks/useFrame';
import { SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

const EventDetailsDefault: React.FC<EventDetailsProps> = (props) => {
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as EventRouteFieldsType;

  return (
    <Frame params={props.params} componentName={props?.rendering?.componentName}>
      <EventMetadata routeFields={routeFields} />
      <EventDetails {...props} />
    </Frame>
  );
};

const EventDetails: React.FC<EventDetailsProps> = ({ fields, peoplePageDisplayName }) => {
  const { t } = useTranslation();
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields as unknown as EventRouteFieldsType;
  const {
    heading,
    subheading,
    startDate,
    endDate,
    location,
    eventTime,
    eventCost,
    body,
    profiles,
    sponsors,
    image,
  } = routeFields;
  const { effectiveTheme } = useFrame();

  const locationData = getLocationData(location);
  const locationText = locationData?.[0]?.fields?.contentName?.value;
  const [showStickyButton, setShowStickyButton] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const buttonColor = effectiveTheme === SECONDARY_THEME ? TERTIARY_THEME : SECONDARY_THEME;

  // Mobile sticky button observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyButton(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCalendar = () => {
    downloadICS({
      title: heading?.value || t('Event'),
      description: subheading?.value || '',
      location: locationText || '',
      startDate: startDate?.value || '',
      endDate: endDate?.value || startDate?.value || '',
    });
  };

  return (
    <>
      <ContainedWrapper>
        <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-4 lg:gap-12">
          {/* Left Sidebar - Event Details */}
          <aside
            ref={headerRef}
            data-component="EventDetails"
            className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-1 lg:h-fit lg:self-start"
          >
            <Text className="heading-3xl lg:heading-4xl" field={heading} tag="h1" />
            {subheading?.value && <RichText className="richtext text-base" field={subheading} />}

            <div className="flex flex-col gap-4">
              <EventDetailsInfo
                startDate={startDate?.value}
                endDate={endDate?.value}
                time={eventTime?.value}
                location={locationText}
                cost={eventCost?.value}
              />
            </div>

            <Button
              className="w-full justify-center text-center"
              link={fields?.link}
              variant="button"
              color={buttonColor}
            />

            <Button
              onClick={handleAddToCalendar}
              variant="outline"
              className="w-full justify-center border-2 py-2"
              color={effectiveTheme}
            >
              {t('Add to Calendar')}
            </Button>

            <SocialShare />
          </aside>

          {/* Right Content - Event Body */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            {image?.value?.src && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2 bg-gray-100">
                <NextImage field={image} fill className="object-cover" loading="eager" />
              </div>
            )}

            <RichText field={body} className="richtext richtext-h1-4xl w-full" />

            {pageEditCheck(
              page,
              profiles?.length ? (
                <EventBodyStaff
                  staff={profiles as ProfileType[]}
                  peoplePageDisplayName={peoplePageDisplayName}
                />
              ) : (
                <EventBodyStaff
                  staff={[mockProfile]}
                  peoplePageDisplayName={peoplePageDisplayName}
                />
              ),
              profiles?.length,
              <EventBodyStaff
                staff={profiles as ProfileType[]}
                peoplePageDisplayName={peoplePageDisplayName}
              />
            )}

            {pageEditCheck(
              page,
              <EventBodySponsors sponsors={sponsors?.length ? sponsors : [mockSponsor]} />,
              sponsors?.length,
              <EventBodySponsors sponsors={sponsors || []} />
            )}
          </div>
        </div>
      </ContainedWrapper>

      {/* Mobile Sticky Button */}
      {showStickyButton && (
        <div className="sticky bottom-0 left-0 right-0 z-50 border-t border-gray-300 bg-surface p-4 lg:hidden">
          <Button
            className="w-full justify-center text-center"
            link={fields?.link}
            variant={'button'}
          />
        </div>
      )}
    </>
  );
};

const EventDetailsInfo: React.FC<EventDetailsInfoProps> = ({
  startDate,
  endDate,
  location,
  time,
  cost,
}) => {
  const dateOptions = { dateStyle: 'long' as Intl.DateTimeFormatOptions['dateStyle'] };
  const { t } = useTranslation();
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const { effectiveTheme } = useFrame();

  const dateRange = getDateRange({
    startDate: startDate,
    endDate: endDate,
    options: dateOptions,
  });

  return (
    <>
      {(isEditing || !isNullishDateTime(startDate)) && (
        <div className="flex items-start gap-3">
          <IconFas icon="calendar" className="mt-1 h-5 w-5 flex-shrink-0" color={effectiveTheme} />
          <div className="flex flex-col gap-1">
            <p className="leading-5">{dateRange}</p>
            {time && <p className="text-sm">{time}</p>}
          </div>
        </div>
      )}

      {(isEditing || location) && (
        <div className="flex items-center gap-3">
          <IconFas icon="location-dot" className="h-5 w-5 flex-shrink-0" color={effectiveTheme} />
          <p className="leading-5">{location}</p>
        </div>
      )}

      {(isEditing || cost) && (
        <div className="flex items-center gap-3">
          <IconFas icon="ticket" className="h-5 w-5 flex-shrink-0" color={effectiveTheme} />
          <p className="leading-5">
            {t('Cost')}: {cost}
          </p>
        </div>
      )}
    </>
  );
};

type EventDetailsInfoProps = {
  startDate: string | undefined;
  endDate: string | undefined;
  time: string | undefined;
  location: string | undefined;
  cost: string | undefined;
};

const EventBodyStaff: React.FC<EventBodyStaffProps> = ({ staff, peoplePageDisplayName }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex flex-shrink-0 flex-col">
      <div className="flex pb-4">
        <h2 className="heading-2xl lg:heading-3xl text-content">{t('Speakers')}</h2>
      </div>
      <div className="grid w-fit grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {staff
          ?.filter((member) => member?.fields?.firstName?.value || member?.fields?.lastName?.value)
          .map((member) => {
            const fullName =
              `${member.fields.firstName.value} ${member.fields.lastName.value}`.trim();
            const profileSlug = `${member?.name?.toLowerCase().replace(/ /g, '-')}`;
            const userURL = `/${
              router.locale
            }/${peoplePageDisplayName?.toLowerCase()}/${profileSlug?.toLowerCase()}`;
            return <EventBodyStaffProfile key={fullName} profile={member} userURL={userURL} />;
          })}
      </div>
    </div>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (_, layoutData) => {
  const peoplePageDisplayName = await getPeoplePageDisplayName(
    layoutData.sitecore?.context?.language || mainLanguage
  );

  return {
    peoplePageDisplayName,
  };
};

type EventDetailsFields = {
  publishedLabel?: Field<string>;
  lastUpdatedLabel?: Field<string>;
  link?: LinkField;
};

type EventDetailsProps = ComponentProps & {
  fields: EventDetailsFields;
  peoplePageDisplayName: string;
};

type EventBodyStaffProps = {
  staff: ProfileType[];
  peoplePageDisplayName: string;
};

export const Default = withDatasourceCheck()<EventDetailsProps>(EventDetailsDefault);
