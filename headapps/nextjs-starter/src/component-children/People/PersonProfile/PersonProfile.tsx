import { useMemo } from 'react';
import { Image, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { usePerson } from 'lib/contexts/person-context';
import { PersonMetadata } from './PersonMetadata';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers';
import { IconFas, IconFab, IconVariant } from 'component-children/Shared/Icon/Icon';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useAccordion, AccordionProvider } from 'lib/hooks/useAccordion';
import {
  AccordionSection,
  AccordionProps,
  ProfileGQL,
  ExpertiseTag,
  ProfileChildrenFolder,
} from 'lib/types/page/profile';
import EventCard from 'component-children/Shared/Event/EventCard';
import { ArticleCard } from 'component-children/Shared/Card/ArticleCard';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { TERTIARY_THEME } from 'lib/const';

const PersonProfileRendering: React.FC = () => {
  const { t } = useTranslation();
  const profile = usePerson();
  const { effectiveTheme } = useFrame();
  const iconColorTheme = useMemo(
    () => (effectiveTheme.charAt(0).toUpperCase() + effectiveTheme.slice(1)) as IconVariant,
    [effectiveTheme]
  );

  const sectionNames = useMemo(
    () => ({
      achievements: t('Achievements'),
      education: t('Education'),
      involvements: t('Involvements'),
      speakingEvents: t('Speaking Events'),
      recentArticles: t('Recent Articles'),
    }),
    [t]
  );

  if (!profile) {
    return null;
  }

  return (
    <>
      <PersonMetadata profileData={profile} />
      <ContainedWrapper theme={effectiveTheme}>
        <div data-component="PersonProfile" className="py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[32%_auto] lg:gap-16">
            <PersonProfileSidebar profile={profile} iconColorTheme={iconColorTheme} />
            <PersonProfileBiography
              profile={profile}
              effectiveTheme={effectiveTheme}
              sectionNames={sectionNames}
            />
          </div>
        </div>
      </ContainedWrapper>
    </>
  );
};

