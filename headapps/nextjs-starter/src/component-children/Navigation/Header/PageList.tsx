import { HeaderRenderingProps } from 'components/Navigation/Header/Header';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { LinksType, MegaMenuType, LinkGroupType, ClassNameProps, LinkGQLProps } from 'lib/types';
import Button from 'component-children/Shared/Button/Button';
import { cn, hasValidHref } from 'lib/helpers';
import { DropdownMenu } from './DropdownMenu';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { LinkGQLType } from 'lib/types';
import { Link } from '@sitecore-content-sdk/nextjs';
import { MegaMenu } from './MegaMenu';
import { useClickOutside } from 'lib/hooks/useClickOutside';

export const PageList: React.FC<PageListProps> = ({ rendering, itemClass, isMobile = false }) => {
  const [currentOpenMenu, setCurrentOpenMenu] = useState<string | null>(null);
  const linkListData = rendering?.data?.item?.links?.results;
  const pathname = usePathname();

  useEffect(() => {
    if (!currentOpenMenu) return;
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && setCurrentOpenMenu(null);
    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [currentOpenMenu]);

  useEffect(() => {
    setCurrentOpenMenu(null);
  }, [pathname]);

  const handleMenuChange = (id: string) => {
    setCurrentOpenMenu(id === currentOpenMenu ? null : id);
  };

  const ItemComponent = isMobile ? MobilePageItem : DesktopPageItem;

  return (
    <>
      {linkListData?.map((pagelink, idx) => {
        const pageLinkId = `${idx}-${pagelink?.link?.jsonValue?.value?.id}`;

        return (
          <ItemComponent
            key={idx}
            id={pageLinkId}
            open={currentOpenMenu === pageLinkId}
            handleMenuChange={handleMenuChange}
            className={itemClass}
            {...pagelink}
          />
        );
      })}
    </>
  );
};

const DesktopPageItem: React.FC<PageItemProps> = ({
  id,
  open,
  link,
  links,
  linkGroup,
  className,
  handleMegaMenu,
  handleMenuChange,
  displayName,
}) => {
  const hasLinks = !!links?.results?.length;
  const hasLinkGroup = !!linkGroup?.results?.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    handleMenuChange?.(id);
  };

  const handleClose = () => {
    handleMenuChange?.(null);
    handleMegaMenu?.(null);
  };

  useClickOutside([containerRef, dropdownRef], handleClose, open);

  const data = {
    id: id,
    items: {
      links: links,
      linkGroup: linkGroup,
    },
  };

  // Only hide if no href AND no children to display
  if (!link?.jsonValue?.value?.href && !hasLinks && !hasLinkGroup) return <></>;

  return (
    <>
      <div ref={containerRef} data-component="DesktopPageItem" className="relative hidden lg:flex">
        <PageItemButton
          className={cn(
            'no-underline',
            'after:absolute after:inset-0 after:top-full after:h-0.5 after:w-full after:transition-all after:duration-200 after:content-[""]',
            'hover:decoration-transparent',
            'hover:after:top-[calc(50%+0.6rem)] hover:after:bg-content',
            'group-hover:decoration-transparent',
            open && 'after:top-[calc(50%+0.6rem)] after:bg-content',
            !open && 'after:top-[calc(50%+0.8rem)] after:bg-transparent',
            className
          )}
          onClick={handleClick}
          link={!hasLinks && !hasLinkGroup ? link : undefined}
          linkText={link?.jsonValue?.value?.text || displayName}
          showChevron={hasLinkGroup || hasLinks}
          open={open}
        />
        {hasLinks && !hasLinkGroup && (
          <div ref={dropdownRef}>
            <DropdownMenu
              items={links?.results}
              display={open}
              onFirstItemTab={handleClose}
              onLastItemTab={handleClose}
            />
          </div>
        )}
        {hasLinkGroup && (
          <MegaMenu open={open} data={data} handleClose={handleClose} triggerRef={containerRef} />
        )}
      </div>
    </>
  );
};

