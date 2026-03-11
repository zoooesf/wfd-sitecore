import { cn } from 'lib/helpers/classname';
import { getFormattedDate } from 'lib/helpers/time-date-helper';

export const EventCardDateBlock: React.FC<EventCardFieldsProps> = ({
  dateTime,
  className,
  size = 'sm',
}) => {
  if (!dateTime) return null;

  const month = getFormattedDate(dateTime, { month: 'short' });
  const day = getFormattedDate(dateTime, { day: '2-digit' });

  return (
    <div
      className={cn(
        'flex aspect-square flex-shrink-0 flex-grow-0 flex-col items-center justify-center rounded-md bg-primary p-4 uppercase text-white',
        {
          'heading-base h-20 w-20': size === 'md',
          'heading-sm h-16 w-16': size !== 'md',
        },
        className
      )}
      aria-hidden="true"
    >
      <p>{month}</p>
      <p>{day}</p>
    </div>
  );
};

type EventCardFieldsProps = {
  className?: string;
  dateTime?: string;
  size?: 'sm' | 'md';
};
