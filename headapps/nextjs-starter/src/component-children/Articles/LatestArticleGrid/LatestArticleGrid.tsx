import React from 'react';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { TextCard, TextRow } from '../../Shared/Card/TextCard';
import { useContainer } from 'lib/hooks/useContainer';
import {
  LatestArticleGridFields,
  LatestArticleGridProps,
} from 'components/Articles/LatestArticleGrid/LatestArticleGrid';
import { Text } from '@sitecore-content-sdk/nextjs';
import { getPageCategories } from 'lib/helpers/page-category';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';

export const DefaultRendering: React.FC<LatestArticleGridProps> = (props) => {
  const { containerName } = useContainer();
  const { effectiveTheme } = useFrame();
  const themeClasses = cn('bg-surface text-content', effectiveTheme);

  if (containerName === 'ColumnSplitter')
    return <GridRendering {...props} max={4} className="grid grid-cols-1 gap-6 md:grid-cols-2" />;

  return (
    <ContainedWrapper className={themeClasses}>
      <GridRendering {...props} />
    </ContainedWrapper>
  );
};

export const VerticalListRendering: React.FC<LatestArticleGridProps> = ({
  fields,
  rendering,
  max = 3,
  variant,
}) => {
  const { containerName } = useContainer();
  const { effectiveTheme } = useFrame();
  const results = rendering?.data;

  const content = (
    <Wrapper fields={fields} variant={variant}>
      <div className="flex flex-col gap-8">
        {results.slice(0, max).map((article, index) => {
          if (!article) return null;
          const categoryData = getPageCategories(article?.pageCategory);
          const category = categoryData?.[0]?.fields?.pageCategory;
          const formattedFields = {
            ...article,
            heading: article.heading?.jsonValue,
            category: category,
          };

          return <TextRow key={index} fields={formattedFields} />;
        })}
      </div>
    </Wrapper>
  );

  // If inside ColumnSplitter, return content directly (no ContainedWrapper)
  if (containerName === 'ColumnSplitter') return content;

  // Otherwise, wrap in ContainedWrapper with dynamic theme
  return <ContainedWrapper theme={effectiveTheme}>{content}</ContainedWrapper>;
};

const GridRendering: React.FC<LatestArticleGridProps> = ({
  fields,
  rendering,
  max = 3,
  className = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
  variant,
}) => {
  const results = rendering?.data;

  return (
    <Wrapper fields={fields} variant={variant}>
      <div className={className}>
        {results.slice(0, max).map((article, index) => {
          if (!article) return null;
          const categoryData = getPageCategories(article?.pageCategory);
          const category = categoryData?.[0]?.fields?.pageCategory;
          const formattedFields = {
            ...article,
            heading: article.heading?.jsonValue,
            category: category,
          };

          return <TextCard key={index} fields={formattedFields} />;
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper: React.FC<WrapperProps> = ({ children, fields }) => {
  return (
    <div data-component="Wrapper" className="flex w-full flex-col gap-4 pb-8">
      <div className="mb-6 flex flex-row items-baseline gap-6">
        <Text tag="h2" field={fields?.heading} className="heading-4xl" />
      </div>
      {children}
    </div>
  );
};

type WrapperProps = {
  fields: LatestArticleGridFields;
  children?: React.ReactNode;
  variant?: string;
};
