# Open Graph Image TODO

## Required Image
Create an Open Graph image for social media sharing:

**File:** `/public/og-image.png`
**Size:** 1200 x 630 pixels (recommended)
**Format:** PNG or JPG

## Design Suggestions
- Include "Pokemon Type Calculator" branding
- Show type badges or type chart visual
- Use gradient colors (blue to purple) matching the site theme
- Include tagline: "Instant Weakness & Resistance Checker"
- Keep text large and readable (will be displayed small on social media)

## Tools to Create
- Canva (free templates available)
- Figma
- Photoshop
- Online OG image generators

## After Creating
Once the image is created and placed at `/public/og-image.png`, update the metadata in:
- `app/layout.tsx` - Add images array to openGraph and twitter
- `app/calculator/page.tsx` - Add images
- `app/battle-simulator/page.tsx` - Add images
- `app/types/page.tsx` - Add images
- `app/support/layout.tsx` - Add images

Example code to add:
```typescript
openGraph: {
  // ... existing fields
  images: [{
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Pokemon Type Calculator',
  }],
},
twitter: {
  // ... existing fields
  images: ['/og-image.png'],
},
```
