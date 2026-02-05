import { City, Career, SalaryData } from '@/types';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateAdjustedSalary } from '@/utils/costOfLiving';

/**
 * Get all cities
 */
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(currentDir, '..', 'data');
const citiesData = loadJsonFile<City[]>(path.join(dataDir, 'cities.json'));
const careersData = loadJsonFile<Career[]>(path.join(dataDir, 'careers.json'));

export function getCities(): City[] {
  return citiesData;
}

/**
 * Get city by ID
 */
export function getCityById(id: string): City | undefined {
  if (!id) return undefined;
  const normalized = normalizeId(id);
  const cities = getCities();
  return (
    cities.find((city) => normalizeId(city.id) === normalized) ||
    cities.find((city) => normalizeId(generateSlug(city.name, city.stateCode)) === normalized)
  );
}

/**
 * Get all careers
 */
export function getCareers(): Career[] {
  return careersData;
}

/**
 * Get career by ID
 */
export function getCareerById(id: string): Career | undefined {
  if (!id) return undefined;
  const normalized = normalizeId(id);
  const careers = getCareers();
  return (
    careers.find((career) => normalizeId(career.id) === normalized) ||
    careers.find((career) => normalizeId(generateSlug(career.title)) === normalized)
  );
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

function normalizeId(value: string): string {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '')
    .replace(/\s+/g, '-');
}

function loadJsonFile<T>(filePath: string): T {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return [] as T;
  }
}
