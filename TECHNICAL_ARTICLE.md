# Building a Type Chart Calculator with Next.js 14: From Idea to Production

## Introduction

I recently launched [typematchup.org](https://typematchup.org) - a type effectiveness calculator for competitive gaming. In this article, I'll share my journey of building and deploying this project using Next.js 14, TypeScript, and Tailwind CSS.

**What I built:**
- Interactive 18×18 type effectiveness chart
- Dual-type weakness calculator
- Battle simulator with STAB calculations
- 26 statically generated pages

**Tech stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel (deployment)

**Live demo:** https://typematchup.org

---

## Why I Built This

I wanted to learn Next.js 14's new App Router while building something useful for the gaming community. Type effectiveness calculations can be complex, especially with dual-type combinations, so I saw an opportunity to create a clean, fast tool that handles all the edge cases.

---

## Project Setup

### Initializing the Project

```bash
npx create-next-app@latest type-chart-calculator --typescript --tailwind --app
cd type-chart-calculator
npm install
```

### Project Structure

```
type-chart-calculator/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── calculator/             # Dual-type calculator
│   ├── battle-simulator/       # Battle simulator
│   └── types/[type]/          # Dynamic type pages
├── components/
│   ├── TypeChart.tsx          # 18×18 matrix
│   ├── DualTypeCalculator.tsx
│   └── BattleSimulator.tsx
├── data/
│   ├── types.json             # Type definitions
│   ├── typeChart.json         # Offensive matchups
│   └── defensiveTypeChart.json # Defensive matchups
└── lib/
    ├── types.ts               # TypeScript types
    └── typeCalculations.ts    # Calculation logic
```

---

## Key Features Implementation

### 1. Type Effectiveness Chart (18×18 Matrix)

The core feature is an interactive chart showing all type matchups:

```typescript
// components/TypeChart.tsx
'use client';

import { TypeId } from '@/lib/types';
import { calculateMultiplier } from '@/lib/typeCalculations';

const ALL_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function TypeChart() {
  const getEffectivenessColor = (multiplier: number): string => {
    if (multiplier === 0) return 'bg-gray-400';
    if (multiplier >= 2) return 'bg-green-500';
    if (multiplier < 1) return 'bg-red-500';
    return 'bg-gray-200';
  };

  return (
    <table className="border-collapse">
      <thead>
        <tr>
          <th>ATK → DEF ↓</th>
          {ALL_TYPES.map(type => (
            <th key={type}>{type}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ALL_TYPES.map(defendingType => (
          <tr key={defendingType}>
            <th>{defendingType}</th>
            {ALL_TYPES.map(attackingType => {
              const multiplier = calculateMultiplier(
                attackingType,
                [defendingType]
              );
              return (
                <td
                  key={`${attackingType}-${defendingType}`}
                  className={getEffectivenessColor(multiplier)}
                >
                  {multiplier}×
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 2. Dual-Type Calculator

The calculator handles complex multiplier stacking:

```typescript
// lib/typeCalculations.ts
export function calculateDualTypeWeaknesses(
  type1: TypeId,
  type2?: TypeId
): DualTypeWeaknesses {
  const defendingTypes = type2 ? [type1, type2] : [type1];

  const result: DualTypeWeaknesses = {
    quadrupleWeak: [],    // 4× damage
    doubleWeak: [],       // 2× damage
    normal: [],           // 1× damage
    doubleResist: [],     // 0.5× damage
    quadrupleResist: [],  // 0.25× damage
    immune: []            // 0× damage
  };

  ALL_TYPES.forEach(attackingType => {
    const multiplier = calculateMultiplier(attackingType, defendingTypes);

    if (multiplier === 0) result.immune.push(attackingType);
    else if (multiplier === 0.25) result.quadrupleResist.push(attackingType);
    else if (multiplier === 0.5) result.doubleResist.push(attackingType);
    else if (multiplier === 1) result.normal.push(attackingType);
    else if (multiplier === 2) result.doubleWeak.push(attackingType);
    else if (multiplier === 4) result.quadrupleWeak.push(attackingType);
  });

  return result;
}
```

---

## Technical Challenges & Solutions

### Challenge 1: Async Params in Next.js 15+

**Problem:** Next.js 15+ requires dynamic route params to be awaited as Promises.

**Error:**
```
Type '{ type: string }' is not assignable to type 'Promise<{ type: string }>'
```

**Solution:**
```typescript
// app/types/[type]/page.tsx
export default async function TypePage({
  params
}: {
  params: Promise<{ type: string }>
}) {
  const { type: typeParam } = await params;
  const typeId = typeParam as TypeId;
  // ... rest of component
}
```

**Key takeaway:** Always await params in Next.js 15+ dynamic routes.

---

### Challenge 2: TypeScript Type Inference with JSON Imports

**Problem:** TypeScript couldn't infer types from imported JSON files.

**Error:**
```
Type 'string' is not assignable to type 'TypeId'
```

**Solution:**
```typescript
// lib/typeCalculations.ts
import { DefensiveTypeChart } from './types';
import defensiveTypeChartData from '@/data/defensiveTypeChart.json';

const defensiveTypeChart = defensiveTypeChartData as DefensiveTypeChart;
```

**Key takeaway:** Use type assertions for JSON imports to maintain type safety.

---

### Challenge 3: SEO Optimization for 26 Pages

**Problem:** Need unique metadata for 22+ pages (home, tools, 18 type pages).

**Solution 1: Dynamic Metadata**
```typescript
// app/types/[type]/page.tsx
export async function generateMetadata({
  params
}: {
  params: Promise<{ type: string }>
}): Promise<Metadata> {
  const { type: typeParam } = await params;
  const typeId = typeParam as TypeId;
  const type = typesData.types.find(t => t.id === typeId);

  return {
    title: `${type.name} Type Chart - Strengths, Weaknesses & Matchups`,
    description: `Complete ${type.name} type analysis: super effective against ${offensive.superEffective.join(', ')}. Weak to ${defensive.weakTo.join(', ')}.`,
    keywords: `${type.name} type, ${type.name} weakness, ${type.name} matchup`,
  };
}
```

**Solution 2: Static Generation**
```typescript
export async function generateStaticParams() {
  return ALL_TYPES.map(type => ({
    type: type,
  }));
}
```

**Solution 3: Dynamic Sitemap**
```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://typematchup.org';

  const typePages = ALL_TYPES.map(type => ({
    url: `${baseUrl}/types/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/calculator`, priority: 0.9 },
    ...typePages
  ];
}
```

**Key takeaway:** Use `generateStaticParams` for SSG and dynamic metadata for SEO.

---

## Deployment & Performance

### Vercel Deployment

Deploying to Vercel was straightforward:

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Or use Vercel CLI
vercel --prod
```

### Performance Results

All 26 pages are statically generated at build time:

```
Route (app)
┌ ○ /                          (Static)
├ ○ /calculator                (Static)
├ ○ /battle-simulator          (Static)
├ ○ /types                     (Static)
└ ● /types/[type]              (SSG)
  ├ /types/fire
  ├ /types/water
  └ [+16 more paths]
```

**Lighthouse Scores:**
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Core Web Vitals:**
- LCP: < 1.0s
- FID: < 50ms
- CLS: 0

---

## SEO Strategy

### 1. Technical SEO
- ✅ Unique metadata for all pages
- ✅ Dynamic sitemap.xml
- ✅ Robots.txt configuration
- ✅ Structured data (JSON-LD)
- ✅ Open Graph tags

### 2. Content Strategy
- 18 individual type pages with detailed information
- Internal linking between related types
- Descriptive URLs (`/types/fire` not `/types/1`)

### 3. Performance
- Static generation for instant loading
- Optimized images (SVG icons)
- Minimal JavaScript

---

## Lessons Learned

### What Went Well

1. **Next.js 14 App Router** - Server components and SSG work beautifully together
2. **TypeScript** - Caught many bugs during development
3. **Tailwind CSS** - Rapid UI development with consistent styling
4. **Vercel** - Zero-config deployment with automatic HTTPS and CDN

### What I'd Do Differently

1. **Start with tests** - Would add Jest/Testing Library from the beginning
2. **Component library** - Consider using Radix UI or shadcn/ui for complex components
3. **Analytics earlier** - Should have added Google Analytics on day 1

### Tips for Beginners

1. **Read the docs** - Next.js 14 docs are excellent, especially for App Router
2. **Use TypeScript** - The initial setup time pays off quickly
3. **Start simple** - Build MVP first, add features later
4. **Deploy early** - Get feedback from real users ASAP

---

## Results & Metrics

**After 2 days:**
- ✅ 26 pages deployed
- ✅ Submitted to Google Search Console
- ✅ Shared on Reddit, Hacker News, Indie Hackers
- ✅ Google Analytics integrated

**Expected growth:**
- Month 1: 100-500 visitors
- Month 3: 1,000-3,000 visitors
- Month 6: 5,000-10,000 visitors

---

## Future Plans

### Short-term (1-3 months)
- Add blog with strategy guides
- Implement team builder tool
- Add move database

### Long-term (6-12 months)
- User accounts and saved teams
- Mobile app (PWA)
- Community features

---

## Conclusion

Building this project taught me a lot about Next.js 14, TypeScript, and modern web development. The App Router is powerful once you understand its patterns, and the performance benefits of SSG are incredible.

**Key takeaways:**
- Next.js 14 App Router is production-ready
- TypeScript + Next.js = excellent DX
- Static generation = amazing performance
- Deploy early, iterate based on feedback

**Try it out:** https://typematchup.org

**Questions?** Drop a comment below! I'm happy to discuss the implementation details or help with similar projects.

---

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Deployment](https://vercel.com/docs)

---

*Built with ❤️ using Next.js, TypeScript, and Tailwind CSS*

#nextjs #typescript #webdev #react #tailwindcss
