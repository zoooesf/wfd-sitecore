# TIDAL SitecoreAI DEV

[Documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)

<!---
@TODO: Update to next version docs before release
-->

As of 2026-01-07, this project is using the following versions:

- Sitecore Content SDK: 1.3.2
- Sitecore Search: 3.0.0 (3.X)

## Storybook

### Testing all stories at once

In a first terminal window run:

```plaintext
npm run storybook
```

In a second terminal window run:

```plaintext
npm run test-storybook
```

## Customization

### .prettierrc

Added the following:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["clsx", "cn", "twMerge"]
}
```

### tsconfig.json

- Added new paths:

```json
"paths": {
  "dot-sitecore/*": [".sitecore/*"],
  "component-children/*": ["src/component-children/*"],
  "graphql/*": ["src/graphql/*"],
},
```

### .eslintrc

- Added the parser.
- Added storybook/recommended plugin.

```json
"parser": "@typescript-eslint/parser",
"extends": [
  "next",
  "next/core-web-vitals",
  "plugin:@typescript-eslint/recommended",
  "prettier",
  "plugin:prettier/recommended",
  "plugin:storybook/recommended"
],
```

### next-env.d.ts

When the Next.js development server starts, it modifies this file to:

- Add this line: `/// <reference path="./.next/types/routes.d.ts" />`
- Change the link on the last line to: `https://nextjs.org/docs/pages/api-reference/config/typescript`

Thus, we committed those changes.

## New files in root folder

- .env.local
- .env.local.tempalte
- chromatic.config.json
- codegen.ts
- Introduction.mdx
- postcss.config.js
- tailwind.config.js
