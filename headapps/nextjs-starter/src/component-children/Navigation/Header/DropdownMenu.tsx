import { LinkGQLType } from 'lib/types';
import { cn } from 'lib/helpers';
import { MenuItems } from './MenuItems';

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  megaMenu,
  display,
  className,
  onFirstItemTab,
  onLastItemTab,
}) => {
  return (
    <div
      data-component="DropdownMenu"
      className={cn(
        'secondary hidden min-w-30 transition-all duration-300 md:flex xl:min-w-40',
        !megaMenu &&
          'absolute left-0 top-full z-10 mt-7 -translate-y-1 border border-content/25 bg-surface px-4 text-content',
        display ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        className
      )}
      tabIndex={display ? undefined : -1}
      aria-hidden={!display}
    >
      <MenuItems
        items={items}
        onFirstItemTab={onFirstItemTab}
        onLastItemTab={onLastItemTab}
        disabled={!display}
      />
    </div>
  );
};

type DropdownMenuProps = {
  items: { link: LinkGQLType }[];
  megaMenu?: boolean;
  display?: boolean;
  className?: string;
  onFirstItemTab?: () => void;
  onLastItemTab?: () => void;
};
