import React from 'react';
import { NextImage, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from 'lib/helpers/classname';
import { useFrame } from 'lib/hooks/useFrame';
import { useImage } from 'lib/hooks/useImage';
import { CardProps } from 'components/Cards/Card/Card';
import { AwakeToggle } from 'component-children/Shared/Button/AwakeToggle';


const RecipePreviewCard: React.FC<CardProps> = ({ fields }) => {
  const { textColor: contentAlignment, effectiveTheme } = useFrame();
  const imageSrc = useImage(fields);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <NextImage
          field={imageSrc}
          width={640}
          height={360}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div
        className={cn(
          'flex flex-grow flex-col justify-between gap-2 bg-surface text-content',
          contentAlignment,
          effectiveTheme
        )}
      >
        <Text field={fields.title} tag="h3" className='heading-lg text-content'/>
        <p className='font-bold'>Servings:</p>
        <Text field={fields.servings} tag="p" className='copy-base text-content'/>
        <div className='flex flex-row gap-2'>
          <p className='font-bold'>Prep Time:</p>
        <Text field={fields.prepTime} tag="p" className='copy-base text-content'/>
      <p className='font-bold'>Cook Time:</p>
        <Text field={fields.cookTime} tag="p" className='copy-base text-content'/>
        </div>
        <AwakeToggle />
        <p className='font-bold'>Ingredients:</p>
        <RichText field={fields.ingredients} tag="p" className='copy-base text-content'/>
        <p className='font-bold'>Instructions:</p>
        <RichText field={fields.instructions} tag="p" className='copy-base text-content'/>
      </div>
    </div>
  );
};

// type CardWrapperProps = CardFieldsProps & RecipeFields & { children?: React.ReactNode };

export default RecipePreviewCard;
