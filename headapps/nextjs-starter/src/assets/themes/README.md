# Site-Based Theming System

This document explains how the site-based theming system works in the Next.js starter application, allowing different sites to have unique visual styles while maintaining a consistent design structure.

## How Theming Currently Works

### 1. Theme Detection
The system automatically detects the current site name from `pageProps.site.name` and applies the corresponding theme CSS module if it exists. This happens in `src/pages/_app.tsx`:

```typescript
const siteName = pageProps?.site?.name?.toLowerCase() || 'default';
const themeMap: Record<string, any> = {
  main: mainTheme,
  nonprofit: nonprofitTheme, // New nonprofit theme
};
const theme = themeMap[siteName] || null;
```

### 2. CSS Module Application
The selected theme is applied to the root div using CSS modules, or no theme class is applied if no site-specific theme exists:

```typescript
<div className={theme ? theme.vars : undefined}>
  {/* App content */}
</div>
```

### 3. CSS Custom Properties
Each theme defines CSS custom properties (variables) within a `.vars` class that override the default values from `global.scss`. If no site-specific theme exists, only the global styles are applied. The variables are applied at the component level, not globally.

## Current Theme Files

### `main.module.scss`
- **Site**: Main site theme
- **Colors**: Light blue palette (unique to main site)
- **Primary**: `rgb(173, 216, 230)` (light blue)
- **Secondary**: `rgb(100, 149, 237)` (cornflower blue)

### `nonprofit.module.scss` (NEW)
- **Site**: Nonprofit site theme
- **Colors**: Green palette (converted from red theme)
- **Primary**: `rgb(34, 207, 43)` (bright green) - converted from red `rgb(209, 47, 54)`
- **Secondary**: `rgb(0, 153, 0)` (dark green) - converted from red `rgb(153, 0, 0)`

## How to Create a New Site Theme

### 1. Create the Theme File
Create a new SCSS module file in the `themes` folder following the naming convention:
```
src/assets/themes/[sitename].module.scss
```

### 2. Define the Theme Structure
Use this template structure:

```scss
.vars {
  /* Main Colors - Customize these for your site */
  --next-primary: [R] [G] [B];    /* rgb(R,G,B) */
  --next-secondary: [R] [G] [B];  /* rgb(R,G,B) */
}
```

### 3. Register the Theme
Add your new theme to the `themeMap` in `src/pages/_app.tsx`:

```typescript
const themeMap: Record<string, ThemeModule> = {
  main: mainTheme,
  nonprofit: nonprofitTheme,
  [sitename]: sitenameTheme, // Add your new theme
};
```

### 4. Import the Theme
Add the import statement at the top of `_app.tsx`:

```typescript
import sitenameTheme from 'assets/themes/[sitename].module.scss';
```

## How to Edit SCSS Files

### 1. Modifying Existing Variables
To override existing CSS custom properties, simply change the values in your theme file:

```scss
.vars {
  --next-primary: 255 0 0;  /* Change to red */
  --next-secondary: 0 255 0; /* Change to green */
}
```

### 2. Adding New Variables
You can add custom variables that aren't defined in `global.scss`:

```scss
.vars {
  /* Existing variables */
  --next-primary: 173 216 230;
  
  /* New custom variables */
  --site-accent: 255 165 0;     /* Orange accent */
  --site-border-radius: 8px;    /* Custom border radius */
  --site-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3. Creating New CSS Classes
You can add custom CSS classes within your theme file:

```scss
.vars {
  --next-primary: 173 216 230;
}

/* Custom site-specific styles */
.custom-button {
  background-color: rgb(var(--next-primary));
  border-radius: var(--site-border-radius, 4px);
  box-shadow: var(--site-shadow);
}

.custom-card {
  background: white;
  border: 2px solid rgb(var(--next-primary));
  padding: 1rem;
}
```

## Best Practices

### 1. Variable Naming
- Use descriptive names for custom variables
- Prefix site-specific variables with `--site-` to avoid conflicts
- Follow the existing naming convention for consistency

### 2. Theme Inheritance
- If no site-specific theme exists, only global styles are applied
- Each theme should define all required variables independently
- Test your theme with and without site-specific themes to ensure proper fallback behavior

### 3. Color Conversion Guidelines
- Maintain brightness relationships when converting colors
- Consider accessibility and contrast ratios
- Document your color choices and reasoning
- Test colors in different lighting conditions

## Troubleshooting

### Theme Not Loading
- Check that the site name matches exactly (case-sensitive)
- Verify the theme file is imported and added to `themeMap`
- Check browser console for import errors

### Variables Not Working
- Ensure variables are defined within the `.vars` class
- Check that the theme is properly applied to the root div
- Verify variable names match exactly in your CSS

### Styling Conflicts
- Use more specific selectors for custom styles
- Avoid global CSS that might override theme variables
- Test with different site contexts to ensure isolation

### Color Issues
- Verify RGB values are in the correct format (space-separated)
- Check that color conversions maintain proper contrast ratios
- Test colors with accessibility tools
