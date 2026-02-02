import { City, Career, SalaryData } from '@/types';
import citiesData from '@/data/cities.json';
import careersData from '@/data/careers.json';

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

  // Adjust salary based on cost of living
  const colMultiplier = city.costOfLivingIndex / 100;
  const baseSalary = career.medianSalary;
  
  // Cities with higher COL typically pay more
  const adjustedSalary = Math.round(baseSalary * (0.7 + colMultiplier * 0.3));

  return {
    cityId,
    careerId,
    salary: adjustedSalary,
    percentile25: Math.round(adjustedSalary * 0.75),
    percentile50: adjustedSalary,
    percentile75: Math.round(adjustedSalary * 1.3),
    sampleSize: Math.floor(Math.random() * 500) + 100,
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
