import {
  ProductOverviewProps,
  ProductOverviewCardProps,
} from 'lib/types/components/Products/product-overview';
import { RichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useTranslation } from 'lib/hooks/useTranslation';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { useMemo } from 'react';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { useProductAccordion, ACCORDION_IDS } from 'lib/hooks/product/useProductAccordion';
import { SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

export const ProductOverview = ({ fields }: ProductOverviewProps) => {
  const { page } = useSitecore();
  const editing = page?.mode.isEditing;
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const { isOpen, toggleAccordion } = useProductAccordion(ACCORDION_IDS.OVERVIEW, editing);

  const headingClasses = 'copy-lg font-semibold';

  const cardClasses = 'flex w-full flex-col gap-4 rounded-lg border-1 p-4 border-content/20';

  const richtextClasses = useMemo(
    () =>
      cn(
        'richtext [&.richtext_li::marker]:text-2xl',
        effectiveTheme === TERTIARY_THEME
          ? '[&.richtext_li::marker]:text-secondary'
          : '[&.richtext_li::marker]:text-tertiary'
      ),
    [effectiveTheme]
  );

  const buttonVariant = useMemo(
    () => (effectiveTheme === SECONDARY_THEME ? 'primary' : 'secondary'),
    [effectiveTheme]
  );

  const overviewSections = useMemo(
    () => [
      { field: fields?.productKeyBenefits, title: t('Key Benefits') },
      { field: fields?.productFeatures, title: t('Features') },
      { field: fields?.productApplications, title: t('Applications') },
    ],
    [fields, t]
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
      data-component="ProductOverview"
      data-theme={effectiveTheme}
      role="region"
      aria-label="ProductOverview"
    >
      {/* Mobile/Tablet: Accordion View (hidden on lg screens) */}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border-b-1 border-content/20 bg-surface text-content focus-within:ring-2 focus-within:ring-[rgb(var(--focus-ring))] focus-within:ring-offset-2 lg:hidden',
          effectiveTheme
        )}
      >
        <button
          data-component="ProductOverviewButton"
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--focus-ring))] focus-visible:ring-offset-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="product-overview-content"
        >
          <p className="copy-2xl border-content/20 text-left font-semibold text-content">
            {t('Overview')}
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
            id="product-overview-content"
            className="mb-5 flex w-full flex-col gap-4 bg-surface lg:mb-0"
          >
            {overviewSections?.map(({ field, title }, index) => (
              <ProductOverviewCard
                key={index}
                field={field}
                title={title}
                cardClasses={cardClasses}
                headingClasses={headingClasses}
                richtextClasses={richtextClasses}
              />
            ))}
          </div>
        </AccordionMotion>
      </div>

      {/* Desktop: Expanded View (hidden on mobile/tablet) */}
      <div className="hidden lg:block">
        <p className="copy-2xl mb-6 border-b-1 border-content/20 pb-4 font-semibold">
          {t('Overview')}
        </p>
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          {overviewSections?.map(({ field, title }, index) => (
            <ProductOverviewCard
              key={index}
              field={field}
              title={title}
              cardClasses={cardClasses}
              headingClasses={headingClasses}
              richtextClasses={richtextClasses}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductOverviewCard: React.FC<ProductOverviewCardProps> = ({
  field,
  title,
  cardClasses,
  headingClasses,
  richtextClasses,
}: ProductOverviewCardProps) => (
  <>
    {field?.value ? (
      <div className={cardClasses}>
        <p className={headingClasses}>{title}</p>
        <RichText field={field} className={richtextClasses} />
      </div>
    ) : (
      <RichText field={field} className={cn('w-full')} />
    )}
  </>
);
