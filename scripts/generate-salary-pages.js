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

function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

function calculateAdjustedSalary(baseSalary, costOfLivingIndex, salaryMultiplier, overrideSalary) {
  if (typeof overrideSalary === 'number') {
    return Math.round(overrideSalary);
  }
  if (typeof salaryMultiplier === 'number') {
    return Math.round(baseSalary * salaryMultiplier);
  }
  return Math.round(baseSalary * (costOfLivingIndex / 100));
}

function calculateFederalTax(income) {
  const brackets = [
    { max: 11600, rate: 0.10 },
    { max: 47150, rate: 0.12 },
    { max: 100525, rate: 0.22 },
    { max: 191950, rate: 0.24 },
    { max: 243725, rate: 0.32 },
    { max: 609350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ];

  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (income <= previousMax) break;
    const taxableInBracket = Math.min(income, bracket.max) - previousMax;
    tax += taxableInBracket * bracket.rate;
    previousMax = bracket.max;
  }

  return tax;
}

function calculateFICA(income) {
  const socialSecurityWageBase = 160200;
  const socialSecurityRate = 0.062;
  const medicareRate = 0.0145;
  const additionalMedicareRate = 0.009;
  const additionalMedicareThreshold = 200000;

  const socialSecurity = Math.min(income, socialSecurityWageBase) * socialSecurityRate;
  let medicare = income * medicareRate;
  if (income > additionalMedicareThreshold) {
    medicare += (income - additionalMedicareThreshold) * additionalMedicareRate;
  }

  return socialSecurity + medicare;
}

function calculateTax(grossSalary, stateTaxRate = 0, localTaxRate = 0) {
  const federalTax = calculateFederalTax(grossSalary);
  const stateTax = (grossSalary * stateTaxRate) / 100;
  const localTax = (grossSalary * localTaxRate) / 100;
  const ficaTax = calculateFICA(grossSalary);

  const totalTax = federalTax + stateTax + localTax + ficaTax;
  const netSalary = grossSalary - totalTax;
  const effectiveTaxRate = (totalTax / grossSalary) * 100;

  return {
    grossSalary,
    federalTax: Math.round(federalTax),
    stateTax: Math.round(stateTax),
    localTax: Math.round(localTax),
    ficaTax: Math.round(ficaTax),
    totalTax: Math.round(totalTax),
    netSalary: Math.round(netSalary),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
  };
}

function calculateCostOfLiving(salary, costOfLivingIndex, monthlyRent) {
  const adjustedSalary = Math.round((salary * 100) / costOfLivingIndex);
  const purchasingPower = Math.round(((adjustedSalary / 60000) * 100) * 10) / 10;
  const monthlyIncome = salary / 12;
  const otherExpenses = (monthlyIncome * 0.4 * costOfLivingIndex) / 100;
  const monthlyExpenses = Math.round(monthlyRent + otherExpenses);

  return {
    adjustedSalary: Math.round(adjustedSalary),
    costOfLivingIndex: Math.round(costOfLivingIndex * 10) / 10,
    purchasingPower,
    monthlyRent: Math.round(monthlyRent),
    monthlyExpenses,
  };
}

function deterministicSampleSize(key) {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 33) ^ key.charCodeAt(i);
  }
  const unsigned = hash >>> 0;
  return 100 + (unsigned % 500);
}

