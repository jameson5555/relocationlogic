import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { getAllCombinations } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com';
  const combinations = getAllCombinations();

  // Use build-time generation (scripts/generate-sitemap.js) for stable lastModified.
  // Here we provide a sitemap that will be used by Next during build; lastModified is omitted
  // to avoid requiring runtime filesystem access.

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
  ];

  combinations.forEach(({ cityId, careerId }) => {
    routes.push({
      url: `${baseUrl}/salary/${cityId}/${careerId}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return routes;
}
