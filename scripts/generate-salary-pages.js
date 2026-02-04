const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const citiesPath = path.join(__dirname, '..', 'data', 'cities.json');
const careersPath = path.join(__dirname, '..', 'data', 'careers.json');

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

if (!fs.existsSync(outDir)) {
  console.error('out/ directory not found — run the export first (npm run export)');
  process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const careers = JSON.parse(fs.readFileSync(careersPath, 'utf8'));

// Detect any exported CSS chunks so generated pages include site styles
const cssDir = path.join(outDir, '_next', 'static', 'chunks');
let cssLinks = [];
if (fs.existsSync(cssDir)) {
  try {
    const files = fs.readdirSync(cssDir);
    cssLinks = files.filter((f) => f.endsWith('.css'));
  } catch (e) {
    // ignore
  }
}

let created = 0;

for (const city of cities) {
  for (const career of careers) {
    const dir = path.join(outDir, 'salary', city.id, career.id);
    const indexPath = path.join(dir, 'index.html');

    try {
      fs.mkdirSync(dir, { recursive: true });
      const title = `${career.title} Salary in ${city.name}, ${city.stateCode}`;
      const cssTags = cssLinks.map((f) => `<link rel="stylesheet" href="/_next/static/chunks/${f}" />`).join('\n');
      const body = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1"/>\n<title>${title}</title>\n<link rel="icon" href="/favicon.ico"/>\n${cssTags}\n</head>\n<body>\n<header><a href="/">RelocationLogic</a></header>\n<main>\n<h1>${title}</h1>\n<p>Estimated median salary: ${formatCurrency(career.medianSalary)}</p>\n<p>Cost of living index: ${city.costOfLivingIndex}</p>\n<p><a href="/salary/${city.id}/${career.id}/">View details</a></p>\n</main>\n<footer>© 2024 RelocationLogic</footer>\n</body>\n</html>`;

      fs.writeFileSync(indexPath, body, 'utf8');
      created++;
    } catch (err) {
      console.error('Failed to create', indexPath, err);
    }
  }
}

console.log(`Generated ${created} static salary pages under out/salary/...`);
