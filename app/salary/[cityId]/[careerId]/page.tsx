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
import SalaryOverview from '@/components/SalaryOverview';
import TaxBreakdown from '@/components/TaxBreakdown';
import ColAnalysis from '@/components/ColAnalysis';

interface PageProps {
  params: {
    cityId: string;
    careerId: string;
  };
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
  const { cityId, careerId } = params;
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
  const { cityId, careerId } = params;
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

        <SalaryOverview salaryData={salaryData} career={career} />

        <TaxBreakdown taxCalc={taxCalc} city={city} />

        <ColAnalysis colCalc={colCalc} />

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

}

// Force static rendering for export builds
export const dynamic = 'force-static';
