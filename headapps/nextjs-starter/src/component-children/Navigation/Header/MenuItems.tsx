import { Link } from '@sitecore-content-sdk/nextjs';
import { cn, hasValidHref } from 'lib/helpers';
import { LinkGQLType } from 'lib/types';

export const MenuItems: React.FC<MenuItemsProps> = ({
  items = [],
  simple,
  onFirstItemTab,
  onLastItemTab,
  disabled,
}) => {
  if (!items?.length) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent, isFirstItem: boolean, isLastItem: boolean) => {
    if (e.key === 'Tab') {
      if (isFirstItem && e.shiftKey) {
        onFirstItemTab?.();
      }

      if (isLastItem && !e.shiftKey) {
        onLastItemTab?.();
      }
    }
  };

  return (
    <ul data-component="MenuItems" className="flex w-full flex-col">
      {items?.map((item, index) => (
        <li
          key={index}
          className={cn('border-b border-content/25 last:border-b-0', {
            'border-b-0 py-2': simple,
            'py-4': !simple,
          })}
          onClick={handleClick}
        >
          {hasValidHref(item.link) ? (
            <Link
              field={item.link?.jsonValue}
              className={cn('text-content hover:underline', {
                'copy-sm': simple,
                'heading-sm h-6': !simple,
              })}
              onKeyDown={(e: React.KeyboardEvent) =>
                handleKeyDown(e, index === 0, index === items.length - 1)
              }
              tabIndex={disabled ? -1 : 0}
              aria-hidden={disabled}
            />
          ) : (
            <div
              className={cn({
                'copy-sm text-black': simple,
                'heading-sm h-6 text-black': !simple,
              })}
            >
              {item.displayName}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

type MenuItemsProps = {
  items: { link: LinkGQLType; displayName?: string }[];
  simple?: boolean;
  onFirstItemTab?: () => void;
  onLastItemTab?: () => void;
  disabled?: boolean;
};
