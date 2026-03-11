import { styled } from 'styled-components';
import { ArticleCard, theme } from '@sitecore-search/ui';
import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import SearchResultLink from '../SearchResultLink';

const ImageWrapperStyled = styled.div`
  overflow: hidden;
  width: 100%;
  border-top-left-radius: ${theme.vars.border.radius};
  border-top-right-radius: ${theme.vars.border.radius};

  /* Horizontal card specific styles */
  .article-horizontal-card & {
    width: 25%;
    border-radius: 0;
    border-top-left-radius: ${theme.vars.border.radius};
    border-bottom-left-radius: ${theme.vars.border.radius};

    @media (max-width: 480px) {
      width: 100%;
      border-radius: 0;
      border-top-left-radius: ${theme.vars.border.radius};
      border-top-right-radius: ${theme.vars.border.radius};
      border-bottom-left-radius: 0;
    }
  }

  /* Shrink image based on parent container width */
  @container (min-width: 800px) {
    .article-horizontal-card & {
      width: 22% !important;
      min-width: 22% !important;
      max-width: 22% !important;
    }
  }
  @container (min-width: 900px) {
    .article-horizontal-card & {
      width: 19% !important;
      min-width: 19% !important;
      max-width: 19% !important;
    }
  }
  @container (min-width: 1000px) {
    .article-horizontal-card & {
      width: 16% !important;
      min-width: 16% !important;
      max-width: 16% !important;
    }
  }
  @container (min-width: 1100px) {
    .article-horizontal-card & {
      width: 13% !important;
      min-width: 13% !important;
      max-width: 13% !important;
    }
  }
`;

const ArticleImageStyled = styled(ArticleCard.Image)`
  object-fit: cover;
  object-position: center;
  width: 100%;
`;

export type ArticleImageProps = {
  src: string;
  alt?: string;
  className?: string;
  result: Record<string, unknown>;
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
  openInNewWindow?: boolean;
};

const ArticleImage: React.FC<ArticleImageProps> = ({
  src,
  alt = '',
  className = 'search-card-image',
  result,
  onItemClick,
  index,
  openInNewWindow = false,
}) => {
  if (!src) {
    return null;
  }

  return (
    <ImageWrapperStyled className={className}>
      <SearchResultLink
        result={result}
        onItemClick={onItemClick}
        index={index}
        openInNewWindow={openInNewWindow}
        className="block overflow-hidden"
      >
        <ArticleImageStyled
          src={src}
          alt={alt}
          className="aspect-square h-auto w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </SearchResultLink>
    </ImageWrapperStyled>
  );
};

export default ArticleImage;
