import { City, Career, SalaryData, DataMeta, DatasetMeta } from '@/types';
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
const metaData = loadJsonFile<DataMeta>(path.join(dataDir, 'meta.json'), { datasets: {} });

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
 * Get data metadata
 */
export function getDataMeta(): DataMeta {
  return metaData;
}

export function getDatasetMeta(datasetId: string): DatasetMeta | undefined {
  return metaData.datasets[datasetId];
}

export function getDatasetLastUpdated(datasetId: string): Date | null {
  const dataset = getDatasetMeta(datasetId);
  if (!dataset?.lastUpdated) return null;
  const parsed = new Date(dataset.lastUpdated);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getSiteLastUpdated(): string | null {
  const latest = maxDate([
    getDatasetLastUpdated('censusAcs'),
    getDatasetLastUpdated('blsOews'),
  ]);
  return latest ? latest.toISOString() : null;
}

export function getPageLastUpdated(page: 'home' | 'cities' | 'careers' | 'salary'): string | null {
  let latest: Date | null = null;
  switch (page) {
    case 'cities':
      latest = getDatasetLastUpdated('censusAcs');
      break;
    case 'careers':
      latest = getDatasetLastUpdated('blsOews');
      break;
    case 'salary':
      latest = maxDate([
        getDatasetLastUpdated('censusAcs'),
        getDatasetLastUpdated('blsOews'),
      ]);
      break;
    case 'home':
    default:
      latest = maxDate([
        getDatasetLastUpdated('censusAcs'),
        getDatasetLastUpdated('blsOews'),
      ]);
      break;
  }

  return latest ? latest.toISOString() : null;
}

export function formatLastUpdated(lastUpdated: string | null): string | null {
  if (!lastUpdated) return null;
  const parsed = new Date(lastUpdated);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

function normalizeId(value: string): string {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '')
    .replace(/\s+/g, '-');
}

function loadJsonFile<T>(filePath: string, fallback?: T): T {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    if (fallback !== undefined) return fallback;
    return [] as T;
  }
}

function maxDate(dates: Array<Date | null>): Date | null {
  const valid = dates.filter((date): date is Date => Boolean(date));
  if (!valid.length) return null;
  return valid.reduce((latest, current) => (current > latest ? current : latest));
}
