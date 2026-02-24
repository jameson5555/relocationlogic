import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { getAllCombinations, getPageLastUpdated } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com';
  const combinations = getAllCombinations();
  const homeLastUpdated = getPageLastUpdated('home');
  const salaryLastUpdated = getPageLastUpdated('salary');
  const staticPages = [
    '/',
    '/about/',
    '/careers/',
    '/cities/',
    '/contact/',
    '/guides/',
    '/methodology/',
    '/privacy-policy/',
    '/terms/',
    '/guides/how-to-evaluate-a-relocation-offer/',
    '/guides/how-to-compare-cities-for-career-growth/',
    '/guides/hidden-costs-of-moving-cities/',
    '/guides/cost-of-living-mistakes/',
    '/guides/remote-work-relocation-strategy/',
  ];

  // Use build-time generation (scripts/generate-sitemap.js) for stable lastModified.
  // Here we provide a sitemap that will be used by Next during build; lastModified is omitted
  // to avoid requiring runtime filesystem access.

  const routes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
    lastModified: homeLastUpdated ? new Date(homeLastUpdated) : undefined,
  }));

  combinations.forEach(({ cityId, careerId }) => {
    routes.push({
      url: `${baseUrl}/salary/${cityId}/${careerId}/`,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: salaryLastUpdated ? new Date(salaryLastUpdated) : undefined,
    });
  });

  return routes;
}

// Mark static for export builds
// (kept at top) no duplicate `dynamic` export here
