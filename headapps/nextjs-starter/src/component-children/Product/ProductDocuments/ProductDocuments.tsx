import {
  ProductDocumentsFields,
  ProductDocumentsProps,
  PDFFileType,
  PDFFileFields,
} from 'lib/types/components/Products/product-documents';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useTranslation } from 'lib/hooks/useTranslation';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { useMemo } from 'react';
import ButtonIcon from 'component-children/Shared/Button/ButtonIcon';
import { AccordionMotion } from 'component-children/Shared/Animation/AccordionMotion';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { useProductAccordion, ACCORDION_IDS } from 'lib/hooks/product/useProductAccordion';
import { Button } from 'component-children/Shared/Button/Button';
import { getFileIcon, getFileTypeDisplay, formatFileSize } from 'lib/helpers/file-utils';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { PRIMARY_THEME, SECONDARY_THEME } from 'lib/const';

export const ProductDocuments = ({ fields }: ProductDocumentsProps & ProductDocumentsFields) => {
  const { page } = useSitecore();
  const editing = page?.mode.isEditing;
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();
  const { isOpen, toggleAccordion } = useProductAccordion(ACCORDION_IDS.DOCUMENTS, editing);

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
      data-component="ProductDocuments"
      data-theme={effectiveTheme}
      role="region"
      aria-label="ProductDocuments"
    >
      {/* Mobile/Tablet: Accordion View (hidden on lg screens) */}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border-b-1 border-content/20 bg-surface text-content focus-within:ring-2 focus-within:ring-[rgb(var(--focus-ring))] focus-within:ring-offset-2 lg:hidden',
          effectiveTheme
        )}
      >
        <button
          data-component="ProductDocumentsButton"
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--focus-ring))] focus-visible:ring-offset-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="product-documents-content"
        >
          <p className="copy-2xl border-content/20 text-left font-semibold text-content">
            {t('Documentation & Downloads')}
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
            id="product-documents-content"
            className="mb-5 flex w-full flex-col gap-4 bg-surface lg:mb-0"
          >
            <ProductDocumentsList fields={fields} />
          </div>
        </AccordionMotion>
      </div>

      {/* Desktop: Expanded View (hidden on mobile/tablet) */}
      <div className="hidden lg:block">
        <p className="copy-2xl mb-6 border-b-1 border-content/20 pb-4 font-semibold">
          {t('Documentation & Downloads')}
        </p>
        <div className="flex w-full flex-col gap-4">
          <ProductDocumentsList fields={fields} />
        </div>
      </div>
    </section>
  );
};

const ProductDocumentsList: React.FC<{
  fields?: PDFFileType[];
}> = ({ fields }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {fields?.map((document: PDFFileType, index) => (
        <ProductDocumentCard key={index} document={document} />
      ))}
    </div>
  );
};

const ProductDocumentCard: React.FC<{ document: PDFFileType }> = ({ document }) => {
  const { t } = useTranslation();
  const { effectiveTheme } = useFrame();

  const buttonVariant = useMemo(
    () => (effectiveTheme === PRIMARY_THEME ? 'primary' : 'secondary'),
    [effectiveTheme]
  );

  const iconVariant = useMemo(
    () => (effectiveTheme === SECONDARY_THEME ? 'white' : 'default'),
    [effectiveTheme]
  );

  return (
    <>
      {document?.fields?.map((file: PDFFileFields, index) => (
        <div className="flex flex-col gap-2 rounded-lg border border-content/20 p-4" key={index}>
          <div className="relative flex h-full flex-col justify-between gap-4">
            <IconFas
              icon={getFileIcon(file.extension ?? '') as IconName}
              className="h-6 w-6"
              variant={iconVariant}
            />
            <div className="flex flex-col gap-2">
              <p className="copy-base font-bold">{file.title}</p>
              <p className="copy-base">{formatFileSize(Number(file.size ?? '0'))}</p>
            </div>
            <Button
              link={{
                value: {
                  href: `${file.url ?? ''}`,
                  text: t('Download'),
                  target: '_blank',
                },
              }}
              iconLeft="download"
              variant="outline"
              color={buttonVariant}
              className="w-full justify-center border-content/20 p-2 text-content"
            />
            <div className="align-center absolute right-0 top-0 flex w-fit items-center justify-center border border-content/20">
              <p className="copy-sm p-1 font-bold">{getFileTypeDisplay(file.extension ?? '')}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
