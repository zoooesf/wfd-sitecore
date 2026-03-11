import { styled } from 'styled-components';
import { ArticleCard, theme } from '@sitecore-search/ui';

const KnowledgeCenterItemRootStyled = styled(ArticleCard.Root)`
  box-sizing: border-box;
  position: relative;
  border: ${theme.vars.border.width} solid ${theme.vars.palette.grey['400']};
  border-radius: ${theme.vars.border.radius};
  width: 100%;
  min-height: auto;
  display: flex;
  flex-direction: column;

  &:focus-within {
    border: solid 1px ${theme.vars.palette.primary.main};
  }
`;

const KnowledgeCenterItemIconWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 112px;
  width: 100%;
  border-top-left-radius: ${theme.vars.border.radius};
  border-top-right-radius: ${theme.vars.border.radius};
  position: relative;
`;

const KnowledgeCenterItemIconStyled = styled.i`
  font-size: 48px;
  color: ${theme.vars.palette.grey['600']};
`;

const KnowledgeCenterItemContentStyled = styled(ArticleCard.Content)`
  margin: 16px 5px;
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-size: ${theme.vars.typography.fontSize3.fontSize};
`;

const KnowledgeCenterItemTitleStyled = styled(ArticleCard.Title)``;

const KnowledgeCenterItemLinkStyled = styled.a`
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

const KnowledgeCenterItemSpan = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const KnowledgeCenterItemDescriptionStyled = styled.div`
  overflow: hidden;
  height: 50px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: ${theme.vars.typography.fontSize1.fontSize};
  line-height: ${theme.vars.typography.fontSize1.lineHeight};
`;

const KnowledgeCenterItemSubtitleStyled = styled(ArticleCard.Subtitle)`
  color: ${theme.vars.palette.text.primary};
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-size: ${theme.vars.typography.fontSize2.fontSize};
  font-weight: ${theme.vars.typography.fontSize3.fontWeight};
  line-height: ${theme.vars.typography.fontSize2.lineHeight};
  bottom: ${theme.vars.spacing.s};
`;

const KnowledgeCenterItemFileTypeStyled = styled.span`
  background-color: ${theme.vars.palette.primary.main};
  color: white;
  padding: 2px 8px;
  border-radius: 0px;
  font-size: ${theme.vars.typography.fontSize1.fontSize};
  font-weight: 600;
  text-transform: uppercase;
`;

export const KnowledgeCenterItemCardStyled = {
  Root: KnowledgeCenterItemRootStyled,
  IconWrapper: KnowledgeCenterItemIconWrapperStyled,
  Icon: KnowledgeCenterItemIconStyled,
  Content: KnowledgeCenterItemContentStyled,
  Title: KnowledgeCenterItemTitleStyled,
  Link: KnowledgeCenterItemLinkStyled,
  Span: KnowledgeCenterItemSpan,
  Description: KnowledgeCenterItemDescriptionStyled,
  Subtitle: KnowledgeCenterItemSubtitleStyled,
  FileType: KnowledgeCenterItemFileTypeStyled,
};
