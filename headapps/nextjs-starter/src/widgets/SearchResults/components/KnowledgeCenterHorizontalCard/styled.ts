import { styled } from 'styled-components';
import { ArticleCard, theme } from '@sitecore-search/ui';

const KnowledgeCenterHorizontalRootStyled = styled(ArticleCard.Root)`
  display: flex;
  box-sizing: border-box;
  position: relative;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  max-height: 200px;

  @media (max-width: 768px) {
    flex-direction: column;
    max-height: none;
  }
`;

const KnowledgeCenterHorizontalIconWrapperStyled = styled.div`
  overflow: hidden;
  flex: none;
  width: 25%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const KnowledgeCenterHorizontalIconStyled = styled.i`
  font-size: 32px;
  color: ${theme.vars.palette.grey['600']};

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const KnowledgeCenterHorizontalContentStyled = styled(ArticleCard.Content)`
  padding: 16px 16px 16px 0;
  flex-direction: column;
  display: flex;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const KnowledgeCenterHorizontalSubtitleStyled = styled(ArticleCard.Subtitle)`
  color: ${theme.vars.palette.text.secondary};
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-size: ${theme.vars.typography.fontSize3.fontSize};
  font-weight: ${theme.vars.typography.fontSize3.fontWeight};
  line-height: ${theme.vars.typography.fontSize3.lineHeight};
`;

const KnowledgeCenterHorizontalTitleStyled = styled(ArticleCard.Title)``;

const KnowledgeCenterHorizontalLinkStyled = styled.a`
  text-decoration: none;
  color: ${theme.vars.palette.primary.main};
  font-size: ${theme.vars.typography.fontSize4.fontSize};
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    text-decoration: underline;
  }
`;

const KnowledgeCenterHorizontalSpan = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const KnowledgeCenterHorizontalDescriptionStyled = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: ${theme.vars.typography.fontSize};
  line-height: 1.25rem;
`;

const KnowledgeCenterHorizontalFileTypeStyled = styled.span`
  background-color: ${theme.vars.palette.primary.main};
  color: white;
  padding: 4px 8px;
  border-radius: 0px;
  font-size: ${theme.vars.typography.fontSize1.fontSize};
  font-weight: 600;
  text-transform: uppercase;
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 10px;
`;

export const KnowledgeCenterHorizontalCardStyled = {
  Root: KnowledgeCenterHorizontalRootStyled,
  IconWrapper: KnowledgeCenterHorizontalIconWrapperStyled,
  Icon: KnowledgeCenterHorizontalIconStyled,
  Content: KnowledgeCenterHorizontalContentStyled,
  Title: KnowledgeCenterHorizontalTitleStyled,
  Link: KnowledgeCenterHorizontalLinkStyled,
  Span: KnowledgeCenterHorizontalSpan,
  Description: KnowledgeCenterHorizontalDescriptionStyled,
  Subtitle: KnowledgeCenterHorizontalSubtitleStyled,
  FileType: KnowledgeCenterHorizontalFileTypeStyled,
};
