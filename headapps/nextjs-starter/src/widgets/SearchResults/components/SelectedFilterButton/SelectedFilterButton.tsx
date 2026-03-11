import { IconFas } from 'component-children/Shared/Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { buildFacetLabel } from '../../../../lib/helpers/search/filter-label-helpers';
import { cn } from 'lib/helpers/classname';

type SelectedFilterButtonProps = {
  filter: Record<string, unknown>;
  onRemove: (filter: Record<string, unknown>) => void;
  className?: string;
};

export const SelectedFilterButton = ({
  filter,
  onRemove,
  className,
}: SelectedFilterButtonProps) => {
  return (
    <button
      key={`${filter.facetId}-${filter.facetValueId}`}
      onClick={() => onRemove(filter)}
      className={cn(
        'flex items-center gap-1 rounded-1 bg-content px-2 pb-0.5 pt-1',
        'text-surface transition-opacity duration-200',
        className
      )}
    >
      <span className="copy-sm">{buildFacetLabel(filter)}</span>
      <IconFas icon={'xmark' as IconName} className="w-2" color="text-surface" />
    </button>
  );
};
