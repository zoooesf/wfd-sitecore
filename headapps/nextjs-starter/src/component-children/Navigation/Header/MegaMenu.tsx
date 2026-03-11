import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { Link } from '@sitecore-content-sdk/nextjs';
import { cn, hasValidHref } from 'lib/helpers';
import { useClickOutside } from 'lib/hooks/useClickOutside';
import { MegaMenuType } from 'lib/types';
import { DropdownMenu } from './DropdownMenu';
import { MenuItems } from './MenuItems';

const getScrollbarWidth = () => {
  const hasVerticalScrollbar = document.documentElement.scrollHeight > window.innerHeight;
  return hasVerticalScrollbar ? window.innerWidth - document.documentElement.clientWidth : 0;
};

const calculateOverflow = (menuEl: HTMLElement) => {
  const scrollbarWidth = getScrollbarWidth();
  const container = menuEl.closest('.max-w-outer-content');
  const parentElement = menuEl.offsetParent as HTMLElement;

  if (!container || !parentElement) {
    const menuWidth = menuEl.offsetWidth;
    const menuLeft = menuEl.getBoundingClientRect().left;
    return {
      isOverflowing: menuLeft + menuWidth > window.innerWidth - scrollbarWidth,
      rightOffset: null,
    };
  }

  const containerRect = container.getBoundingClientRect();
  const parentRect = parentElement.getBoundingClientRect();
  const menuWidth = menuEl.offsetWidth;

  const parentCenter = parentRect.left + parentRect.width / 2;
  const centeredMenuRight = parentCenter + menuWidth / 2;
  const isOverflowing = centeredMenuRight > containerRect.right - scrollbarWidth;

  return {
    isOverflowing,
    rightOffset: isOverflowing ? parentRect.right - containerRect.right : null,
  };
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ open, data, handleClose, triggerRef }) => {
  const { links, linkGroup } = data.items;
  const hasLinks = Boolean(links?.results?.length);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [rightOffset, setRightOffset] = useState<number | null>(null);

  const refs = triggerRef ? [megaMenuRef, triggerRef] : [megaMenuRef];
  useClickOutside(refs, handleClose, open);

  useLayoutEffect(() => {
    if (!open) {
      setIsOverflowing(false);
      setRightOffset(null);
      return;
    }

    if (!megaMenuRef.current) return;

    const { isOverflowing, rightOffset } = calculateOverflow(megaMenuRef.current);
    setIsOverflowing(isOverflowing);
    setRightOffset(rightOffset);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent, closeOnShiftTab?: boolean) => {
    if (e.key === 'Tab' && e.shiftKey && closeOnShiftTab) handleClose();
  };

  return (
    <div
      ref={megaMenuRef}
      data-component="MegaMenu"
      role="dialog"
      aria-modal="true"
      className={cn(
        'absolute top-full z-60 mt-7 hidden -translate-y-1',
        !isOverflowing && 'left-1/2 -translate-x-1/2',
        open && 'lg:block'
      )}
      style={isOverflowing && rightOffset !== null ? { right: rightOffset } : undefined}
    >
      <div className="secondary flex max-w-fit items-start gap-10 border border-content/25 bg-surface p-4 text-content transition-all">
        {/* HEADER LINKS */}
        {hasLinks && (
          <DropdownMenu
            items={links?.results || []}
            megaMenu
            display
            className="w-full flex-grow"
            onFirstItemTab={handleClose}
          />
        )}

        {/* HEADER LINK GROUP */}
        {linkGroup?.results?.map((item, index) => {
          const isFirstItem = index === 0 && !hasLinks;
          const isLastItem = index === linkGroup.results.length - 1;

          return (
            <div key={index} className="w-full flex-grow">
              <div className="min-w-30 border-b border-content/25 py-4 xl:min-w-40">
                {hasValidHref(item.link) ? (
                  <Link
                    className="heading-sm text-content hover:underline"
                    field={item.link?.jsonValue}
                    onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, isFirstItem)}
                  />
                ) : (
                  <div className="heading-sm text-content">{item.displayName}</div>
                )}
              </div>
              {item?.links?.results && item.links.results.length > 0 && (
                <MenuItems
                  simple
                  items={item.links.results}
                  onLastItemTab={() => isLastItem && handleClose()}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type MegaMenuProps = {
  open?: boolean;
  data: MegaMenuType;
  handleClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
};
