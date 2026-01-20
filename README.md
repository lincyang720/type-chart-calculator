# Type Chart Calculator

A comprehensive type effectiveness calculator and battle simulator built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Interactive Type Chart**: Complete 18×18 type effectiveness matrix
- **Dual Type Calculator**: Calculate weaknesses and resistances for any single or dual-type combination
- **Battle Simulator**: Simulate type matchups with STAB calculations
- **Individual Type Pages**: Detailed guides for all 18 types
- **SEO Optimized**: Full metadata, structured data, sitemap, and robots.txt
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd type-chart-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
type-chart-calculator/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page with type chart
│   ├── calculator/              # Dual type calculator page
│   ├── battle-simulator/        # Battle simulator page
│   ├── types/                   # Type pages
│   │   ├── page.tsx            # All types list
│   │   └── [type]/             # Dynamic type pages
│   ├── sitemap.ts              # Dynamic sitemap generation
│   └── robots.ts               # Robots.txt configuration
├── components/                  # React components
│   ├── TypeChart.tsx           # 18×18 type effectiveness matrix
│   ├── DualTypeCalculator.tsx  # Dual type calculator
│   ├── BattleSimulator.tsx     # Battle simulator
│   ├── TypeBadge.tsx           # Type badge component
│   └── SEO/                    # SEO components
│       └── JsonLd.tsx          # Structured data
├── data/                        # JSON data files
│   ├── types.json              # Type information
│   ├── typeChart.json          # Offensive type chart
│   └── defensiveTypeChart.json # Defensive type chart
├── lib/                         # Utility functions
│   ├── types.ts                # TypeScript type definitions
│   └── typeCalculations.ts     # Type calculation logic
└── styles/                      # Global styles
    └── globals.css             # Tailwind CSS imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Type Effectiveness

The calculator uses accurate type effectiveness data:

- **Super Effective (2×)**: Attacking type is strong against defending type
- **Not Very Effective (0.5×)**: Attacking type is weak against defending type
- **No Effect (0×)**: Attacking type cannot damage defending type
- **Normal (1×)**: Standard damage with no advantage or disadvantage

### Dual-Type Calculations

When facing dual-type opponents, multipliers stack multiplicatively:

- **4× damage**: Super effective against both types (2× × 2×)
- **2× damage**: Super effective against one type
- **1× damage**: Normal effectiveness or neutralized (2× × 0.5×)
- **0.5× damage**: Not very effective against one type
- **0.25× damage**: Not very effective against both types (0.5× × 0.5×)
- **0× damage**: Immune to at least one type

## SEO Features

- Unique meta titles and descriptions for all pages
- Open Graph and Twitter Card metadata
- Structured data (JSON-LD) for rich snippets
- Dynamic sitemap generation
- Robots.txt configuration
- Semantic HTML structure
- Fast loading times with Next.js optimization

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure your custom domain (e.g., typematchup.gg)
4. Deploy!

Vercel will automatically:
- Build and deploy your site
- Set up HTTPS
- Configure CDN
- Enable edge caching

### Environment Variables

No environment variables are required for basic functionality.

## Future Enhancements

- [ ] Blog system with MDX
- [ ] Team builder tool
- [ ] Move database
- [ ] Ability database
- [ ] User accounts and saved teams
- [ ] Dark mode
- [ ] Multi-language support
- [ ] PWA support
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Disclaimer

This is an unofficial fan-made tool. All type mechanics and data are based on game mechanics. This tool is for educational purposes only.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
