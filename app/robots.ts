import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://relocationlogic.com/sitemap.xml',
  };
}

// Mark static for export builds
// (kept at top) no duplicate `dynamic` export here
