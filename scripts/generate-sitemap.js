const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outDir = path.join(__dirname, '..', 'public');

function loadJson(name) {
  const p = path.join(dataDir, name);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
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

function buildSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com';
  const cities = loadJson('cities.json');
  const careers = loadJson('careers.json');

  // flatten arrays if they are objects
  const cityList = Array.isArray(cities) ? cities : Object.values(cities);
  const careerList = Array.isArray(careers) ? careers : Object.values(careers);

  const lastmod = getLastModified();

  const urls = [];
  // homepage
  urls.push({ loc: `${baseUrl}/`, lastmod, priority: '1.0', changefreq: 'daily' });

  cityList.forEach((city) => {
    careerList.forEach((career) => {
      urls.push({
        loc: `${baseUrl}/salary/${city.id}/${career.id}`,
        lastmod,
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
