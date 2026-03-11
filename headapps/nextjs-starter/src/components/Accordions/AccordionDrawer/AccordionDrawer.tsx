import { Field, RichTextField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Frame from 'component-children/Shared/Frame/Frame';
import { ComponentProps } from 'lib/component-props';
import AccordionDrawer from 'component-children/Accordions/AccordionDrawer/AccordionDrawer';

const AccordionDrawerDefault: React.FC<AccordionDrawerProps> = (props) => {
  return (
    <Frame params={props.params}>
      <AccordionDrawer {...props} />
    </Frame>
  );
};

type AccordionDrawerFields = {
  heading: Field<string>;
  body: RichTextField;
};

export type AccordionDrawerProps = ComponentProps & {
  fields: AccordionDrawerFields;
  id?: string;
};

export const Default = withDatasourceCheck()<AccordionDrawerProps>(AccordionDrawerDefault);
