import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { ProductCardStyled } from './styled';
import {
  getHighlightedText,
  normalizeTitleText,
  cn,
  getCardImageWrapperClasses,
} from 'lib/helpers';
import { ProductModel } from '../../ProductSearch/types';
import SearchResultLink from 'src/widgets/SearchResults/components/SearchResultLink';
import { useFrame } from 'lib/hooks/useFrame';
import { TailwindBreakpoint } from 'lib/types';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { useTranslation } from 'lib/hooks/useTranslation';
import { SECONDARY_THEME } from 'lib/const';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

type ProductCardProps = {
  product: ProductModel;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
  horizontalBreakpoint?: TailwindBreakpoint;
};

const ProductCard = ({ product, onItemClick, index, horizontalBreakpoint }: ProductCardProps) => {
  return (
    <Wrapper
      product={product}
      onItemClick={onItemClick}
      index={index}
      horizontalBreakpoint={horizontalBreakpoint}
    >
      <BodyContent product={product} horizontalBreakpoint={horizontalBreakpoint} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  product,
  onItemClick,
  index,
}: {
  children: React.ReactNode;
  product: ProductModel;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
  horizontalBreakpoint?: TailwindBreakpoint;
}) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  if (isEditing || !onItemClick || index === undefined) {
    return <>{children}</>;
  }

  return (
    <SearchResultLink result={product} onItemClick={onItemClick} index={index}>
      {children}
    </SearchResultLink>
  );
};

const BodyContent = ({
  product,
  horizontalBreakpoint,
}: {
  product: ProductModel;
  horizontalBreakpoint?: TailwindBreakpoint;
}) => {
  const { effectiveTheme } = useFrame();
  const textColor = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-content';
  const { t } = useTranslation();
  if (!product) return null;

  const imageUrl = product?.image_url as string;

  const type = (product?.m_content_type as string) || 'Product';
  const title = normalizeTitleText((product?.m_product_name as string) || '');

  // Extract product category from m_keywords
  const productCategory = product?.m_productcategory?.join(', ');

  const ariaLabel = [t('View product'), title && `: ${title}`, type && `, Type: ${type}`]
    .filter(Boolean)
    .join('');

  // Determine if horizontal layout should be used
  const isHorizontal = !!horizontalBreakpoint;

  // Get dynamic image wrapper classes based on breakpoint
  const imageWrapperClasses = getCardImageWrapperClasses(horizontalBreakpoint);

  const flexDirectionClass = isHorizontal
    ? `flex-col ${horizontalBreakpoint}:flex-row`
    : 'flex-col';

  const contentPaddingClass = isHorizontal ? `py-4 pr-4 ${horizontalBreakpoint}:pl-8 pl-4` : 'p-4';

  const highlightedDescription = getHighlightedText(
    product?.highlight?.m_product_subheading,
    product?.m_product_subheading as string
  );

  return (
    <ProductCardStyled.Root
      key={product.id as string}
      data-component="ProductCard"
      className={cn('group h-full w-full border border-content/20', flexDirectionClass)}
      aria-label={ariaLabel}
    >
      {imageUrl && (
        <ProductCardStyled.ImageWrapper className={imageWrapperClasses}>
          <ProductCardStyled.Image src={imageUrl} alt={title} />
        </ProductCardStyled.ImageWrapper>
      )}
      <ProductCardStyled.Content className={cn('gap-3', textColor, contentPaddingClass)}>
        {type && <span className="copy-xs">{type}</span>}

        <p className="heading-lg block font-semibold group-hover:underline">{title}</p>

        {(product?.m_product_subheading as string) && (
          <ProductCardStyled.Description className="line-clamp-3">
            <span
              className="copy-sm"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          </ProductCardStyled.Description>
        )}
        <div className={cn('flex flex-col gap-2', !isHorizontal && 'mt-auto')}>
          {productCategory && (
            <div className="copy-xs flex items-center gap-2">
              <IconFas icon={'cube' as IconName} className="w-4 min-w-4" color={effectiveTheme} />
              <span>{productCategory}</span>
            </div>
          )}
        </div>
      </ProductCardStyled.Content>
    </ProductCardStyled.Root>
  );
};

export default ProductCard;
