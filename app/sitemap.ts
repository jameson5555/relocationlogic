import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { getAllCombinations } from '@/lib/data';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://relocationlogic.com';
  const combinations = getAllCombinations();

  // Compute a stable lastModified based on data file mtimes so sitemap
  // doesn't change on every build. Falls back to current date if unavailable.
  let lastModified = new Date();
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const cityStat = fs.statSync(path.join(dataDir, 'cities.json'));
    const careerStat = fs.statSync(path.join(dataDir, 'careers.json'));
    const latest = Math.max(cityStat.mtimeMs, careerStat.mtimeMs);
    lastModified = new Date(latest);
  } catch (err) {
    // keep default current date if something fails
  }

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // All salary pages (city × career combinations)
  combinations.forEach(({ cityId, careerId }) => {
    routes.push({
      url: `${baseUrl}/salary/${cityId}/${careerId}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return routes;
}
