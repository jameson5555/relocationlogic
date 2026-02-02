import { City, Career, SalaryData } from '@/types';
import citiesData from '@/data/cities.json';
import careersData from '@/data/careers.json';
import { calculateAdjustedSalary } from '@/utils/costOfLiving';

/**
 * Get all cities
 */
export function getCities(): City[] {
  return citiesData as City[];
}

/**
 * Get city by ID
 */
export function getCityById(id: string): City | undefined {
  return getCities().find((city) => city.id === id);
}

/**
 * Get all careers
 */
export function getCareers(): Career[] {
  return careersData as Career[];
}

/**
 * Get career by ID
 */
export function getCareerById(id: string): Career | undefined {
  return getCareers().find((career) => career.id === id);
}

/**
 * Generate salary data for a city-career combination
 * In production, this would come from a database or API
 */
export function getSalaryData(cityId: string, careerId: string): SalaryData | null {
  const city = getCityById(cityId);
  const career = getCareerById(careerId);

  if (!city || !career) {
    return null;
  }

  // Adjust salary based on cost of living and optional career overrides
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
    // Deterministic sample size derived from cityId+careerId so SSG/ISR
    // artifacts are stable across builds. Produces value in [100, 599].
    sampleSize: deterministicSampleSize(`${cityId}:${careerId}`),
  };
}

/**
 * Get all possible city-career combinations for static generation
 */
export function getAllCombinations(): Array<{ cityId: string; careerId: string }> {
  const cities = getCities();
  const careers = getCareers();
  const combinations: Array<{ cityId: string; careerId: string }> = [];

  for (const city of cities) {
    for (const career of careers) {
      combinations.push({
        cityId: city.id,
        careerId: career.id,
      });
    }
  }

  return combinations;
}

/**
 * Generate URL-friendly slug
 */
export function generateSlug(...parts: string[]): string {
  return parts
    .map((part) =>
      part
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    )
    .join('/');
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Simple deterministic hash to produce a stable sample size.
 * Uses djb2 algorithm and maps output into [100, 599].
 */
function deterministicSampleSize(key: string): number {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 33) ^ key.charCodeAt(i);
  }
  // Convert to unsigned 32-bit and map to 0..499
  const unsigned = hash >>> 0;
  return 100 + (unsigned % 500);
}
