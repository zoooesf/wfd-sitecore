import * as Checkbox from '@radix-ui/react-checkbox';
import { styled } from 'styled-components';
import { theme } from '@sitecore-search/ui';

// Styled checkbox matching the facet checkboxes
const StyledCheckbox = styled(Checkbox.Root)`
  all: unset;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  flex: none;
  justify-content: center;
  border: 1px solid rgb(var(--text));
  border-radius: 0px;
  cursor: pointer;
  margin-top: 3px;
  &[data-state='checked'] {
    color: ${theme.vars.palette.primary.contrastText};
    background-color: ${theme.vars.palette.primary.main};
  }

  &:focus {
    border: solid 1px rgb(var(--text));
  }
`;

const StyledIndicator = styled(Checkbox.Indicator)`
  color: ${theme.vars.palette.primary.contrastText};
  width: 15px;
  height: 15px;
`;

export const PastEventsCheckboxStyled = {
  Checkbox: StyledCheckbox,
  Indicator: StyledIndicator,
};
