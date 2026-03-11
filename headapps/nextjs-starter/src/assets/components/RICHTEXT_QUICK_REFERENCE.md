# Rich Text Quick Reference

## TL;DR

Always use the `.richtext` class on `<RichText>` components:

```tsx
<RichText field={fields.body} className="richtext" />
```

## Font Weights

- **400** = Body copy, paragraphs, lists (default)
- **600** = Headings, bold text (font-semibold)

## Size Variations

```tsx
// Small (sidebars, footnotes)
<RichText field={fields.body} className="richtext richtext-sm" />

// Default (most content)
<RichText field={fields.body} className="richtext" />

// Large (featured content)
<RichText field={fields.body} className="richtext richtext-lg" />

// Extra Large (hero sections)
<RichText field={fields.body} className="richtext richtext-xl" />

// 2XL (statement pieces)
<RichText field={fields.body} className="richtext richtext-2xl" />
```

## Combining with Other Classes

```tsx
// With utility classes
<RichText field={fields.body} className="richtext w-full mb-8" />

// With theme classes (will auto-adapt)
<RichText field={fields.body} className={cn('richtext', themeClass)} />

// With size variations
<RichText field={fields.body} className="richtext richtext-lg max-w-4xl" />
```

## Common Patterns

### Standard Rich Text Component

```tsx
const MyComponent = ({ fields }) => (
  <div>
    <Text field={fields.heading} tag="h2" className="heading-3xl mb-4" />
    <RichText field={fields.body} className="richtext" />
  </div>
);
```

### Rich Text with Theme Support

```tsx
const MyComponent = ({ fields }) => {
  const { effectiveTheme } = useFrame();

  return (
    <Frame params={params}>
      <Wrapper theme={effectiveTheme}>
        <RichText field={fields.body} className={cn('richtext', effectiveTheme)} />
      </Wrapper>
    </Frame>
  );
};
```

### Rich Text in Card/Truncated Context

```tsx
<RichText field={fields.description} className={cn('richtext', isEditing ? '' : 'line-clamp-3')} />
```

## Supported HTML Elements

All standard HTML elements are styled:

- **Headings:** h1, h2, h3, h4, h5, h6
- **Text:** p, strong, em, u, s, mark, sub, sup
- **Lists:** ul, ol (with nested styles)
- **Links:** a (with hover states)
- **Images:** img, figure, figcaption
- **Tables:** table, thead, tbody, th, td
- **Blockquotes:** blockquote, cite
- **Code:** pre, code
- **Media:** iframe (responsive video embeds)
- **Misc:** hr, dl, dt, dd, details, summary

## Theme Adaptation

The `.richtext` class automatically adapts to these themes:

- `primary` — Cream background, dark text
- `secondary` — Dark background, light text
- `tertiary` — Light cream, dark text
- `white` — White background, dark text
- `black` — Black background, light text

## Accessibility Features

✓ Focus indicators on links  
✓ Semantic HTML structure  
✓ ARIA-friendly table markup  
✓ Alt text support for images  
✓ Keyboard navigation support

## What NOT to Do

❌ Don't use `prose` class (use `richtext` instead)

```tsx
// DON'T
<RichText field={fields.body} className="prose" />

// DO
<RichText field={fields.body} className="richtext" />
```

❌ Don't forget the class

```tsx
// DON'T
<RichText field={fields.body} />

// DO
<RichText field={fields.body} className="richtext" />
```

❌ Don't override font weights unless necessary

```tsx
// DON'T (breaks brand guidelines)
<RichText field={fields.body} className="richtext font-bold" />

// DO (let the richtext class handle it)
<RichText field={fields.body} className="richtext" />
```

## Need More Info?

See [RICHTEXT_GUIDE.md](./RICHTEXT_GUIDE.md) for comprehensive documentation.

---

**Last Updated:** October 2025

