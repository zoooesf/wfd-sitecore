import {
  ProductResourcesProps,
  ProductResourcesCardProps,
} from 'lib/types/components/Products/product-resources';
import { useTranslation } from 'lib/hooks/useTranslation';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { useMemo } from 'react';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import Tag from 'component-children/Shared/Tag/Tag';
import { useProductAccordion, ACCORDION_IDS } from 'lib/hooks/product/useProductAccordion';
import Button from 'component-children/Shared/Button/Button';
import { SECONDARY_THEME } from 'lib/const';

export const ProductResources = ({ fields }: ProductResourcesProps) => {
  const { page } = useSitecore();
  const editing = page?.mode.isEditing;
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const { isOpen, toggleAccordion } = useProductAccordion(ACCORDION_IDS.RESOURCES, editing);

  const buttonVariant = useMemo(
    () => (effectiveTheme === SECONDARY_THEME ? 'primary' : 'secondary'),
    [effectiveTheme]
  );

  const handleToggle = () => {
    toggleAccordion();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <section
      data-component="ProductResources"
      data-theme={effectiveTheme}
      role="region"
      aria-label="ProductResources"
    >
      {/* Mobile/Tablet: Accordion View (hidden on lg screens) */}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border-b-1 border-content/20 bg-surface text-content focus-within:ring-2 focus-within:ring-[rgb(var(--focus-ring))] focus-within:ring-offset-2 lg:hidden',
          effectiveTheme
        )}
      >
        <button
          data-component="ProductResourcesButton"
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--focus-ring))] focus-visible:ring-offset-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="product-resources-content"
        >
          <p className="copy-2xl border-content/20 text-left font-semibold text-content">
            {t('Resources & Applications')}
          </p>
          <ButtonIcon
            icon={isOpen ? 'chevron-up' : 'chevron-down'}
            label={isOpen ? t('Close') : t('Open')}
            iconPrefix="fas"
            className="reverse"
            withBackground={false}
            variant={buttonVariant}
          />
        </button>
        <AccordionMotion isOpen={isOpen || false}>
          <div
            id="product-resources-content"
            className="mb-5 flex w-full flex-col gap-4 bg-surface lg:mb-0"
          >
            {fields?.productResources?.map((resource, index) => (
              <ProductResourcesCard key={index} fields={resource} effectiveTheme={effectiveTheme} />
            ))}
          </div>
        </AccordionMotion>
      </div>

      {/* Desktop: Expanded View (hidden on mobile/tablet) */}
      <div className="hidden lg:block">
        <p className="copy-2xl mb-6 border-b-1 border-content/20 pb-4 font-semibold">
          {t('Resources & Applications')}
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields?.productResources?.map((resource, index) => (
            <ProductResourcesCard key={index} fields={resource} effectiveTheme={effectiveTheme} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductResourcesCard: React.FC<ProductResourcesCardProps> = ({ fields, effectiveTheme }) => {
  const { t } = useTranslation();
  const firstSxaTag = fields?.fields?.SxaTags?.[0];

  const tagClasses = 'copy-sm bg-transparent p-0 font-semibold text-content';

  const tagTheme = useMemo(
    () => (effectiveTheme === SECONDARY_THEME ? 'secondary' : 'primary'),
    [effectiveTheme]
  );

  return (
    <div className="flex h-full w-full flex-col gap-4 border border-content/20 bg-surface p-6">
      <div className="flex flex-wrap gap-3">
        {firstSxaTag && (
          <Tag className={tagClasses} theme={tagTheme}>
            {firstSxaTag.displayName}
          </Tag>
        )}
      </div>
      <p className="copy-base font-semibold">{fields?.name}</p>
      <Button
        link={{
          value: {
            href: `${fields?.url ?? ''}`,
            text: t('Learn More'),
          },
        }}
        variant="outline"
        className="text-content"
      />
    </div>
  );
};
