import { getDateRange } from 'lib/helpers/time-date-helper';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { IconFas } from '../Icon/Icon';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';

export const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  startDate,
  endDate,
  location,
  className,
  time,
}) => {
  const { t } = useTranslation();

  // Don't render if we don't have at least dates
  if (!startDate || !endDate) return <></>;

  // Handle location as string or array of strings
  let locationValue = '';
  if (Array.isArray(location)) {
    locationValue = location.join(', ');
  } else if (location) {
    locationValue = location;
  }

  const details = [
    {
      icon: 'calendar' as IconName,
      label: `${t('Date')}:`,
      value: getDateRange({
        startDate: startDate,
        endDate: endDate,
      }),
    },
    time
      ? {
          icon: 'clock' as IconName,
          label: `${t('Time')}:`,
          value: time,
        }
      : null,
    locationValue
      ? {
          icon: 'location-dot' as IconName,
          label: `${t('Location')}:`,
          value: locationValue,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className={cn('flex flex-col items-start justify-start gap-1', className)}>
      {details.map((detail, key) => {
        // We're using filter(Boolean) above, so detail will never be null here
        const detailObj = detail as { icon: IconName; value?: string; label: string };
        return (
          <IconLabelField
            key={key}
            icon={detailObj.icon}
            text={detailObj.value}
            label={detailObj.label}
          />
        );
      })}
    </div>
  );
};

export const IconLabelField: React.FC<IconLabelFieldProps> = ({ icon, text, label }) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;
  const displayText = isEditing ? text : `${label} ${text}`;
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <IconFas icon={icon} className="h-4 w-4" aria-hidden="true" />
      <p className="copy-sm">{displayText}</p>
    </div>
  );
};

type EventCardDetailsProps = {
  className?: string;
  startDate?: string;
  endDate?: string;
  location?: string | string[];
  time?: string;
};

type IconLabelFieldProps = {
  icon: IconName;
  text?: string;
  label: string;
};
