import {
  ProductOrderingInfoItemTableRowProps,
  ProductOrderingInfoProps,
  ProductOrderingInfoFields,
} from 'lib/types/components/Products/product-ordering-info';
import { RichText, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useTranslation } from 'lib/hooks/useTranslation';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { useMemo } from 'react';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { stripHtmlTags } from 'lib/helpers/text-helpers';
import { useProductAccordion, ACCORDION_IDS } from 'lib/hooks/product/useProductAccordion';
import { SECONDARY_THEME } from 'lib/const';

export const ProductOrderingInfo = ({ fields }: ProductOrderingInfoProps) => {
  const { page } = useSitecore();
  const editing = page?.mode.isEditing;
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const { isOpen, toggleAccordion } = useProductAccordion(ACCORDION_IDS.ORDERING_INFO, editing);

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
      data-component="ProductOrderingInfo"
      data-theme={effectiveTheme}
      role="region"
      aria-label="ProductOrderingInfo"
    >
      {/* Mobile/Tablet: Accordion View (hidden on lg screens) */}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border-b-1 border-content/20 bg-surface text-content focus-within:ring-2 focus-within:ring-[rgb(var(--focus-ring))] focus-within:ring-offset-2 lg:hidden',
          effectiveTheme
        )}
      >
        <button
          data-component="ProductOrderingInfoButton"
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--focus-ring))] focus-visible:ring-offset-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="product-ordering-info-content"
        >
          <p className="copy-2xl border-content/20 text-left font-semibold text-content">
            {t('Ordering Info')}
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
            id="product-ordering-info-content"
            className="mb-5 flex w-full flex-col gap-4 bg-surface lg:mb-0"
          >
            <ProductOrderingInfoTable fields={fields} />
          </div>
        </AccordionMotion>
      </div>

      {/* Desktop: Expanded View (hidden on mobile/tablet) */}
      <div className="hidden lg:block">
        <p className="copy-2xl mb-6 border-b-1 border-content/20 pb-4 font-semibold">
          {t('Ordering Info')}
        </p>
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <ProductOrderingInfoTable fields={fields} />
        </div>
      </div>
    </section>
  );
};

const ProductOrderingInfoTable: React.FC<{ fields?: ProductOrderingInfoFields }> = ({ fields }) => {
  const { t } = useTranslation();

  const tableRowClasses = 'border-b border-content/20';
  const tableHeaderClasses = 'copy-base w-1/3 p-3 text-left font-semibold';
  const tableCellClasses = 'copy-base p-3';

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] table-auto border-collapse border border-content/20">
        <thead>
          <tr className={tableRowClasses}>
            <th className={cn(tableHeaderClasses)}>{t('Part Number')}</th>
            <th className={cn(tableHeaderClasses)}>{t('Description')}</th>
            <th className={cn(tableHeaderClasses)}>{t('Lead Time')}</th>
          </tr>
        </thead>
        <tbody>
          {fields?.productOrderingInfo?.map((item, index) => (
            <OrderingInfoRow
              key={index}
              item={item}
              index={index}
              tableRowClasses={tableRowClasses}
              tableCellClasses={tableCellClasses}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrderingInfoRow: React.FC<ProductOrderingInfoItemTableRowProps> = ({
  item,
  index,
  tableRowClasses,
  tableCellClasses,
}) => {
  const { page } = useSitecore();
  const editing = page?.mode.isEditing;

  const hasAnyFieldValue =
    item?.fields?.partNumber?.value ||
    item?.fields?.description?.value ||
    item?.fields?.partLeadTime?.value;

  return (
    <>
      {editing ? (
        <>
          {hasAnyFieldValue && (
            <tr key={index} className={tableRowClasses}>
              <td className={cn(tableCellClasses)}>
                <Text field={item?.fields?.partNumber} />
              </td>
              <td className={tableCellClasses}>
                <RichText field={item?.fields?.description} />
              </td>
              <td className={tableCellClasses}>
                <Text field={item?.fields?.partLeadTime} />
              </td>
            </tr>
          )}
        </>
      ) : (
        <>
          {hasAnyFieldValue && (
            <tr key={index} className={tableRowClasses}>
              <td className={cn(tableCellClasses)}>
                <p>{item?.fields?.partNumber?.value}</p>
              </td>
              <td className={tableCellClasses}>
                <p>{stripHtmlTags(item?.fields?.description?.value ?? '')}</p>
              </td>
              <td className={tableCellClasses}>
                <p>{item?.fields?.partLeadTime?.value}</p>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
};
