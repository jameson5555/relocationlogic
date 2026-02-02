import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCityById,
  getCareerById,
  getSalaryData,
  getAllCombinations,
  formatCurrency,
  formatPercentage,
} from '@/lib/data';
import { calculateTax } from '@/utils/taxCalculator';
import { calculateCostOfLiving } from '@/utils/costOfLiving';
import { generatePageMetadata, generateStructuredData } from '@/lib/metadata';

interface PageProps {
  params: Promise<{
    cityId: string;
    careerId: string;
  }>;
}

// Generate static params for all city-career combinations
export async function generateStaticParams() {
  const combinations = getAllCombinations();
  return combinations.map(({ cityId, careerId }) => ({
    cityId,
    careerId,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cityId, careerId } = await params;
  const city = getCityById(cityId);
  const career = getCareerById(careerId);
  const salaryData = getSalaryData(cityId, careerId);

  if (!city || !career || !salaryData) {
    return {
      title: 'Not Found',
    };
  }

  return generatePageMetadata(city, career, salaryData.salary);
}

// Main page component
export default async function SalaryPage({ params }: PageProps) {
  const { cityId, careerId } = await params;
  const city = getCityById(cityId);
  const career = getCareerById(careerId);
  const salaryData = getSalaryData(cityId, careerId);

  if (!city || !career || !salaryData) {
    notFound();
  }

  // Calculate tax breakdown
  const taxCalc = calculateTax(
    salaryData.salary,
    city.stateTaxRate,
    city.localTaxRate
  );

  // Calculate cost of living
  const colCalc = calculateCostOfLiving(
    salaryData.salary,
    city.costOfLivingIndex,
    city.averageRent
  );

  // Generate structured data
  const structuredData = generateStructuredData(city, career, salaryData.salary);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container">
        {/* Header Section */}
        <header className="page-header">
          <h1>
            {career.title} Salary in {city.name}, {city.stateCode}
          </h1>
          <p className="lead">{career.description}</p>
        </header>

        {/* Main Salary Information */}
        <section className="salary-overview">
          <h2>Salary Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Median Salary</div>
              <div className="stat-value">{formatCurrency(salaryData.salary)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">25th Percentile</div>
              <div className="stat-value">{formatCurrency(salaryData.percentile25)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">75th Percentile</div>
              <div className="stat-value">{formatCurrency(salaryData.percentile75)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Sample Size</div>
              <div className="stat-value">{salaryData.sampleSize.toLocaleString()}</div>
            </div>
          </div>
        </section>

        {/* Tax Breakdown */}
        <section className="tax-section">
          <h2>Tax Breakdown</h2>
          <div className="calculation-details">
            <div className="calc-row">
              <span>Gross Salary:</span>
              <strong>{formatCurrency(taxCalc.grossSalary)}</strong>
            </div>
            <div className="calc-row">
              <span>Federal Tax:</span>
              <span>{formatCurrency(taxCalc.federalTax)}</span>
            </div>
            <div className="calc-row">
              <span>State Tax ({formatPercentage(city.stateTaxRate)}):</span>
              <span>{formatCurrency(taxCalc.stateTax)}</span>
            </div>
            {city.localTaxRate > 0 && (
              <div className="calc-row">
                <span>Local Tax ({formatPercentage(city.localTaxRate)}):</span>
                <span>{formatCurrency(taxCalc.localTax)}</span>
              </div>
            )}
            <div className="calc-row">
              <span>FICA (Social Security & Medicare):</span>
              <span>{formatCurrency(taxCalc.ficaTax)}</span>
            </div>
            <div className="calc-row total">
              <span>Total Tax ({formatPercentage(taxCalc.effectiveTaxRate)}):</span>
              <strong>{formatCurrency(taxCalc.totalTax)}</strong>
            </div>
            <div className="calc-row net">
              <span>Net Annual Salary:</span>
              <strong>{formatCurrency(taxCalc.netSalary)}</strong>
            </div>
            <div className="calc-row">
              <span>Net Monthly Income:</span>
              <strong>{formatCurrency(Math.round(taxCalc.netSalary / 12))}</strong>
            </div>
          </div>
        </section>

        {/* Cost of Living Analysis */}
        <section className="col-section">
          <h2>Cost of Living Analysis</h2>
          <div className="calculation-details">
            <div className="calc-row">
              <span>Cost of Living Index:</span>
              <strong>{colCalc.costOfLivingIndex}</strong>
              <small>(100 = National Average)</small>
            </div>
            <div className="calc-row">
              <span>Adjusted Salary (National COL):</span>
              <span>{formatCurrency(colCalc.adjustedSalary)}</span>
            </div>
            <div className="calc-row">
              <span>Average Monthly Rent:</span>
              <span>{formatCurrency(colCalc.monthlyRent)}</span>
            </div>
            <div className="calc-row">
              <span>Estimated Monthly Expenses:</span>
              <strong>{formatCurrency(colCalc.monthlyExpenses)}</strong>
            </div>
            <div className="calc-row">
              <span>Purchasing Power:</span>
              <strong>{colCalc.purchasingPower}</strong>
            </div>
          </div>
        </section>

        {/* City Information */}
        <section className="city-info">
          <h2>About {city.name}</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Population:</strong> {city.population.toLocaleString()}
            </div>
            <div className="info-item">
              <strong>Median Home Price:</strong> {formatCurrency(city.medianHomePrice)}
            </div>
            <div className="info-item">
              <strong>Sales Tax:</strong> {formatPercentage(city.salesTaxRate)}
            </div>
          </div>
        </section>

        {/* Career Information */}
        <section className="career-info">
          <h2>About {career.title}</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Category:</strong> {career.category}
            </div>
            <div className="info-item">
              <strong>National Median:</strong> {formatCurrency(career.medianSalary)}
            </div>
            <div className="info-item">
              <strong>Growth Rate:</strong> {formatPercentage(career.growthRate)}
            </div>
            <div className="info-item">
              <strong>Education:</strong> {career.requiredEducation}
            </div>
          </div>
        </section>

        {/* Ad Placeholder - Ready for ad integration */}
        <aside className="ad-container">
          <div className="ad-placeholder">
            <p>Advertisement</p>
          </div>
        </aside>
      </div>
    </>
  );
}

// Enable ISR with revalidation every 24 hours
export const revalidate = 86400;
