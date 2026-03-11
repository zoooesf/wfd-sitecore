import { Image, Link as JSSLink } from '@sitecore-content-sdk/nextjs';
import { SponsorType } from 'lib/types';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';

type EventBodySponsorsProps = {
  sponsors: SponsorType[];
  className?: string;
};

type SponsorCardProps = {
  sponsor: SponsorType;
};

export const EventBodySponsors: React.FC<EventBodySponsorsProps> = ({ sponsors, className }) => {
  const { t } = useTranslation();

  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section
      className={cn('flex w-full flex-col gap-6 pb-md', className)}
      data-component="EventBodySponsors"
    >
      <div className="flex flex-col gap-2">
        <h2 className="heading-2xl lg:heading-3xl text-content">{t('Sponsors')}</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {sponsors
          .filter((sponsor) => sponsor && sponsor.fields)
          .map((sponsor, index) => (
            <SponsorCard key={sponsor.fields.contentName?.value || index} sponsor={sponsor} />
          ))}
      </div>
    </section>
  );
};

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor }) => {
  if (!sponsor?.fields) {
    return null;
  }

  const { contentName, logo, link } = sponsor.fields;
  const sponsorName = contentName?.value;
  const sponsorLogo = logo?.value;
  const sponsorLink = link;

  const cardContent = (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center border border-content/20 p-6',
        'min-h-30',
        sponsorLink?.value?.href && 'cursor-pointer'
      )}
    >
      {sponsorLogo?.src ? (
        <div className="flex flex-col items-center gap-2">
          <Image field={logo} className="h-30 max-w-full object-contain transition-opacity" />
        </div>
      ) : (
        <div className="flex h-auto items-center justify-center rounded bg-gray-100 px-3">
          <span className="copy-sm font-medium text-gray-600">{sponsorName}</span>
        </div>
      )}
    </div>
  );

  // If there's a link, wrap in JSS Link component
  if (sponsorLink?.value?.href) {
    return (
      <div className="sponsor-card">
        <JSSLink
          field={sponsorLink}
          className="block h-full w-full rounded-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {cardContent}
        </JSSLink>
      </div>
    );
  }

  // No link, just display the card
  return <div className="sponsor-card">{cardContent}</div>;
};

export default EventBodySponsors;
