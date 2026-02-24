const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outDir = path.join(__dirname, '..', 'public');

function loadJson(name, fallback = null) {
  const p = path.join(dataDir, name);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

function getLastModified() {
  try {
    const cityStat = fs.statSync(path.join(dataDir, 'cities.json'));
    const careerStat = fs.statSync(path.join(dataDir, 'careers.json'));
    const latest = Math.max(cityStat.mtimeMs, careerStat.mtimeMs);
    return new Date(latest).toISOString();
  } catch (err) {
    return new Date().toISOString();
  }
}

function getDatasetLastUpdated(meta, datasetId) {
  const value = meta?.datasets?.[datasetId]?.lastUpdated;
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function maxDate(dates) {
  const valid = dates.filter(Boolean);
  if (!valid.length) return null;
  return valid.reduce((latest, current) => (current > latest ? current : latest));
}

function buildSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com';
  const cities = loadJson('cities.json', []);
  const careers = loadJson('careers.json', []);
  const meta = loadJson('meta.json', { datasets: {} });

  // flatten arrays if they are objects
  const cityList = Array.isArray(cities) ? cities : Object.values(cities);
  const careerList = Array.isArray(careers) ? careers : Object.values(careers);

  const acsLastUpdated = getDatasetLastUpdated(meta, 'censusAcs');
  const blsLastUpdated = getDatasetLastUpdated(meta, 'blsOews');
  const salaryLastUpdated = maxDate([acsLastUpdated, blsLastUpdated]);
  const defaultLastmod = getLastModified();
  const homeLastmod = salaryLastUpdated ? salaryLastUpdated.toISOString() : defaultLastmod;
  const salaryLastmod = salaryLastUpdated ? salaryLastUpdated.toISOString() : defaultLastmod;

  const urls = [];
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
  staticPages.forEach((route) => {
    urls.push({
      loc: `${baseUrl}${route}`,
      lastmod: homeLastmod,
      priority: route === '/' ? '1.0' : '0.7',
      changefreq: route === '/' ? 'daily' : 'weekly',
    });
  });

  cityList.forEach((city) => {
    careerList.forEach((career) => {
      urls.push({
        loc: `${baseUrl}/salary/${city.id}/${career.id}/`,
        lastmod: salaryLastmod,
        priority: '0.8',
        changefreq: 'weekly',
      });
    });
  });

  const xml = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  urls.forEach((u) => {
    xml.push('  <url>');
    xml.push(`    <loc>${u.loc}</loc>`);
    xml.push(`    <lastmod>${u.lastmod}</lastmod>`);
    if (u.changefreq) xml.push(`    <changefreq>${u.changefreq}</changefreq>`);
    if (u.priority) xml.push(`    <priority>${u.priority}</priority>`);
    xml.push('  </url>');
  });

  xml.push('</urlset>');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml.join('\n'));
  console.log('Wrote sitemap:', outPath);
}

buildSitemap();
