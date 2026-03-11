import { Field, Text } from '@sitecore-content-sdk/nextjs';

export const EventCardHeader: React.FC<EventCardProps> = ({ heading, category }) => {
  if (!heading && !category) return <></>;

  return (
    <div className="flex flex-col items-start justify-start gap-2 pt-1">
      {category && (
        <Text editable={false} field={category} tag="span" className="heading-base uppercase" />
      )}
      {heading && <Text field={heading} tag="h3" className="heading-xl" />}
    </div>
  );
};

type EventCardProps = {
  heading?: Field<string>;
  category?: Field<string>;
};
