import { MetadataRoute } from 'next';
import { getAllCombinations } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://relocationlogic.com';
  const combinations = getAllCombinations();

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // All salary pages (city × career combinations)
  combinations.forEach(({ cityId, careerId }) => {
    routes.push({
      url: `${baseUrl}/salary/${cityId}/${careerId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return routes;
}
