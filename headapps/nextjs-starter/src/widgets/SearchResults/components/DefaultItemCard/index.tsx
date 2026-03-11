import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { ArticleHorizontalCardStyled } from './styled';
import { cn, getHighlightedText, normalizeTitleText } from 'lib/helpers';
import { useFrame } from 'lib/hooks/useFrame';
import SearchResultLink from 'src/widgets/SearchResults/components/SearchResultLink';
import { SECONDARY_THEME } from 'lib/const';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

type DefaultItemCardProps = {
  result: Record<string, unknown> & {
    highlight?: {
      description?: string[];
    };
  };
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
};

const DefaultItemCard = ({ result, onItemClick, index }: DefaultItemCardProps) => {
  return (
    <Wrapper result={result} onItemClick={onItemClick} index={index}>
      <BodyContent result={result} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  result,
  onItemClick,
  index,
}: {
  children: React.ReactNode;
  result: Record<string, unknown>;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
}) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  if (isEditing || !onItemClick || index === undefined) {
    return <>{children}</>;
  }

  return (
    <SearchResultLink result={result} onItemClick={onItemClick} index={index}>
      {children}
    </SearchResultLink>
  );
};

const BodyContent = ({ result }: DefaultItemCardProps) => {
  const { effectiveTheme } = useFrame();
  const textColor = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-content';
  const type = (result.m_content_type as string) || 'Content';
  const title = normalizeTitleText((result.title as string) || (result.name as string));

  const ariaLabel = ['Read content', title && `: ${title}`].filter(Boolean).join('');
  const highlightedDescription = getHighlightedText(
    result.highlight?.description,
    result.description as string
  );

  return (
    <ArticleHorizontalCardStyled.Root
      key={result.id as string}
      data-component="DefaultItemCard"
      className="group h-full w-full border border-content/20"
      aria-label={ariaLabel}
    >
      <ArticleHorizontalCardStyled.Content className={cn('gap-3 p-4', textColor)}>
        <div className="copy-xs flex flex-row items-center gap-2">
          {type && <span>{type}</span>}
        </div>
        <p className="heading-lg block font-semibold group-hover:underline">{title}</p>
        {(result.description as string) && (
          <ArticleHorizontalCardStyled.Text className="line-clamp-3">
            <span dangerouslySetInnerHTML={{ __html: highlightedDescription }} />
          </ArticleHorizontalCardStyled.Text>
        )}
      </ArticleHorizontalCardStyled.Content>
    </ArticleHorizontalCardStyled.Root>
  );
};

export default DefaultItemCard;
