import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import Button from 'component-children/Shared/Button/Button';
import { useFrame } from 'lib/hooks/useFrame';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { cn } from 'lib/helpers/classname';
import { CTABlockProps } from 'components/Page Content/CTABlock/CTABlock';
import { PRIMARY_THEME, TERTIARY_THEME } from 'lib/const';

const CTABlock: React.FC<CTABlockProps> = ({ fields }) => {
  const { effectiveTheme } = useFrame();

  // Smart button color: light backgrounds get dark buttons, dark backgrounds get yellow buttons
  const buttonColor =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'secondary'
      : 'tertiary';

  const containerClasses = cn(
    'flex min-h-50 flex-col items-center gap-4 rounded-lg border-2 border-content bg-surface p-8 text-content',
    'md:flex-row',
    effectiveTheme
  );

  return (
    <ContainedWrapper theme={effectiveTheme}>
      <div className={containerClasses} data-component="CTABlock">
        <div className="md:max-w-content-block flex flex-1 flex-col gap-4 text-center md:text-left">
          <Text field={fields?.heading} tag="h2" className="heading-2xl" />
          <RichText field={fields?.body} className="richtext" />
        </div>
        <div className="flex items-center">
          <Button link={fields?.link} variant="button" color={buttonColor} />
        </div>
      </div>
    </ContainedWrapper>
  );
};

export default CTABlock;