const MobilePageItem: React.FC<PageItemProps> = ({
  id,
  open,
  link,
  links,
  linkGroup,
  className,
  handleMenuChange,
  displayName,
}) => {
  const hasLinks = links?.results && links?.results.length > 0;
  const hasLinkGroup = linkGroup?.results && linkGroup?.results.length > 0;

  // Only hide if no href AND no children to display
  if (!link?.jsonValue?.value?.href && !hasLinks && !hasLinkGroup) return <></>;

  return (
    <div
      data-component="MobilePageItem"
      className="relative flex w-full flex-col border-b-1 border-surface last:border-b-0 last:pb-5"
    >
      <PageItemButton
        className={cn(
          'copy-base flex w-full items-center justify-between px-8 py-4 font-bold no-underline',
          'hover:no-underline focus:no-underline',
          className
        )}
        onClick={() => handleMenuChange?.(id)}
        link={!hasLinks && !hasLinkGroup ? link : undefined}
        linkText={link?.jsonValue?.value?.text || displayName}
        showChevron={hasLinkGroup || hasLinks}
        open={open}
      />

      <div className={cn('px-8', open && 'border-t-4 border-content')}>
        <AccordionMotion isOpen={Boolean(open)}>
          {hasLinks &&
            links.results.map((item, index) => (
              <PageItemButton
                key={index}
                className={cn(
                  'copy-base w-full border-b-1 border-content py-4 font-bold no-underline',
                  'last:border-b-0',
                  'hover:no-underline',
                  'focus:no-underline',
                  className
                )}
                link={item.link}
                linkText={item.link?.jsonValue?.value?.text}
              />
            ))}

          {hasLinkGroup &&
            linkGroup?.results?.map((linkGroupItem, index) => (
              <div key={index} className="flex w-full flex-col">
                {hasValidHref(linkGroupItem.link) ? (
                  <Link
                    className={cn(
                      'copy-base border-b-1 border-content py-4 font-bold no-underline',
                      'hover:no-underline',
                      'focus:no-underline',
                      className
                    )}
                    field={linkGroupItem.link?.jsonValue}
                  />
                ) : (
                  <div
                    className={cn(
                      'copy-base border-b-1 border-primary py-4 font-bold no-underline',
                      className
                    )}
                  >
                    {linkGroupItem.displayName}
                  </div>
                )}
                {linkGroupItem.links.results.map((item, idx) => (
                  <PageItemButton
                    key={idx}
                    className={cn(
                      'py-2 no-underline',
                      'hover:no-underline',
                      'focus:no-underline',
                      className
                    )}
                    link={item.link}
                    linkText={item.link?.jsonValue?.value?.text}
                  />
                ))}
              </div>
            ))}
        </AccordionMotion>
      </div>
    </div>
  );
};

const PageItemButton: React.FC<PageItemButtonProps> = ({
  className,
  onClick,
  link,
  linkText,
  showChevron,
  open,
}) => {
  const icon = showChevron ? (open ? 'chevron-up' : 'chevron-down') : undefined;
  return (
    <Button
      className={className}
      onClick={onClick}
      link={link?.jsonValue}
      variant="link"
      iconRight={icon}
    >
      {linkText}
    </Button>
  );
};

type PageItemProps = {
  id: string;
  open?: boolean;
  links?: LinksType;
  linkGroup?: LinkGroupType;
  handleMegaMenu?: (data: MegaMenuType | null) => void;
  handleMenuChange?: (data: string | null) => void;
} & LinkGQLProps &
  ClassNameProps;

type PageItemButtonProps = {
  className?: string;
  onClick?: () => void;
  link?: LinkGQLType;
  linkText?: string;
  showChevron?: boolean;
  open?: boolean;
};

type PageListProps = HeaderRenderingProps &
  ClassNameProps & {
    itemClass?: string;
    currentOpenMenu?: string | null;
    setCurrentOpenMenu?: (data: string | null) => void;
    isMobile?: boolean;
  };
