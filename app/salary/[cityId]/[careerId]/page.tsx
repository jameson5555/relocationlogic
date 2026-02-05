import { Metadata } from 'next';
import {
  formatCurrency,
  formatPercentage,
  getPageLastUpdated,
} from '@/lib/data';
import citiesData from '@/data/cities.json';
import careersData from '@/data/careers.json';
import { City, Career, SalaryData } from '@/types';
import { calculateAdjustedSalary, calculateCostOfLiving } from '@/utils/costOfLiving';
import { calculateTax } from '@/utils/taxCalculator';
import { generatePageMetadata, generateStructuredData } from '@/lib/metadata';
import SalaryOverview from '@/components/SalaryOverview';
import TaxBreakdown from '@/components/TaxBreakdown';
import ColAnalysis from '@/components/ColAnalysis';

interface PageProps {
  params: {
    cityId?: string;
    careerId?: string;
    slug?: string[];
  };
}

const cities = (Array.isArray(citiesData)
  ? citiesData
  : (citiesData as { default?: City[] }).default) || [];
const careers = (Array.isArray(careersData)
  ? careersData
  : (careersData as { default?: Career[] }).default) || [];

const cityById = new Map(cities.map((city) => [normalizeId(city.id), city]));
const careerById = new Map(careers.map((career) => [normalizeId(career.id), career]));

function normalizeId(value: string): string {
  if (!value) return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '')
    .replace(/\s+/g, '-');
}

function getCityByIdLocal(id: string): City | undefined {
  return cityById.get(normalizeId(id));
}

function getCareerByIdLocal(id: string): Career | undefined {
  return careerById.get(normalizeId(id));
}

function getParamIds(params: PageProps['params']) {
  const slug = params.slug || [];
  return {
    cityId: params.cityId ?? slug[0] ?? '',
    careerId: params.careerId ?? slug[1] ?? '',
  };
}

function getSalaryDataLocal(cityId: string, careerId: string): SalaryData | null {
  const city = getCityByIdLocal(cityId);
  const career = getCareerByIdLocal(careerId);

  if (!city || !career) {
    return null;
  }

  const baseSalary = career.medianSalary;
  const adjustedSalary = calculateAdjustedSalary(
    baseSalary,
    city.costOfLivingIndex,
    career.salaryMultiplier,
    career.overrideSalary
  );

  return {
    cityId,
    careerId,
    salary: adjustedSalary,
    percentile25: Math.round(adjustedSalary * 0.75),
    percentile50: adjustedSalary,
    percentile75: Math.round(adjustedSalary * 1.3),
    sampleSize: 100 + (Math.abs(hashString(`${cityId}:${careerId}`)) % 500),
  };
}

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

// Generate static params for all city-career combinations
export async function generateStaticParams() {
  return cities.flatMap((city) =>
    careers.map((career) => ({
      cityId: city.id,
      careerId: career.id,
    }))
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cityId, careerId } = getParamIds(params);
  const city = getCityByIdLocal(cityId);
  const career = getCareerByIdLocal(careerId);
  const salaryData = getSalaryDataLocal(cityId, careerId);

  if (!city || !career || !salaryData) {
    return {
      title: 'Not Found',
    };
  }
  const lastUpdated = getPageLastUpdated('salary');

  return generatePageMetadata(city, career, salaryData.salary, lastUpdated || undefined);
}

// Main page component
export default async function SalaryPage({ params }: PageProps) {
  const { cityId, careerId } = getParamIds(params);
  const city = getCityByIdLocal(cityId);
  const career = getCareerByIdLocal(careerId);
  const salaryData = getSalaryDataLocal(cityId, careerId);

  if (!city || !career || !salaryData) {
    return (
      <div className="container">
        <header className="page-header">
          <h1>Salary data unavailable</h1>
          <p className="lead">
            We couldn&apos;t find data for this city and career combination.
          </p>
        </header>
      </div>
    );
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
  const lastUpdated = getPageLastUpdated('salary');
  const structuredData = generateStructuredData(
    city,
    career,
    salaryData.salary,
    lastUpdated || undefined
  );

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

// Force static rendering for export builds
