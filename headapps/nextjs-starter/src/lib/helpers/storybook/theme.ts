import type { StoryContext } from '@storybook/nextjs';
import { PRIMARY_THEME } from 'lib/const';

const UNSET_STORYBOOK_THEME_VALUE = 'none';

export const getTheme = (context: StoryContext) => {
  let theme = context.globals.theme || PRIMARY_THEME;
  if (theme === UNSET_STORYBOOK_THEME_VALUE) {
    theme = PRIMARY_THEME;
  }
  return theme;
};
