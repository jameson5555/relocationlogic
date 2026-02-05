/*
  update-data.js
  - Fetches public data (Census ACS) and refreshes data/cities.json
  - Writes data/meta.json with per-dataset timestamps
  - Idempotent: only writes when data changes

  Sources:
  - Census ACS 5-year: https://api.census.gov/data/2022/acs/acs5
  - Tables: B01003_001E (population), B25077_001E (median home value), B25064_001E (median gross rent)

  Notes:
  - Requires data/mappings/cities.json for state/place FIPS mappings
  - BLS OEWS refresh not yet implemented here (placeholder remains in meta.json)
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const MAPPINGS_PATH = path.join(DATA_DIR, 'mappings', 'cities.json');
const CITIES_PATH = path.join(DATA_DIR, 'cities.json');
const META_PATH = path.join(DATA_DIR, 'meta.json');

const ACS_YEAR = process.env.ACS_YEAR || '2022';
const ACS_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5`;
const ACS_VARS = ['B01003_001E', 'B25077_001E', 'B25064_001E'];
const CENSUS_API_KEY = process.env.CENSUS_API_KEY || '';

function log(message) {
  console.log(`[update-data] ${message}`);
}

function loadJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

function writeJsonAtomic(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function maxDate(dates) {
  const valid = dates.filter(Boolean);
  if (!valid.length) return null;
  return valid.reduce((latest, current) => (current > latest ? current : latest));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  return response.json();
}

async function fetchAcsPlace(stateFips, placeFips) {
  const params = new URLSearchParams({
    get: ['NAME', ...ACS_VARS].join(','),
    for: `place:${placeFips}`,
    in: `state:${stateFips}`,
  });
  if (CENSUS_API_KEY) params.append('key', CENSUS_API_KEY);
  const url = `${ACS_BASE}?${params.toString()}`;

  const rows = await fetchJson(url);
  const header = rows[0];
  const row = rows[1];
  if (!row) {
    throw new Error(`No ACS data for state=${stateFips} place=${placeFips}`);
  }

  const values = Object.fromEntries(header.map((key, idx) => [key, row[idx]]));
  return {
    name: values.NAME,
    population: toNumber(values.B01003_001E),
    medianHomePrice: toNumber(values.B25077_001E),
    medianRent: toNumber(values.B25064_001E),
    sourceUrl: url,
  };
}

async function fetchAcsNational() {
  const params = new URLSearchParams({
    get: ['NAME', 'B25077_001E', 'B25064_001E'].join(','),
    for: 'us:1',
  });
  if (CENSUS_API_KEY) params.append('key', CENSUS_API_KEY);
  const url = `${ACS_BASE}?${params.toString()}`;

  const rows = await fetchJson(url);
  const header = rows[0];
  const row = rows[1];
  if (!row) {
    throw new Error('No ACS national data returned');
  }

  const values = Object.fromEntries(header.map((key, idx) => [key, row[idx]]));
  return {
    medianHomePrice: toNumber(values.B25077_001E),
    medianRent: toNumber(values.B25064_001E),
    sourceUrl: url,
  };
}

function calculateCostIndex(medianHomePrice, medianRent, nationalHome, nationalRent) {
  const homeRatio = nationalHome ? medianHomePrice / nationalHome : null;
  const rentRatio = nationalRent ? medianRent / nationalRent : null;

  if (homeRatio && rentRatio) {
    return round1(((homeRatio + rentRatio) / 2) * 100);
  }
  if (homeRatio) return round1(homeRatio * 100);
  if (rentRatio) return round1(rentRatio * 100);
  return null;
}

function validateCity(city) {
  const required = ['id', 'name', 'state', 'stateCode'];
  required.forEach((field) => {
    if (!city[field]) {
      throw new Error(`Missing required city field: ${field} (${city.id || 'unknown'})`);
    }
  });

  const numericFields = ['population', 'medianHomePrice', 'averageRent', 'costOfLivingIndex'];
  numericFields.forEach((field) => {
    if (!Number.isFinite(city[field])) {
      throw new Error(`Invalid numeric value for ${field} (${city.id})`);
    }
  });
}

async function updateCities() {
  const cities = loadJson(CITIES_PATH, []);
  const mapping = loadJson(MAPPINGS_PATH, { cities: [] });

  if (!Array.isArray(cities) || !cities.length) {
    throw new Error('cities.json is empty or invalid');
  }

  const mappingById = new Map(
    (mapping.cities || []).map((entry) => [entry.cityId, entry])
  );

  const missingMappings = cities.filter((city) => !mappingById.has(city.id));
  if (missingMappings.length) {
    throw new Error(`Missing Census mapping for city IDs: ${missingMappings.map((c) => c.id).join(', ')}`);
  }

  log(`Fetching ACS national baselines (${ACS_YEAR})...`);
  const national = await fetchAcsNational();

  log(`Fetching ACS city data (${ACS_YEAR})...`);
  const updatedCities = [];
  const sourceUrls = new Set([national.sourceUrl]);

  for (const city of cities) {
    const mappingEntry = mappingById.get(city.id);
    const data = await fetchAcsPlace(mappingEntry.stateFips, mappingEntry.placeFips);
    sourceUrls.add(data.sourceUrl);

    if (!data.population || !data.medianHomePrice || !data.medianRent) {
      throw new Error(`Missing ACS values for ${city.id}`);
    }

    const costIndex = calculateCostIndex(
      data.medianHomePrice,
      data.medianRent,
      national.medianHomePrice,
      national.medianRent
    );

    const nextCity = {
      ...city,
      population: Math.round(data.population),
      medianHomePrice: Math.round(data.medianHomePrice),
      averageRent: Math.round(data.medianRent),
      costOfLivingIndex: costIndex ?? city.costOfLivingIndex,
    };

    validateCity(nextCity);
    updatedCities.push(nextCity);
  }

  return { updatedCities, sourceUrls: Array.from(sourceUrls) };
}

function updateMeta(nowIso, sourceUrls) {
  const meta = loadJson(META_PATH, { datasets: {} });
  const dataset = {
    id: 'censusAcs',
    release: `ACS ${ACS_YEAR} 5-year`,
    lastUpdated: nowIso,
    retrievedAt: nowIso,
    sourceUrl: ACS_BASE,
    notes: `Tables: ${ACS_VARS.join(', ')}. Sources: ${sourceUrls.join(' | ')}`,
  };

  return {
    datasets: {
      ...meta.datasets,
      censusAcs: dataset,
    },
  };
}

async function main() {
  const nowIso = new Date().toISOString();
  log('Starting data refresh...');

  const { updatedCities, sourceUrls } = await updateCities();

  const currentCities = loadJson(CITIES_PATH, []);
  const nextCitiesJson = JSON.stringify(updatedCities, null, 2);
  const currentCitiesJson = JSON.stringify(currentCities, null, 2);

  if (nextCitiesJson === currentCitiesJson) {
    log('No city data changes detected. Skipping write.');
    return;
  }

  log('City data changes detected. Writing updates...');
  writeJsonAtomic(CITIES_PATH, updatedCities);

  const nextMeta = updateMeta(nowIso, sourceUrls);
  writeJsonAtomic(META_PATH, nextMeta);

  log('Data refresh complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
