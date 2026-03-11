import { styled } from 'styled-components';
import { ArticleCard, theme } from '@sitecore-search/ui';

const ProductItemRootStyled = styled(ArticleCard.Root)`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  min-height: 0;
  max-width: 100%;
  display: flex;
`;

const ProductItemIconWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 112px;
  width: 100%;
  border-top-left-radius: ${theme.vars.border.radius};
  border-top-right-radius: ${theme.vars.border.radius};
  position: relative;
`;

const ProductItemIconStyled = styled.i`
  font-size: 48px;
  color: ${theme.vars.palette.grey['600']};
`;

const ProductItemContentStyled = styled(ArticleCard.Content)`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductItemTitleStyled = styled(ArticleCard.Title)``;

const ProductItemLinkStyled = styled.a`
  text-decoration: none;
  color: ${theme.vars.palette.text.primary};
  font-size: ${theme.vars.typography.fontSize4.fontSize};
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    text-decoration: underline;
    outline-color: ${theme.vars.palette.grey['800']};
  }
`;

const ProductItemSpan = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const ProductItemDescriptionStyled = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: ${theme.vars.typography.fontSize1.fontSize};
  line-height: ${theme.vars.typography.fontSize1.lineHeight};
`;

const ProductItemSubtitleStyled = styled(ArticleCard.Subtitle)`
  color: ${theme.vars.palette.text.primary};
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-size: ${theme.vars.typography.fontSize2.fontSize};
  font-weight: ${theme.vars.typography.fontSize3.fontWeight};
  line-height: ${theme.vars.typography.fontSize2.lineHeight};
  bottom: ${theme.vars.spacing.s};
`;

const ProductItemFileTypeStyled = styled.span`
  background-color: ${theme.vars.palette.primary.main};
  color: white;
  padding: 2px 8px;
  border-radius: 0px;
  font-size: ${theme.vars.typography.fontSize1.fontSize};
  font-weight: 600;
  text-transform: uppercase;
`;

const ProductItemImageWrapper = styled.div`
  aspect-ratio: 1/1;
`;

const ProductItemImageStyled = styled(ArticleCard.Image)`
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

export const ProductCardStyled = {
  Root: ProductItemRootStyled,
  ImageWrapper: ProductItemImageWrapper,
  Image: ProductItemImageStyled,
  Icon: ProductItemIconStyled,
  IconWrapper: ProductItemIconWrapperStyled,
  Content: ProductItemContentStyled,
  Title: ProductItemTitleStyled,
  Link: ProductItemLinkStyled,
  Span: ProductItemSpan,
  Description: ProductItemDescriptionStyled,
  Subtitle: ProductItemSubtitleStyled,
  FileType: ProductItemFileTypeStyled,
};
