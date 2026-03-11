import { styled } from 'styled-components';

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

// No results container
export const NoResultsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
