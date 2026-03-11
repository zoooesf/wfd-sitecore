// .storybook/manager.js

import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'TIDAL Accelerator Storybook',
    brandUrl: 'https://www.getfishtank.com/',
    brandImage: '/Tidal-Main-Lockup-NoPadding.svg',
    brandTarget: '_self',
  }),
});
