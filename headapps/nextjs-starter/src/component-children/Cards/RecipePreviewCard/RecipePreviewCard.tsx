import React, { memo } from 'react';
import { NextImage, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { useImage } from 'lib/hooks/useImage';
import { RecipePageDataType } from 'lib/helpers/listing/recipe-listing';
import { ImageGQLType } from 'lib/types/graphql';
import type { QueryField } from 'lib/types/fields';

export type RecipeCardProps = {
  page: RecipePageDataType;
};

/**
 * Extracts and normalizes recipe display data from a RecipePageDataType object.
 * @param {RecipePageDataType} page - The recipe page data from the GraphQL query
 * @returns {{ title, prepTime, cookTime, image, imageMobile }} Normalized field values for rendering
 */
function extractRecipeData(page: RecipePageDataType) {
  const imageGQL = page?.image as ImageGQLType;
  const imageMobileGQL = page?.imageMobile as unknown as { jsonValue: ImageField };
  const headingField = page?.heading as QueryField;

  return {
    title: page?.title?.jsonValue?.value || headingField?.jsonValue?.value || page?.name || '',
    prepTime: page?.prepTime?.jsonValue?.value || '',
    cookTime: page?.cookTime?.jsonValue?.value || '',
    image: (imageGQL?.jsonValue ?? { value: undefined }) as ImageField,
    imageMobile: ((imageMobileGQL?.jsonValue || imageGQL?.jsonValue) ?? { value: undefined }) as ImageField,
  };
}

/**
 * Recipe preview card displaying recipe data from a Sitecore page query result.
 * @param {RecipeCardProps} props - Component props containing the recipe page data
 * @returns {JSX.Element | null} The rendered recipe card, or null if no page data provided
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ page }) => {
  const { contentAlignment, effectiveTheme } = useFrame();
  const { title, prepTime, cookTime, image, imageMobile } = extractRecipeData(page);
  const imageSrc = useImage({ image, imageMobile });

  if (!page) return null;

  return (
    <RecipeCardWrapper page={page}>
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <NextImage
          field={imageSrc}
          width={640}
          height={360}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <RecipeCardContent
        title={title}
        prepTime={prepTime}
        cookTime={cookTime}
        contentAlignment={contentAlignment}
        effectiveTheme={effectiveTheme}
      />
    </RecipeCardWrapper>
  );
};

/**
 * Horizontal layout variant of RecipeCard with the image on the left and content on the right.
 * @param {RecipeCardProps} props - Component props containing the recipe page data
 * @returns {JSX.Element | null} The rendered recipe card in a side-by-side layout, or null if no page data provided
 */
export const RecipeCardImageLeft: React.FC<RecipeCardProps> = ({ page }) => {
  const { contentAlignment, effectiveTheme } = useFrame();
  const { title, prepTime, cookTime, image, imageMobile } = extractRecipeData(page);
  const imageSrc = useImage({ image, imageMobile });

  if (!page) return null;

  return (
    <RecipeCardWrapper page={page} direction="row">
      <div className="relative w-40 shrink-0 self-stretch overflow-hidden rounded-lg">
        <NextImage
          field={imageSrc}
          width={320}
          height={320}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <RecipeCardContent
        title={title}
        prepTime={prepTime}
        cookTime={cookTime}
        contentAlignment={contentAlignment}
        effectiveTheme={effectiveTheme}
      />
    </RecipeCardWrapper>
  );
};

type RecipeCardContentProps = {
  title: string;
  prepTime: string;
  cookTime: string;
  contentAlignment?: string;
  effectiveTheme?: string;
};

const RecipeCardContent: React.FC<RecipeCardContentProps> = memo(
  ({ title, prepTime, cookTime, contentAlignment, effectiveTheme }) => (
    <div
      className={cn(
        'flex flex-grow flex-col justify-between gap-2 text-content',
        contentAlignment,
        effectiveTheme
      )}
    >
      {title && <h3 className="heading-lg text-content">{title}</h3>}
      <div className="flex flex-row gap-2">
        {prepTime && (
          <>
            <p className="font-bold">Prep Time:</p>
            <p className="copy-base text-content">{prepTime}</p>
          </>
        )}
        {cookTime && (
          <>
            <p className="font-bold">Cook Time:</p>
            <p className="copy-base text-content">{cookTime}</p>
          </>
        )}
      </div>
    </div>
  )
);
RecipeCardContent.displayName = 'RecipeCardContent';

type RecipeCardWrapperProps = {
  page: RecipePageDataType;
  children?: React.ReactNode;
  direction?: 'row' | 'col';
};

const RecipeCardWrapper: React.FC<RecipeCardWrapperProps> = ({ page, children, direction = 'col' }) => {
  const { effectiveTheme } = useFrame();
  const { page: sitecorePage } = useSitecore();
  const isEditing = sitecorePage?.mode.isEditing;
  const cardClasses = cn(
    'no-link-style group flex h-full w-full gap-4 rounded-lg p-1 bg-surface text-content',
    direction === 'row' ? 'flex-row' : 'flex-col',
    effectiveTheme
  );

  if (isEditing) {
    return (
      <div data-component="RecipeCard" className={cardClasses}>
        {children}
      </div>
    );
  }

  const href = page?.url?.path || '';

  return href ? (
    <Link data-component="RecipeCard" href={href} className={cardClasses}>
      {children}
    </Link>
  ) : (
    <div data-component="RecipeCard" className={cardClasses}>
      {children}
    </div>
  );
};

export default RecipeCard;
