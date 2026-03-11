import { useFrame } from 'lib/hooks/useFrame';
import { useTranslation } from 'lib/hooks/useTranslation';
import { ProductTechSpecsProps } from 'lib/types/components/Products/product-tech-specs';
import { useMemo } from 'react';
import { cn } from 'lib/helpers/classname';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { useProductAccordion, ACCORDION_IDS } from 'lib/hooks/product/useProductAccordion';
import { SECONDARY_THEME } from 'lib/const';

export const ProductTechSpecs = ({ fields }: ProductTechSpecsProps) => {
  const { page } = useSitecore();
  const editing = page?.mode.isEditing;
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const { isOpen, toggleAccordion } = useProductAccordion(ACCORDION_IDS.TECH_SPECS, editing);

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
      data-component="ProductTechSpecs"
      data-theme={effectiveTheme}
      role="region"
      aria-label="ProductTechSpecs"
    >
      {/* Mobile/Tablet: Accordion View (hidden on lg screens) */}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border-b-1 border-content/20 bg-surface text-content focus-within:ring-2 focus-within:ring-[rgb(var(--focus-ring))] focus-within:ring-offset-2 lg:hidden',
          effectiveTheme
        )}
      >
        <button
          data-component="ProductTechSpecsButton"
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--focus-ring))] focus-visible:ring-offset-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="product-tech-specs-content"
        >
          <p className="copy-2xl border-content/20 text-left font-semibold text-content">
            {t('Technical Specs')}
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
            id="product-tech-specs-content"
            className="mb-5 flex w-full flex-col gap-4 bg-surface lg:mb-0"
          >
            <ProductTechSpecsTable fields={fields} />
          </div>
        </AccordionMotion>
      </div>

      {/* Desktop: Expanded View (hidden on mobile/tablet) */}
      <div className="hidden lg:block">
        <p className="copy-2xl mb-6 border-b-1 border-content/20 pb-4 font-semibold">
          {t('Technical Specs')}
        </p>
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <ProductTechSpecsTable fields={fields} />
        </div>
      </div>
    </section>
  );
};

const ProductTechSpecsTable: React.FC<{
  fields: ProductTechSpecsProps['fields'];
}> = ({ fields }) => {
  const { t } = useTranslation();
  const productTechnicalSpecs = fields.productTechnicalSpecs?.value;

  const tableRowClasses = 'border-b border-content/20';
  const tableHeaderClasses = 'copy-base w-1/2 p-3 text-left font-semibold';
  const tableCellClasses = 'copy-base p-3';

  const techSpecsData = useMemo(() => {
    if (!productTechnicalSpecs) return [];

    try {
      const pairs = productTechnicalSpecs.split('&');

      return pairs.map((pair) => {
        const [parameter, encodedValue] = pair.split('=');
        const value = decodeURIComponent(encodedValue || '');

        return {
          parameter: parameter.trim(),
          value: value.trim(),
        };
      });
    } catch (error) {
      console.error('Error parsing technical specs:', error);
      return [];
    }
  }, [productTechnicalSpecs]);

  if (!techSpecsData.length) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[450px] table-auto border-collapse border border-content/20">
        <thead>
          <tr className={tableRowClasses}>
            <th className={cn(tableHeaderClasses)}>{t('Parameter')}</th>
            <th className={cn(tableHeaderClasses)}>{t('Value')}</th>
          </tr>
        </thead>
        <tbody>
          {techSpecsData.map((spec, index) => (
            <>
              {spec.value && (
                <tr key={index} className={tableRowClasses}>
                  <td className={cn(tableCellClasses)}>{spec.parameter}</td>
                  <td className={cn(tableCellClasses)}>{spec.value}</td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};
