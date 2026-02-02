# RelocationLogic.com

A data-driven Next.js application for career and relocation decisions. This site provides comprehensive salary information, tax calculations, and cost of living analysis across multiple cities and careers.

![Homepage](https://github.com/user-attachments/assets/5583db30-d15b-4b55-8ba3-b17d3082eb19)
![Salary Page](https://github.com/user-attachments/assets/13dae7a6-8242-4fc1-bc18-7f980d8a40aa)

## Features

- **100+ Programmatic Pages**: Automatically generated pages for every city × career combination
- **SEO Optimized**: Full metadata, structured data (JSON-LD), and sitemap generation
- **Static Site Generation (SSG)**: Pre-rendered pages for optimal performance
- **Incremental Static Regeneration (ISR)**: Automatic page updates every 24 hours
- **Comprehensive Tax Calculations**: Federal, state, local, and FICA taxes with 2024 brackets
- **Cost of Living Analysis**: Purchasing power comparisons across cities
- **Self-Hosted Ready**: Configured for cPanel/WHM Node hosting (no Vercel dependencies)
- **Ad-Ready Layouts**: Pre-built ad placement sections
- **TypeScript**: Full type safety throughout the application
- **App Router**: Next.js 16 with modern App Router architecture

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5
- **Runtime**: Node.js (self-hosted)
- **Rendering**: SSG + ISR (no edge runtime)
- **Data**: Static JSON files
- **Styling**: Custom CSS (no external UI libraries)

## Project Structure

```
relocationlogic/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Dynamic sitemap generator
│   ├── robots.ts                # Robots.txt configuration
│   └── salary/[cityId]/[careerId]/
│       └── page.tsx             # Dynamic salary pages (SSG)
├── data/
│   ├── cities.json              # City data (10 cities)
│   ├── careers.json             # Career data (10 careers)
│   └── (expand with more data)
├── lib/
│   ├── data.ts                  # Data loading utilities
│   └── metadata.ts              # SEO metadata generation
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   ├── taxCalculator.ts         # Tax calculation logic
│   └── costOfLiving.ts          # COL calculation logic
├── next.config.ts               # Next.js configuration (self-hosted)
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jameson5555/relocationlogic.git
cd relocationlogic

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

- **Dev Server**: `npm run dev` - Starts at http://localhost:3000
- **Build**: `npm run build` - Creates optimized production build
- **Start**: `npm start` - Runs production build
- **Lint**: `npm run lint` - Runs ESLint

## Configuration

### Self-Hosted Deployment (cPanel/WHM)

The application is configured for self-hosted Node.js environments:

```typescript
// next.config.ts
{
  output: 'standalone',  // Generates self-contained output
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true
}
```

### Deployment Steps for cPanel/WHM

1. Build the application: `npm run build`
2. Upload `.next/standalone` directory to your server
3. Upload `public` and `.next/static` folders
4. Set up Node.js app in cPanel pointing to `server.js`
5. Configure environment variables if needed
6. Start the application

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Override base URL for sitemap/metadata
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Data Management

### Adding Cities

Edit `data/cities.json`:

```json
{
  "id": "city-state",
  "name": "City Name",
  "state": "State Name",
  "stateCode": "ST",
  "population": 1000000,
  "medianHomePrice": 500000,
  "costOfLivingIndex": 120.0,
  "stateTaxRate": 5.0,
  "localTaxRate": 1.0,
  "salesTaxRate": 7.0,
  "averageRent": 2000,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Adding Careers

Edit `data/careers.json`:

```json
{
  "id": "career-slug",
  "title": "Career Title",
  "category": "Category",
  "description": "Career description",
  "medianSalary": 100000,
  "salaryRange": {
    "min": 70000,
    "max": 150000
  },
  "growthRate": 10,
  "requiredEducation": "Bachelor's degree"
}
```

After adding data, rebuild the site to regenerate all pages.

## SEO Features

### Metadata

- **Dynamic titles**: "Software Engineer Salary in Austin, TX - $116,369"
- **Rich descriptions**: Detailed, keyword-rich descriptions
- **Open Graph**: Full OG tags for social media
- **Twitter Cards**: Optimized for Twitter sharing
- **Canonical URLs**: Proper canonical link tags

### Structured Data

Every salary page includes JSON-LD structured data:
- Schema.org Article markup
- Occupation information
- Salary data
- Location information

### Sitemap

- Automatically generated at `/sitemap.xml`
- Includes all 100+ city-career combinations
- Proper change frequencies and priorities
- Updates with each build

## Performance

### Build Stats

- **100+ static pages** pre-rendered at build time
- **ISR revalidation**: Every 24 hours
- **Bundle size**: Optimized with Next.js Turbopack
- **No client-side data fetching**: All data at build time

### Optimization Features

- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Automatic code splitting
- Image optimization (when images added)
- CSS optimization
- Compression enabled

## Calculations

### Tax Calculator

Implements 2024 federal tax brackets:
- Federal income tax (progressive brackets)
- State income tax (flat rate by state)
- Local income tax (where applicable)
- FICA (Social Security + Medicare)
- Accurate effective tax rate calculation

### Cost of Living

- Adjusts salaries based on COL index (base 100)
- Calculates purchasing power
- Estimates monthly expenses
- Compares cities effectively

## Ad Integration

Ad placement sections are pre-built in the layouts:

```html
<aside className="ad-container">
  <div className="ad-placeholder">
    <p>Advertisement</p>
  </div>
</aside>
```

Replace placeholders with your ad network code (Google AdSense, etc.).

## Extending the Application

### Adding More Data

1. Add more cities to `data/cities.json`
2. Add more careers to `data/careers.json`
3. Run `npm run build` to regenerate pages

Each city × career combination becomes a new page automatically.

### Adding Features

- **City comparison pages**: Create `/compare/[city1]/[city2]` route
- **Career category pages**: Group careers by category
- **Salary calculator**: Interactive salary input
- **Location search**: Add search functionality
- **Charts/graphs**: Integrate chart library for visualizations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## License

Copyright © 2024 RelocationLogic. All rights reserved.

## Support

For questions or issues, please open an issue on GitHub.

## Roadmap

- [ ] Add more cities and careers
- [ ] Implement city comparison tool
- [ ] Add interactive salary calculator
- [ ] Integrate real salary data API
- [ ] Add user authentication for saved comparisons
- [ ] Mobile app version
- [ ] Email alerts for salary changes

---

Built with ❤️ using Next.js, TypeScript, and data-driven insights.
