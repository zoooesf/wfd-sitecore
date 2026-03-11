# Rich Text Formatting Guide

This guide explains how rich text fields are styled in the Sitecore XM Cloud project, including all supported HTML elements and CKEditor features.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Brand Guidelines](#brand-guidelines)
3. [Headings (H1-H6)](#headings-h1-h6)
4. [Text Formatting](#text-formatting)
5. [Lists](#lists)
6. [Links](#links)
7. [Images](#images)
8. [Tables](#tables)
9. [Blockquotes](#blockquotes)
10. [Code](#code)
11. [Horizontal Rules](#horizontal-rules)
12. [iFrames & Embeds](#iframes--embeds)
13. [Additional Elements](#additional-elements)
14. [Size Variations](#size-variations)
15. [Theme Support](#theme-support)

---

## Quick Start

All rich text content is automatically styled using the `.richtext` class, which applies the Tailwind CSS Typography plugin with custom brand styling.

**Basic usage:**
```tsx
import { RichText } from '@sitecore-content-sdk/nextjs';

<RichText field={fields.body} className="richtext" />
```

---

## Brand Guidelines

### Font Weights

- **400 weight** — Used for body copy (all paragraphs, lists, descriptions)
- **600 weight** — Used for headings, bold text, and emphasized statements

---

## Headings (H1-H6)

All headings use **600 weight** (font-semibold) per brand guidelines.

### H1 - Main Page Heading
- Desktop: 96px (text-6xl)
- Mobile: 48px (text-5xl)
- Example: "Your industry's unique — we get it"

### H2 - Major Section Heading
- Desktop: 60px (text-5xl)
- Mobile: 36px (text-4xl)
- Example: "Sitecore XM Cloud benefits"

### H3 - Subsection Heading
- Desktop: 48px (text-4xl)
- Mobile: 30px (text-3xl)
- Example: "Getting started with Tidal"

### H4 - Content Block Heading
- Desktop: 36px (text-3xl)
- Mobile: 24px (text-2xl)
- Example: "Installation and setup"

### H5 - Small Section Heading
- Desktop: 24px (text-2xl)
- Mobile: 20px (text-xl)
- Example: "Prerequisites"

### H6 - Smallest Heading
- Desktop: 20px (text-xl)
- Mobile: 18px (text-lg)
- Example: "Note"

---

## Text Formatting

### Bold / Strong
Uses **600 weight** per brand guidelines.
```html
<strong>This is bold text</strong>
<b>This is also bold</b>
```
**Result:** **This is bold text**

### Italic / Emphasis
```html
<em>This is italic text</em>
<i>This is also italic</i>
```
**Result:** *This is italic text*

### Strikethrough
```html
<s>This text is struck through</s>
<del>This text is deleted</del>
```
**Result:** ~~This text is struck through~~

### Underline
```html
<u>This text is underlined</u>
<ins>This text is inserted</ins>
```
**Result:** <u>This text is underlined</u>

### Highlight / Mark
```html
<mark>This text is highlighted</mark>
```
**Result:** Highlighted text with yellow background (adapts to dark themes)

### Subscript & Superscript
```html
H<sub>2</sub>O
E=mc<sup>2</sup>
```
**Result:** H₂O and E=mc²

### Small Text
```html
<small>This is smaller text</small>
```

---

## Lists

All list items use **400 weight** for body copy.

### Unordered Lists (Bullets)
```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

**Nested bullets:**
- Level 1: Disc (●)
- Level 2: Circle (○)
- Level 3: Square (■)

### Ordered Lists (Numbers)
```html
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
```

**Nested numbering:**
- Level 1: Decimal (1, 2, 3)
- Level 2: Lower alpha (a, b, c)
- Level 3: Lower roman (i, ii, iii)
- Level 4: Upper alpha (A, B, C)
- Level 5: Upper roman (I, II, III)

### Description Lists
```html
<dl>
  <dt>Term</dt>
  <dd>Definition or description</dd>
  <dt>Another term</dt>
  <dd>Another definition</dd>
</dl>
```

---

## Links

Links use brand primary color with hover states.

```html
<a href="/page">Link text</a>
```

**Styling:**
- Default: Primary brand color (#4833A7 or theme-specific)
- Hover: Secondary color with underline
- Focus: Outline ring for accessibility
- Font weight: 400

**Accessibility:** Links have visible focus indicators for keyboard navigation.

---

## Images

Images are automatically responsive and centered.

### Basic Image
```html
<img src="/image.jpg" alt="Description" />
```

**Styling:**
- Rounded corners
- Drop shadow
- Max-width: 100%
- Centered by default

### Image Alignment
```html
<!-- Left-aligned -->
<img src="/image.jpg" alt="Description" align="left" />

<!-- Right-aligned -->
<img src="/image.jpg" alt="Description" align="right" />
```

### Image with Caption
```html
<figure>
  <img src="/image.jpg" alt="Description" />
  <figcaption>Image caption goes here</figcaption>
</figure>
```

---

## Tables

Tables are fully styled with borders, hover states, and theme support.

```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

**Styling:**
- Headers: 600 weight, subtle background
- Body cells: 400 weight
- Row hover: Highlight effect
- Borders: Theme-aware colors
- Responsive: Horizontal scroll on small screens

---

## Blockquotes

Blockquotes have a left border accent in the primary brand color.

```html
<blockquote>
  <p>This is a quoted passage.</p>
  <cite>Author Name</cite>
</blockquote>
```

**Styling:**
- Left border: Primary color
- Italic text
- 400 weight
- Citation: Smaller, with "—" prefix

---

## Code

### Inline Code
```html
<p>Use the <code>className</code> prop.</p>
```

**Styling:**
- Monospace font
- Subtle background
- 400 weight
- Adapts to dark themes

### Code Blocks
```html
<pre><code>
function hello() {
  console.log("Hello, world!");
}
</code></pre>
```

**Styling:**
- Dark background (gray-900)
- Light text
- Syntax-ready
- Horizontal scroll for overflow
- Rounded corners and shadow

---

## Horizontal Rules

Horizontal rules create visual separators.

```html
<hr />
```

**Styling:**
- 2px border
- Theme-aware color
- Spacious margins

---

## iFrames & Embeds

### Standard iFrame
```html
<iframe src="https://example.com"></iframe>
```

### Video Embeds (YouTube, Vimeo)
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
```

**Auto-detected sources:**
- youtube.com
- vimeo.com
- youtu.be

**Styling:**
- 16:9 aspect ratio for videos
- Rounded corners
- Shadow
- Responsive width

### Responsive Wrapper (Optional)
```html
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
</div>
```

---

## Additional Elements

### Abbreviations
```html
<abbr title="HyperText Markup Language">HTML</abbr>
```
Shows tooltip on hover with dotted underline.

### Keyboard Input
```html
<kbd>Ctrl</kbd> + <kbd>C</kbd>
```
Styled like keyboard keys.

### Details / Summary (Collapsible)
```html
<details>
  <summary>Click to expand</summary>
  <p>Hidden content goes here.</p>
</details>
```

### Text Alignment
```html
<!-- Center-aligned -->
<p style="text-align: center">Centered text</p>

<!-- Right-aligned -->
<p style="text-align: right">Right-aligned text</p>

<!-- Justified -->
<p style="text-align: justify">Justified text</p>
```

---

## Size Variations

You can use different size variations for different contexts:

### Small (richtext-sm)
```tsx
<RichText field={fields.body} className="richtext richtext-sm" />
```
- Smaller headings and body text
- Good for sidebars, footnotes

### Default (richtext)
```tsx
<RichText field={fields.body} className="richtext" />
```
- Standard size for most content

### Large (richtext-lg)
```tsx
<RichText field={fields.body} className="richtext richtext-lg" />
```
- Larger headings and body text
- Good for featured content

### Extra Large (richtext-xl)
```tsx
<RichText field={fields.body} className="richtext richtext-xl" />
```
- Very large text
- Good for hero sections

### 2XL (richtext-2xl)
```tsx
<RichText field={fields.body} className="richtext richtext-2xl" />
```
- Largest size
- Good for statement pieces

---

## Theme Support

The rich text styling automatically adapts to your brand themes:

### Available Themes
- **Primary** — Cream background with dark text
- **Secondary** — Dark background with light text
- **Tertiary** — Light cream with dark text
- **White** — White background with dark text
- **Black** — Black background with light text

### Theme-Aware Elements

The following elements automatically adjust colors based on the theme:

- Text color
- Link colors
- Code blocks (inline)
- Table headers and rows
- Blockquote borders
- Mark/highlight backgrounds
- Keyboard input styling
- Details/summary sections

### Usage with Themes

```tsx
import { Frame } from '@/component-children/Foundation/Frame/Frame';

<Frame theme="primary">
  <RichText field={fields.body} className="richtext" />
</Frame>
```

The rich text content will automatically inherit the theme colors through CSS custom properties.

---

## Best Practices

### Content Editors

1. **Use sentence case for all headings**
2. **Don't overuse bold** — Reserve 600 weight for headings and key statements
3. **Use semantic HTML** — Use proper heading hierarchy (H1 → H2 → H3)
4. **Alt text for images** — Always provide descriptive alt text
5. **Accessible links** — Use descriptive link text (not "click here")
6. **Test on mobile** — Check how content looks on different screen sizes

### Developers

1. **Always use the `.richtext` class** on RichText components
2. **Don't override font weights** unless specifically needed
3. **Test all themes** — Verify content looks good on all theme variants
4. **Preserve accessibility** — Don't remove focus indicators
5. **Use size variations** when appropriate for context

---

## Technical Notes

- **Typography Plugin:** @tailwindcss/typography v0.5.16
- **Font Family:** PP Mori (custom font)
- **Base Font Size:** 16px (1rem)
- **Line Height:** Relaxed (1.625)
- **Color System:** CSS custom properties for theme support
- **Responsive:** Mobile-first breakpoints (sm, md, lg, xl, 2xl)

---

## Support

For questions or issues with rich text formatting:
- Check Storybook examples
- Review component implementation in `src/components`
- Consult `src/assets/components/richtext.scss` for detailed styles

---

**Last Updated:** October 2025
**Version:** 1.0

