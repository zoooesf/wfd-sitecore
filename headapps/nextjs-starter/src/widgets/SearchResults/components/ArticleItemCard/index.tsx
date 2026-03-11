import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { useRouter } from 'next/router';
import { ArticleCardStyled } from './styled';
import { getHighlightedText, normalizeTitleText, formatDate, cn } from 'lib/helpers';
import { useFrame } from 'lib/hooks/useFrame';
import SearchResultLink from 'src/widgets/SearchResults/components/SearchResultLink';
import { IconFas } from 'component-children/Shared/Icon/Icon';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { mainLanguage } from 'lib/i18n/i18n-config';
import { SECONDARY_THEME } from 'lib/const';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

type ArticleCardItemCardProps = {
  article: Record<string, unknown> & {
    highlight?: {
      description?: string[];
    };
  };
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
};

const ArticleItemCard = ({ article, onItemClick, index }: ArticleCardItemCardProps) => {
  return (
    <Wrapper article={article} onItemClick={onItemClick} index={index}>
      <BodyContent article={article} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  article,
  onItemClick,
  index,
}: {
  children: React.ReactNode;
  article: Record<string, unknown>;
  onItemClick?: ActionProp<ItemClickedAction>;
  index?: number;
}) => {
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing;

  if (isEditing || !onItemClick || index === undefined) {
    return <>{children}</>;
  }

  return (
    <SearchResultLink result={article} onItemClick={onItemClick} index={index}>
      {children}
    </SearchResultLink>
  );
};

const BodyContent = ({ article }: ArticleCardItemCardProps) => {
  const router = useRouter();
  const { effectiveTheme } = useFrame();
  const textColor = effectiveTheme === SECONDARY_THEME ? 'text-tertiary' : 'text-content';
  const type = (article.m_content_type as string) || 'Content';
  const firstCategory = (article?.m_category as string[])?.[0];
  const title = normalizeTitleText((article.title as string) || (article.name as string));
  const formattedDate = formatDate(
    article.m_publisheddate as string,
    router.locale || mainLanguage
  );
  const profiles = (article.m_profiles as string[]) || [];
  const people = profiles.length > 0 ? profiles.join(', ') : '';
  const ariaLabel = [
    'Read article post',
    title && `: ${title}`,
    firstCategory && `, Category: ${firstCategory}`,
    people && `, People: ${people}`,
  ]
    .filter(Boolean)
    .join('');
  const highlightedDescription = getHighlightedText(
    article.highlight?.description,
    article.description as string
  );

  return (
    <ArticleCardStyled.Root
      key={article.id as string}
      data-component="ArticleItemCard"
      className="group h-full w-full border border-content/20"
      aria-label={ariaLabel}
    >
      <ArticleCardStyled.Content className={cn('w-full gap-3 p-4', textColor)}>
        <div className="copy-xs flex flex-row items-center gap-2">
          {type && <span>{type}</span>}
          {firstCategory && (
            <>
              {type && <span>|</span>}
              <span>{firstCategory}</span>
            </>
          )}
        </div>
        <p className="heading-lg block font-semibold group-hover:underline">{title}</p>
        {(article.description as string) && (
          <ArticleCardStyled.Text className="line-clamp-3">
            <span
              className="copy-sm"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          </ArticleCardStyled.Text>
        )}
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
          {people && (
            <div className="copy-xs flex gap-2">
              <IconFas
                icon={'user' as IconName}
                className="h-4 w-4 min-w-4"
                color={effectiveTheme}
              />
              <span>{people}</span>
            </div>
          )}

          {formattedDate && (
            <div className="copy-xs flex gap-2">
              <IconFas
                icon={'calendar' as IconName}
                className="h-4 w-4 min-w-4"
                color={effectiveTheme}
              />
              <time dateTime={article.m_publisheddate as string}>{formattedDate}</time>
            </div>
          )}
        </div>
      </ArticleCardStyled.Content>
    </ArticleCardStyled.Root>
  );
};

export default ArticleItemCard;
