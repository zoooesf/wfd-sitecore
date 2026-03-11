import { styled } from 'styled-components';

import { theme } from '@sitecore-search/ui';

export const RowStyled = styled.div`
  width: 100%;
  display: block;
`;

const Wrapper = styled.div``;

const MainArea = styled.div`
  color: ${theme.vars.palette.text.primary};
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-size: ${theme.vars.typography.fontSize};
  padding: 0 ${theme.vars.spacing.m};
  position: relative;
  padding: 0 ${theme.vars.spacing.m};
`;

const BottomArea = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GridStyled = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-flow: row;
`;

export const PageControlsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-size: ${theme.vars.typography.fontSize1.fontSize};
`;

export const NoResults = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SearchResultsLayout = {
  Wrapper,
  MainArea,
  NoResults,
  BottomArea,
};

// Sidebar and main content layout
export const MainLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 3.75rem;
  }
`;

// Sidebar container
export const SidebarContainer = styled.div`
  display: none; /* Hidden on mobile by default */
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    display: flex; /* Show on desktop */
    width: 25%;
    flex: none;
  }
`;

// Main content container
export const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex: 4;
  }
`;

// Container for the search results grid/list
export const ResultListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// List layout container
export const ListLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
`;