const PersonProfileSidebar: React.FC<{
  profile: ProfileGQL;
  iconColorTheme: IconVariant;
}> = ({ profile, iconColorTheme }) => {
  const { t } = useTranslation();

  const hasDesktopImage =
    profile.image &&
    profile.image?.jsonValue?.value?.src &&
    profile.image?.jsonValue?.value?.src !== '';
  const hasMobileImage =
    profile.imageMobile &&
    profile.imageMobile?.jsonValue?.value?.src &&
    profile.imageMobile?.jsonValue?.value?.src !== '';

  return (
    <div className="flex flex-col gap-8 md:sticky md:top-8 md:col-span-1 md:gap-12 md:self-start">
      <>
        {hasDesktopImage && (
          <div className={`overflow-hidden ${hasMobileImage ? 'hidden md:block' : 'block'}`}>
            <Image
              field={profile.image?.jsonValue}
              className="aspect-square h-auto w-full object-cover"
              alt={
                profile.image?.jsonValue?.value?.alt ||
                (profile.firstName?.value + ' ' + profile.lastName?.value).trim() ||
                profile.displayName ||
                t('Image')
              }
            />
          </div>
        )}
        {hasMobileImage && (
          <div className="block md:hidden">
            <Image
              field={profile.imageMobile?.jsonValue}
              className="aspect-square h-auto w-full object-cover"
              alt={
                profile.imageMobile?.jsonValue?.value?.alt ||
                (profile.firstName?.value + ' ' + profile.lastName?.value).trim() ||
                profile.displayName ||
                t('Image')
              }
            />
          </div>
        )}
      </>
      <div className="flex flex-col gap-4">
        <p className="copy-3xl font-bold">
          {(profile.firstName?.value + ' ' + profile.lastName?.value).trim() || profile.displayName}
        </p>
        {profile.role?.value && <p className="copy-lg font-semibold">{profile.role.value}</p>}

        {profile.expertise?.jsonValue && profile.expertise.jsonValue.length > 0 && (
          <p>
            {profile.expertise.jsonValue
              .map((item: ExpertiseTag) => item.fields.Title.value)
              .join(', ')}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <p className="copy-xl font-bold">{t('Contact Information')}</p>
        {profile.email?.value && (
          <div className="flex items-center gap-2">
            <IconFas icon="envelope" variant={iconColorTheme} className="h-4 w-4" />
            <a
              className="no-link-style break-all hover:underline"
              href={`mailto:${profile.email.value}`}
            >
              {profile.email.value}
            </a>
          </div>
        )}
        {profile.phone?.value && (
          <div className="flex items-center gap-2">
            <IconFas icon="phone" variant={iconColorTheme} className="h-4 w-4" />
            <a className="no-link-style hover:underline" href={`tel:${profile.phone.value}`}>
              {profile.phone.value}
            </a>
          </div>
        )}
        {profile.website?.jsonValue?.value?.href && (
          <div className="flex items-center gap-2">
            <a
              href={`${profile.website.jsonValue.value.href}`}
              target={`${profile.website.jsonValue.value.target}`}
              className="no-link-style hover:underline"
            >
              <div className="flex items-center gap-2" role="group" aria-label="">
                <IconFas icon="globe" variant={iconColorTheme} className="h-4 w-4" />
                <p>
                  {profile.website.jsonValue.value.text ?? profile.website.jsonValue.value.href}
                </p>
              </div>
            </a>
          </div>
        )}
        {profile.linkedInLink?.jsonValue?.value?.href && (
          <div className="flex items-center gap-2">
            <a
              href={`${profile.linkedInLink.jsonValue.value.href}`}
              target={`${profile.linkedInLink.jsonValue.value.target}`}
              className="no-link-style hover:underline"
            >
              <div className="flex items-center gap-2" role="group" aria-label="">
                <IconFab icon="linkedin-in" variant={iconColorTheme} className="h-4 w-4" />
                <p>
                  {profile.linkedInLink.jsonValue.value.text ??
                    profile.linkedInLink.jsonValue.value.href}
                </p>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const PersonProfileBiography: React.FC<{
  profile: ProfileGQL;
  effectiveTheme: string;
  sectionNames: {
    achievements: string;
    education: string;
    involvements: string;
    speakingEvents: string;
    recentArticles: string;
  };
}> = ({ profile, effectiveTheme, sectionNames }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <p className="text-2xl font-bold">{t('Biography')}</p>
      {profile.description?.value && profile.description.value !== '' && (
        <RichText field={profile.description} className="richtext richtext-lg max-w-none" />
      )}
      <AccordionProvider>
        <Accordion
          sections={[
            {
              id: sectionNames.achievements,
              title: { value: sectionNames.achievements },
              items: profile.children?.results?.find(
                (section: ProfileChildrenFolder) => section.name === sectionNames.achievements
              )?.children?.results,
              type: sectionNames.achievements,
            },
            {
              id: sectionNames.education,
              title: { value: sectionNames.education },
              items: profile.children?.results?.find(
                (section: ProfileChildrenFolder) => section.name === sectionNames.education
              )?.children?.results,
              type: sectionNames.education,
            },
            {
              id: sectionNames.involvements,
              title: { value: sectionNames.involvements },
              items: profile.children?.results?.find(
                (section: ProfileChildrenFolder) => section.name === sectionNames.involvements
              )?.children?.results,
              type: sectionNames.involvements,
            },
            ...(profile.events && profile.events.length > 0
              ? [
                  {
                    id: sectionNames.speakingEvents,
                    title: { value: sectionNames.speakingEvents },
                    events: profile.events,
                    type: sectionNames.speakingEvents,
                  },
                ]
              : []),
            ...(profile.articles && profile.articles.length > 0
              ? [
                  {
                    id: sectionNames.recentArticles,
                    title: { value: sectionNames.recentArticles },
                    articles: profile.articles,
                    type: sectionNames.recentArticles,
                  },
                ]
              : []),
          ]}
          effectiveTheme={effectiveTheme}
        />
      </AccordionProvider>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ sections, effectiveTheme }) => {
  const { toggleAccordion, isOpen } = useAccordion();
  const { t } = useTranslation();

  const renderItems = (section: AccordionSection) => {
    // Early return if section is null or undefined
    if (!section) return null;

    switch (section.type) {
      case t('Speaking Events'):
        if (!section.events || section.events.length === 0) return null;
        return (
          <div className="flex w-full flex-col gap-4">
            {section.events.map((event, index) => {
              if (!event) return null;
              const eventKey = typeof event.id === 'string' ? event.id : `event-${index}`;
              return <EventCard key={eventKey} event={event} horizontalBreakpoint="sm" />;
            })}
          </div>
        );

      case t('Recent Articles'):
        if (!section.articles || section.articles.length === 0) return null;
        return (
          <div className="flex flex-col gap-4">
            {section.articles.map((article, index) => {
              if (!article) return null;
              const articleKey = typeof article.id === 'string' ? article.id : `article-${index}`;
              return (
                <ArticleCard
                  key={articleKey}
                  fields={article}
                  variant={ARTICLE_VARIANTS.INSIGHTS}
                />
              );
            })}
          </div>
        );

      case t('Involvements'):
        if (!section.items || section.items.length === 0) return null;
        return (
          <div className="flex flex-col gap-4">
            {section.items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  `flex flex-col gap-2 border-l-2 py-2 pl-6 ${
                    effectiveTheme === TERTIARY_THEME ? 'border-secondary' : 'border-tertiary'
                  }`
                )}
              >
                {item.heading?.value && (
                  <Text field={item.heading} className="text-lg font-black" tag="p" />
                )}
                {item.description?.value && (
                  <RichText field={item.description} className="richtext max-w-none" tag="p" />
                )}
              </div>
            ))}
          </div>
        );

      default:
        if (!section.items || section.items.length === 0) return null;
        return (
          <div className="flex flex-col gap-4">
            {section.items.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                {item.description?.value && (
                  <RichText field={item.description} className="richtext max-w-none" tag="p" />
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, sectionIndex) => {
        // Check if section has content (items, events, or articles)
        const hasContent =
          (section.items && section.items.length > 0) ||
          (section.events && section.events.length > 0) ||
          (section.articles && section.articles.length > 0);

        if (!hasContent) {
          return null;
        }

        const accordionId = `${section.id}-accordion`;
        const isFirstSection = sectionIndex === 0;

        return (
          <div
            key={section.id}
            className={`${isFirstSection ? 'mt-6' : ''} ${
              isOpen(accordionId) ? '' : 'border-b border-content/50'
            }`}
          >
            <button
              className="flex w-full items-center justify-between py-4 text-left"
              onClick={() => toggleAccordion(accordionId)}
            >
              <Text field={section.title} className="text-2xl font-bold" tag="p" />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-200 ${
                  isOpen(accordionId) ? 'rotate-180' : ''
                }`}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOpen(accordionId) && (
              <div
                className={`border-t border-content/50 ${
                  section.type === 'involvements' ? 'py-6' : 'py-4'
                }`}
              >
                {renderItems(section)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PersonProfileRendering;
