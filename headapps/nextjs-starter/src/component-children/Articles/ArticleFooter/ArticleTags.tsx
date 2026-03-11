import { Text, Field } from '@sitecore-content-sdk/nextjs';
import Tag from 'component-children/Shared/Tag/Tag';
import { TagType, ThemeType } from 'lib/types';
import { useMemo } from 'react';
import { PRIMARY_THEME, SECONDARY_THEME, TERTIARY_THEME } from 'lib/const';

type ArticleTagsProps = {
  tags?: TagType[];
  tagsLabel: Field<string>;
  variant?: string;
  theme?: ThemeType;
};

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags, tagsLabel, theme }) => {
  const tagTheme = useMemo(() => {
    if (theme === PRIMARY_THEME || theme === TERTIARY_THEME) {
      return SECONDARY_THEME;
    }
    return PRIMARY_THEME;
  }, [theme]);
  return (
    <div
      data-component="ArticleTags"
      className="flex w-full flex-col items-center gap-4 pb-2 md:flex-row md:items-start"
    >
      <div className="flex flex-col gap-4">
        <Text className="heading-xl text-content" field={tagsLabel} tag="h3" />
        <div className="flex flex-wrap gap-4">
          {tags?.map((tag) => (
            <Tag theme={tagTheme} key={tag.name}>
              {tag.displayName}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleTags;
