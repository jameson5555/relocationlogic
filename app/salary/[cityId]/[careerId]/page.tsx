import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import Link from 'next/link';
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
  };
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
        
        

        {/* Human-friendly interpretation sections (rendered server-side for indexing) */}
        <section className="human-interpretation page-body">
          <div className="hi-header">
            <span className="hi-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M9.5 19.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2.75a5 5 0 00-3.5 8.5c.2.18.36.37.5.56V13a2 2 0 002 2h2a2 2 0 002-2v-1.19c.14-.19.3-.38.5-.56A5 5 0 0012 2.75z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h2>What this data means in real life</h2>
          </div>
          <p>
            The figures on this page estimate a typical base salary for a <strong>{career.title}</strong> in <strong>{city.name}</strong>. The number ({formatCurrency(salaryData.salary)}) represents a median-style estimate adjusted for local cost-of-living and common career-level differences. Use it as a data-informed starting point when comparing offers or planning a move.
          </p>

          <h3>What this data does not capture</h3>
          <p>
            These estimates exclude company-specific pay bands, negotiated sign-on bonuses, equity grants, non-salary benefits, and irregular contract premiums. They also do not reflect personal circumstances such as household size, childcare needs, or medical expenses.
          </p>

          <h3>Who this is best for</h3>
          <p>
            This data is most useful for mid-career professionals and hiring teams who need a quick, comparable view of salary and purchasing power across metros. It is strongest for occupations with broad reporting and many local hires.
          </p>

          <h3>Who should avoid this move</h3>
          <p>
            If accepting the posted salary would reduce your adjusted purchasing power versus your current location—for example, if your current salary is higher than {formatCurrency(career.medianSalary)} or your family has high fixed costs—this move may not be suitable without additional compensation. Similarly, candidates with specialized compensation (equity, commission-heavy roles, or contractor rates) should not rely solely on these medians.
          </p>

          <h3>How to use this data in decisions</h3>
          <ol>
            <li>Compare the adjusted salary ({formatCurrency(salaryData.salary)}) with your current take-home and benefits.</li>
            <li>Check local costs on this page—housing, taxes, and typical living expenses—and add one-time moving costs.</li>
            <li>If the move reduces purchasing power, ask the employer for targeted adjustments (relocation support, higher base, or sign-on).</li>
            <li>Use this page as an initial benchmark, then validate current market demand and compensation bands with recent local job postings.</li>
          </ol>

          <h3>Further reading</h3>
          <ul>
            <li><Link href="/guides/how-to-evaluate-a-relocation-offer">How to evaluate a relocation offer</Link></li>
            <li><Link href="/guides/hidden-costs-of-moving-cities">Hidden costs of moving cities</Link></li>
            <li><Link href="/guides/how-to-compare-cities-for-career-growth">Compare cities for career growth</Link></li>
          </ul>
        </section>

        {/* Ad Placeholder - Ready for ad integration */}
        {/* <aside className="ad-container">
        </aside> */}
      </div>
    </>
  );
}

// Force static rendering for export builds
