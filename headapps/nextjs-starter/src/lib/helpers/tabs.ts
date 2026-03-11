// Tabs layout constants and types
export const TAB_LAYOUTS = {
  HORIZONTAL: 'horizontal',
  VERTICAL_LEFT: 'vertical-left',
  VERTICAL_RIGHT: 'vertical-right',
} as const;
export type TabsLayout = (typeof TAB_LAYOUTS)[keyof typeof TAB_LAYOUTS];
