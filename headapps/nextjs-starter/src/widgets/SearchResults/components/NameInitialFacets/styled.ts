import { styled } from 'styled-components';

import {
  AccordionFacets,
  FacetItem,
  RangeFacet,
  SearchResultsAccordionFacets,
  SearchResultsFacetValueRange,
  theme,
} from '@sitecore-search/ui';

const AccordionItemCheckboxStyled = styled(AccordionFacets.ItemCheckbox)`
  all: unset;
  background-color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  flex: none;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 0px;
  cursor: pointer;
  &[data-state='checked'] {
    color: ${theme.vars.palette.primary.contrastText};
    background-color: ${theme.vars.palette.primary.main};
  }

  &:focus {
    border: solid 1px #ccc;
  }
`;

const AccordionItemToggleStyled = styled(AccordionFacets.ItemToggle)`
  all: unset;
  width: 40px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.vars.typography.fontSize1.fontSize};
  margin-right: ${theme.vars.spacing.s};

  &:focus {
    border: solid 1px ${theme.vars.palette.primary.main};
  }

  &[data-state='on'] {
    background-color: ${theme.vars.palette.primary.main};
    color: ${theme.vars.palette.primary.contrastText};
  }
`;

const AccordionItemCheckboxIndicatorStyled = styled(AccordionFacets.ItemCheckboxIndicator)`
  color: ${theme.vars.palette.primary.contrastText};
  width: 15px;
  height: 15px;
`;

const AccordionValueListStyled = styled(AccordionFacets.ValueList)`
  list-style: none;
  padding: 0;
  margin-top: 16px;
  li {
    padding: ${theme.vars.spacing.xs} 0;
    font-family: ${theme.vars.typography.fontFamilySystem};
    font-size: ${theme.vars.typography.fontSize};
  }

  &[data-orientation='horizontal'] {
    display: flex;
    flex-direction: row;
  }
`;

const AccordionItemCheckboxLabelStyled = styled(AccordionFacets.ItemLabel)`
  padding-left: 16px;
`;

const AccordionItemStyled = styled(FacetItem)`
  display: flex;
  align-items: center;
`;

const AccordionHeaderStyled = styled(AccordionFacets.Header)`
  display: flex;
  margin: 0;
`;
const AccordionTriggerStyled = styled(AccordionFacets.Trigger)`
  align-items: center;
  display: flex;
  color: ${theme.vars.palette.text.primary};
  font-size: ${theme.vars.typography.fontSize3.fontSize};
  font-family: ${theme.vars.typography.fontFamilySystem};
  font-weight: 600;
  padding: 0;
  justify-content: space-between;
  line-height: 1;
  flex: 1 1 0;
  background: none;
  border: none;
`;

const AccordionFacetsFacetStyled = styled(AccordionFacets.Facet)`
  border-bottom: solid 1px #000;
  margin-bottom: 16px;
  padding-bottom: 16px;
`;

const AccordionFacetsContentStyled = styled(AccordionFacets.Content)``;

const AccordionFacetsRootStyled = styled(SearchResultsAccordionFacets)``;

export const AccordionFacetsStyled = {
  Trigger: AccordionTriggerStyled,
  Header: AccordionHeaderStyled,
  Item: AccordionItemStyled,
  ItemCheckboxLabel: AccordionItemCheckboxLabelStyled,
  ValueList: AccordionValueListStyled,
  ItemCheckboxIndicator: AccordionItemCheckboxIndicatorStyled,
  ItemToggle: AccordionItemToggleStyled,
  ItemCheckbox: AccordionItemCheckboxStyled,
  Facet: AccordionFacetsFacetStyled,
  Root: AccordionFacetsRootStyled,
  Content: AccordionFacetsContentStyled,
};

const RangeFacetRootStyled = styled(SearchResultsFacetValueRange)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 20px;
  margin-bottom: ${theme.vars.spacing.l};
`;

const RangeFacetTrackStyled = styled(RangeFacet.Track)`
  background-color: ${theme.vars.palette.grey['400']};
  position: relative;
  flex-grow: 1;
  border-radius: 0px;
  height: 3px;
`;

const RangeFacetRangeStyled = styled(RangeFacet.Range)`
  position: absolute;
  background-color: ${theme.vars.palette.primary.main};
  border-radius: 0px;
  height: 100%;
`;

const indicatorStyles = `
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  box-shadow: 0 2px 10px grey;
  border-radius: 0px;
  font-family: 'Raleway', 'Helvetica Neue', Verdana, Arial, sans-serif;
  font-size: 10px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: ${theme.vars.palette.primary.main};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px grey;
  }

  span {
    position: absolute;
    left: 0;
    top: 30px;
    font-size: 14px;
    font-family: 'Raleway', 'Helvetica Neue', Verdana, Arial, sans-serif;
  }

  `;

const RangeFacetStartStyled = styled(RangeFacet.Start)`
  ${indicatorStyles}
`;
const RangeFacetEndStyled = styled(RangeFacet.End)`
  ${indicatorStyles}
`;

export const RangeFacetStyled = {
  Root: RangeFacetRootStyled,
  Track: RangeFacetTrackStyled,
  Range: RangeFacetRangeStyled,
  Start: RangeFacetStartStyled,
  End: RangeFacetEndStyled,
};