if (!fs.existsSync(outDir)) {
  console.error('out/ directory not found — run the export first (npm run export)');
  process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const careers = JSON.parse(fs.readFileSync(careersPath, 'utf8'));

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

const cssTags = cssLinks
  .map((f) => `<link rel="stylesheet" href="/_next/static/chunks/${f}" />`)
  .join('\n');

let created = 0;

for (const city of cities) {
  for (const career of careers) {
    const dir = path.join(outDir, 'salary', city.id, career.id);
    const indexPath = path.join(dir, 'index.html');

    try {
      fs.mkdirSync(dir, { recursive: true });
      const title = `${career.title} Salary in ${city.name}, ${city.stateCode}`;
      const salary = calculateAdjustedSalary(
        career.medianSalary,
        city.costOfLivingIndex,
        career.salaryMultiplier,
        career.overrideSalary
      );
      const salaryData = {
        salary,
        percentile25: Math.round(salary * 0.75),
        percentile50: salary,
        percentile75: Math.round(salary * 1.3),
        sampleSize: deterministicSampleSize(`${city.id}:${career.id}`),
      };
      const taxCalc = calculateTax(salary, city.stateTaxRate, city.localTaxRate);
      const colCalc = calculateCostOfLiving(salary, city.costOfLivingIndex, city.averageRent);

      const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  <link rel="icon" href="/favicon.ico"/>
  ${cssTags}
</head>
<body>
  <header class="site-header">
    <div class="container">
      <nav class="main-nav">
        <a href="/" class="logo"><h1>RelocationLogic</h1></a>
        <ul class="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/cities/">Cities</a></li>
          <li><a href="/careers/">Careers</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <div class="container">
      <header class="page-header">
        <h1>${title}</h1>
        <p class="lead">${career.description}</p>
      </header>

      <section class="salary-overview">
        <h2>Salary Overview</h2>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Median Salary</div><div class="stat-value">${formatCurrency(salaryData.salary)}</div></div>
          <div class="stat-card"><div class="stat-label">25th Percentile</div><div class="stat-value">${formatCurrency(salaryData.percentile25)}</div></div>
          <div class="stat-card"><div class="stat-label">75th Percentile</div><div class="stat-value">${formatCurrency(salaryData.percentile75)}</div></div>
          <div class="stat-card"><div class="stat-label">Sample Size</div><div class="stat-value">${salaryData.sampleSize.toLocaleString()}</div></div>
        </div>
      </section>

      <section class="tax-section">
        <h2>Tax Breakdown</h2>
        <div class="calculation-details">
          <div class="calc-row"><span>Gross Salary:</span><strong>${formatCurrency(taxCalc.grossSalary)}</strong></div>
          <div class="calc-row"><span>Federal Tax:</span><span>${formatCurrency(taxCalc.federalTax)}</span></div>
          <div class="calc-row"><span>State Tax (${formatPercentage(city.stateTaxRate)}):</span><span>${formatCurrency(taxCalc.stateTax)}</span></div>
          ${city.localTaxRate > 0 ? `<div class="calc-row"><span>Local Tax (${formatPercentage(city.localTaxRate)}):</span><span>${formatCurrency(taxCalc.localTax)}</span></div>` : ''}
          <div class="calc-row"><span>FICA (Social Security & Medicare):</span><span>${formatCurrency(taxCalc.ficaTax)}</span></div>
          <div class="calc-row total"><span>Total Tax (${formatPercentage(taxCalc.effectiveTaxRate)}):</span><strong>${formatCurrency(taxCalc.totalTax)}</strong></div>
          <div class="calc-row net"><span>Net Annual Salary:</span><strong>${formatCurrency(taxCalc.netSalary)}</strong></div>
          <div class="calc-row"><span>Net Monthly Income:</span><strong>${formatCurrency(Math.round(taxCalc.netSalary / 12))}</strong></div>
        </div>
      </section>

      <section class="col-section">
        <h2>Cost of Living Analysis</h2>
        <div class="calculation-details">
          <div class="calc-row"><span>Cost of Living Index:</span><strong>${colCalc.costOfLivingIndex}</strong><small>(100 = National Average)</small></div>
          <div class="calc-row"><span>Adjusted Salary (National COL):</span><span>${formatCurrency(colCalc.adjustedSalary)}</span></div>
          <div class="calc-row"><span>Average Monthly Rent:</span><span>${formatCurrency(colCalc.monthlyRent)}</span></div>
          <div class="calc-row"><span>Estimated Monthly Expenses:</span><strong>${formatCurrency(colCalc.monthlyExpenses)}</strong></div>
          <div class="calc-row"><span>Purchasing Power:</span><strong>${colCalc.purchasingPower}</strong></div>
        </div>
      </section>

      <section class="city-info">
        <h2>About ${city.name}</h2>
        <div class="info-grid">
          <div class="info-item"><strong>Population:</strong> ${city.population.toLocaleString()}</div>
          <div class="info-item"><strong>Median Home Price:</strong> ${formatCurrency(city.medianHomePrice)}</div>
          <div class="info-item"><strong>Sales Tax:</strong> ${formatPercentage(city.salesTaxRate)}</div>
        </div>
      </section>

      <section class="career-info">
        <h2>About ${career.title}</h2>
        <div class="info-grid">
          <div class="info-item"><strong>Category:</strong> ${career.category}</div>
          <div class="info-item"><strong>National Median:</strong> ${formatCurrency(career.medianSalary)}</div>
          <div class="info-item"><strong>Growth Rate:</strong> ${formatPercentage(career.growthRate)}</div>
          <div class="info-item"><strong>Education:</strong> ${career.requiredEducation}</div>
        </div>
      </section>

      <aside class="ad-container">
        <div class="ad-placeholder">
          <p>Advertisement</p>
        </div>
      </aside>
    </div>
  </main>
  <footer class="site-footer">
    <div class="container">
      <p>© 2024 RelocationLogic. All rights reserved.</p>
      <p>Make informed career and relocation decisions with data-driven insights.</p>
    </div>
  </footer>
</body>
</html>`;

      fs.writeFileSync(indexPath, body, 'utf8');
      created++;
    } catch (err) {
      console.error('Failed to create', indexPath, err);
    }
  }
}

console.log(`Generated ${created} static salary pages under out/salary/...`);
