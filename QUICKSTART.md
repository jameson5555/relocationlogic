# Quick Start Guide

## For Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## For Production Build

```bash
npm install
npm run build
npm start
```

## Key URLs

- Homepage: `/`
- Sample Salary Page: `/salary/austin-tx/software-engineer`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`

## File Structure

- `app/` - Next.js pages and layouts
- `data/` - City and career data (JSON)
- `lib/` - Data loading utilities
- `utils/` - Calculation utilities (tax, COL)
- `types/` - TypeScript definitions

## Adding Data

1. Edit `data/cities.json` to add cities
2. Edit `data/careers.json` to add careers
3. Run `npm run build` to regenerate pages

Each city × career combination becomes a new page automatically.

## Deployment

See `DEPLOYMENT.md` for detailed cPanel/WHM deployment instructions.

The standalone build is located in `.next/standalone/` and includes:
- `server.js` - Main server file
- `.next/` - Next.js build output
- `node_modules/` - Required dependencies

Upload these files to your server and run:
```bash
node server.js
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Static JSON data
- SSG + ISR

## Features

- 100+ SEO-optimized pages
- Tax calculations (Federal, State, Local, FICA)
- Cost of living analysis
- Dynamic sitemap
- Structured data (JSON-LD)
- Ad-ready layouts

## Documentation

- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- Code comments throughout

## Support

Open an issue on GitHub for questions or problems.
