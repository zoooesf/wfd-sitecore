import { styled, createGlobalStyle } from 'styled-components';

// Global styles for search results layout and responsive behavior
export const SearchResultsGlobalStyles = createGlobalStyle`
  /* Ensure article cards don't overflow horizontally */
  [data-component="SearchResultsGrid"] > div {
    min-width: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* Fix horizontal card layout overflow */
  [data-component="SearchResultsGrid"] .flex.flex-col.gap-6 > * {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
  }

  /* Ensure text content wraps properly */
  [data-component="SearchResultsGrid"] * {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    overflow-x: hidden;
  }
`;

// Main container for the search results
export const SearchResultsContainer = styled.div`
  margin: 0 auto;
  display: flex;
  max-width: var(--max-width-desktop-content, 1200px);
  flex-direction: column;
  gap: 2.5rem;
`;

// Container for the search results grid/list
export const ResultsGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// List layout container
export const ListLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
  min-width: 0;
`;

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
  display: none;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    display: flex;
    width: 25%;
    flex: none;
  }
`;

// Main content container
export const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// No results container
export const NoResultsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem 0;

  @media (min-width: 640px) {
    padding: 3rem 0;
  }

  p {
    font-size: 1.125rem;
    font-weight: 600;

    @media (min-width: 640px) {
      font-size: 1.25rem;
    }
  }
`;
