import { useSitecore, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import { TagType } from 'lib/types';
import { ARTICLE_VARIANTS } from 'lib/helpers/article-variants';
import { useFrame } from 'lib/hooks/useFrame';
import { cn } from 'lib/helpers/classname';
import ArticleTags from 'component-children/Articles/ArticleFooter/ArticleTags';
import ArticlePeopleProfile from 'component-children/Articles/ArticleFooter/ArticlePeopleProfile';
import { ProfileData } from 'component-children/Articles/ArticleFooter/ArticlePeopleProfile';
import { useTranslation } from 'lib/hooks/useTranslation';

export type ArticleFooterProps = ComponentProps & {
  fields: {
    tagsLabel: Field<string>;
  };
  variant?: string;
};

// Define route fields structure
interface RouteFields {
  profiles?: ProfileData[];
  SxaTags?: TagType[];
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ fields, variant }) => {
  const { page } = useSitecore();
  const { effectiveTheme } = useFrame();
  const isEditing = page?.mode.isEditing;
  const { t } = useTranslation();
  const routeFields = page?.layout?.sitecore?.route?.fields as RouteFields;
  const { profiles, SxaTags } = routeFields;

  const hasProfiles = profiles && profiles.length > 0;
  const hasTags = SxaTags && SxaTags.length > 0;

  // If no content to display
  if (!hasProfiles && !hasTags) {
    // Show message in editing mode
    if (isEditing) {
      return (
        <ContainedWrapper theme={effectiveTheme}>
          <div
            data-component="ArticleFooter"
            data-variant={variant || ARTICLE_VARIANTS.DEFAULT}
            data-theme={effectiveTheme}
            className={cn(
              'mx-auto flex flex-col gap-4 rounded-lg border-2 border-dashed p-8 text-center',
              effectiveTheme
            )}
          >
            <p className="text-sm">{t('No Tag and Profile')}</p>
          </div>
        </ContainedWrapper>
      );
    }
    // Return empty fragment in live/preview mode
    return <></>;
  }

  return (
    <ContainedWrapper>
      <div
        data-component="ArticleFooter"
        data-variant={variant || ARTICLE_VARIANTS.DEFAULT}
        data-theme={effectiveTheme}
        className={cn('mx-auto flex flex-col gap-10 lg:max-w-4xl', effectiveTheme)}
      >
        {hasTags && (
          <ArticleTags tags={SxaTags} tagsLabel={fields?.tagsLabel} theme={effectiveTheme} />
        )}
        {hasProfiles && <ArticlePeopleProfile people={profiles} />}
      </div>
    </ContainedWrapper>
  );
};

export default ArticleFooter;
