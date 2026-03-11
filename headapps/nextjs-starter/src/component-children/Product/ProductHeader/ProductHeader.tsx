import { ProductHeaderProps } from 'lib/types/components/Products/product-header';
import { ImageField, LinkField, NextImage, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { useFrame } from 'lib/hooks/useFrame';
import { useMemo } from 'react';
import { cn } from 'lib/helpers/classname';
import { useTranslation } from 'lib/hooks/useTranslation';
import { Button } from 'component-children/Shared/Button/Button';
import { TagType } from 'lib/types/page/metadata';
import Tag from 'component-children/Shared/Tag/Tag';
import { SECONDARY_THEME } from 'lib/const';

export const ProductHeader = ({ fields }: ProductHeaderProps) => {
  const { t } = useTranslation();
  const { contentAlignment, effectiveTheme } = useFrame();
  const componentContentAlignment = contentAlignment || 'items-start text-left';

  const tagClasses = useMemo(
    () =>
      cn(
        'copy-sm px-2 py-1 font-semibold text-surface',
        effectiveTheme === SECONDARY_THEME ? 'bg-tertiary' : 'bg-content'
      ),
    [effectiveTheme]
  );

  const tagTheme = useMemo(
    () => (effectiveTheme === SECONDARY_THEME ? 'secondary' : 'primary'),
    [effectiveTheme]
  );

  const containerClasses = useMemo(
    () =>
      cn(
        'flex h-full min-h-banner w-full justify-center bg-surface text-content',
        'flex-col-reverse gap-4 lg:flex-row-reverse lg:gap-0',
        effectiveTheme
      ),
    [effectiveTheme]
  );

  const contentClasses = useMemo(
    () =>
      cn(
        'flex flex-col gap-4 px-0 pb-0',
        'lg:mr-auto lg:max-w-half-outer-content lg:px-12 lg:pb-8',
        !fields?.image ? 'w-4/5' : 'w-full lg:w-1/2',
        componentContentAlignment
      ),
    [fields?.image, componentContentAlignment]
  );

  const buttonClasses = useMemo(
    () => cn('flex w-full gap-4', componentContentAlignment),
    [componentContentAlignment]
  );

  return (
    <>
      <section
        data-component="ProductHeader"
        data-theme={effectiveTheme}
        role="region"
        aria-label={fields?.productName?.value}
        className={containerClasses}
      >
        <div className={cn('mx-auto max-w-outer-content', contentClasses)}>
          <div className="flex flex-wrap gap-3">
            {fields?.SxaTags?.map((tag: TagType) => (
              <Tag key={tag.id} className={tagClasses} theme={tagTheme}>
                {tag.displayName}
              </Tag>
            ))}
          </div>
          <Text className="lg:heading-4xl heading-3xl" field={fields?.productName} tag="p" />
          <RichText className="copy-lg" field={fields?.productDescription} />
          {fields?.productSku?.value && (
            <p className="flex items-center gap-1">
              <span className="copy-base">{t('SKU:')}</span>
              <Text className="copy-base" field={fields?.productSku} tag="span" />
            </p>
          )}
          <div className={cn('flex flex-col md:flex-row', buttonClasses)}>
            <Button link={fields?.link as LinkField} />
            <Button link={fields?.link2 as LinkField} variant="outline" color="primary" />
          </div>
        </div>
        <div className="aspect-square h-full w-full lg:w-1/2">
          <NextImage
            field={fields?.image as ImageField}
            width={500}
            height={500}
            className="inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
      <hr className={cn('absolute bottom-0 left-0 w-full border-content/20')} />
    </>
  );
};

export default ProductHeader;
