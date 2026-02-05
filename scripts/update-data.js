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
const unzipper = require('unzipper');
const xlsx = require('xlsx');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const MAPPINGS_PATH = path.join(DATA_DIR, 'mappings', 'cities.json');
const CITIES_PATH = path.join(DATA_DIR, 'cities.json');
const CAREERS_PATH = path.join(DATA_DIR, 'careers.json');
const META_PATH = path.join(DATA_DIR, 'meta.json');
const METRO_MAPPING_PATH = path.join(DATA_DIR, 'mappings', 'metros.json');
const CAREER_MAPPING_PATH = path.join(DATA_DIR, 'mappings', 'careers.json');

const ACS_YEAR = process.env.ACS_YEAR || '2022';
const ACS_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5`;
const ACS_VARS = ['B01003_001E', 'B25077_001E', 'B25064_001E'];
const CENSUS_API_KEY = process.env.CENSUS_API_KEY || '';

const OEWS_RELEASE = process.env.OEWS_RELEASE || '2023';
const OEWS_URLS = (process.env.OEWS_URLS || '').split(',').map((value) => value.trim()).filter(Boolean);
const OEWS_DEFAULT_URLS = [
  `https://www.bls.gov/oes/special.requests/oesm${OEWS_RELEASE.slice(-2)}ma.zip`,
  `https://download.bls.gov/pub/time.series/oes/oesm${OEWS_RELEASE.slice(-2)}ma.zip`,
  `https://download.bls.gov/pub/oes/oesm${OEWS_RELEASE.slice(-2)}ma.zip`,
];

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

function parseDelimitedLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseDelimited(text, delimiter) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return [];
  const header = parseDelimitedLine(lines[0], delimiter).map((value) => value.trim());
  return lines.slice(1).map((line) => {
    const row = parseDelimitedLine(line, delimiter);
    const record = {};
    header.forEach((key, index) => {
      record[key] = row[index];
    });
    return record;
  });
}

function parseOewsText(text) {
  const firstLine = text.split(/\r?\n/)[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : ',';
  return parseDelimited(text, delimiter);
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

async function downloadOewsCsv() {
  const urls = OEWS_URLS.length ? OEWS_URLS : OEWS_DEFAULT_URLS;
  const errors = [];

  for (const url of urls) {
    log(`Fetching OEWS data: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'relocationlogic-data-refresh/1.0',
        Referer: 'https://www.bls.gov/oes/',
      },
    });

    if (!response.ok) {
      errors.push(`${response.status}: ${url}`);
      continue;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const isZip = buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;

    if (!isZip) {
      return { text: buffer.toString('utf8') };
    }

    const directory = await unzipper.Open.buffer(buffer);
    const entry = directory.files.find((file) =>
      file.path.endsWith('.csv') || file.path.endsWith('.txt') || file.path.endsWith('.dat') || file.path.endsWith('.xlsx')
    );
    if (!entry) {
      errors.push(`Missing CSV entry in zip: ${url}`);
      continue;
    }

    const content = await entry.buffer();
    if (entry.path.endsWith('.xlsx')) {
      const workbook = xlsx.read(content, { type: 'buffer' });
      const firstSheet = workbook.SheetNames[0];
      if (!firstSheet) {
        errors.push(`Missing sheet in XLSX: ${url}`);
        continue;
      }
      const sheet = workbook.Sheets[firstSheet];
      const csv = xlsx.utils.sheet_to_csv(sheet);
      return { text: csv };
    }

    return { text: content.toString('utf8') };
  }

  throw new Error(`OEWS download failed. Attempts: ${errors.join(' | ')}`);
}

function getNumericField(record, keys) {
  for (const key of keys) {
    const value = record[key];
    if (value === undefined || value === null) continue;
    if (value === '*' || value === '#') continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
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

function validateCareer(career) {
  const required = ['id', 'title', 'category', 'description', 'medianSalary'];
  required.forEach((field) => {
    if (!career[field]) {
      throw new Error(`Missing required career field: ${field} (${career.id || 'unknown'})`);
    }
  });

  if (!Number.isFinite(career.medianSalary)) {
    throw new Error(`Invalid medianSalary for ${career.id}`);
  }
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

async function updateCareers() {
  const careers = loadJson(CAREERS_PATH, []);
  const metros = loadJson(METRO_MAPPING_PATH, { metros: [] });
  const careerMapping = loadJson(CAREER_MAPPING_PATH, { careers: [] });

  if (!Array.isArray(careers) || !careers.length) {
    throw new Error('careers.json is empty or invalid');
  }

  const metroCodes = new Set((metros.metros || []).map((entry) => entry.areaCode));
  if (!metroCodes.size) {
    throw new Error('No OEWS metro mappings found');
  }

  const careerById = new Map(careers.map((career) => [career.id, career]));
  const socByCareerId = new Map(
    (careerMapping.careers || []).map((entry) => [entry.careerId, entry.socCode])
  );

  const missingMappings = careers.filter((career) => !socByCareerId.has(career.id));
  if (missingMappings.length) {
    throw new Error(`Missing SOC mappings for career IDs: ${missingMappings.map((c) => c.id).join(', ')}`);
  }

  const { text } = await downloadOewsCsv();
  const records = parseOewsText(text);
  if (!records.length) {
    throw new Error('OEWS CSV parse returned no rows');
  }

  const header = Object.keys(records[0]);
  const headerLower = header.reduce((acc, key) => {
    acc[key.toLowerCase()] = key;
    return acc;
  }, {});
  const areaKey = headerLower.area || headerLower.area_code;
  const occKey = headerLower.occ_code || headerLower.occ;

  if (!areaKey || !occKey) {
    throw new Error('OEWS CSV missing AREA or OCC_CODE columns');
  }

  const aggregated = new Map();
  const socToCareerId = new Map(
    (careerMapping.careers || []).map((entry) => [entry.socCode, entry.careerId])
  );

  for (const record of records) {
    const areaCode = record[areaKey];
    const occCode = record[occKey];
    if (!metroCodes.has(areaCode)) continue;
    if (!occCode || occCode === '00-0000') continue;

    const careerId = socToCareerId.get(occCode);
    if (!careerId) continue;

    const median = getNumericField(record, ['A_MEDIAN', 'a_median', 'a_median_salary']);
    const mean = getNumericField(record, ['A_MEAN', 'a_mean']);
    const pct10 = getNumericField(record, ['A_PCT10', 'a_pct10']);
    const pct90 = getNumericField(record, ['A_PCT90', 'a_pct90']);

    if (!median && !mean) continue;

    const entry = aggregated.get(careerId) || { medians: [], pct10s: [], pct90s: [] };
    if (median) entry.medians.push(median);
    if (!median && mean) entry.medians.push(mean);
    if (pct10) entry.pct10s.push(pct10);
    if (pct90) entry.pct90s.push(pct90);
    aggregated.set(careerId, entry);
  }

  const updatedCareers = careers.map((career) => {
    const entry = aggregated.get(career.id);
    if (!entry || !entry.medians.length) {
      return career;
    }

    const medianSalary = Math.round(entry.medians.reduce((sum, value) => sum + value, 0) / entry.medians.length);
    const minSalary = entry.pct10s.length
      ? Math.round(entry.pct10s.reduce((sum, value) => sum + value, 0) / entry.pct10s.length)
      : career.salaryRange.min;
    const maxSalary = entry.pct90s.length
      ? Math.round(entry.pct90s.reduce((sum, value) => sum + value, 0) / entry.pct90s.length)
      : career.salaryRange.max;

    const nextCareer = {
      ...career,
      medianSalary,
      salaryRange: {
        min: minSalary,
        max: maxSalary,
      },
    };

    validateCareer(nextCareer);
    return nextCareer;
  });

  return { updatedCareers, sourceUrls: [OEWS_URL] };
}

function updateMeta(nowIso, sourceUrls, datasetId, release, notes) {
  const meta = loadJson(META_PATH, { datasets: {} });
  const dataset = {
    id: datasetId,
    release,
    lastUpdated: nowIso,
    retrievedAt: nowIso,
    sourceUrl: sourceUrls[0] || '',
    notes,
  };

  return {
    datasets: {
      ...meta.datasets,
      [datasetId]: dataset,
    },
  };
}

async function main() {
  const nowIso = new Date().toISOString();
  log('Starting data refresh...');

  const { updatedCities, sourceUrls: acsSources } = await updateCities();
  const { updatedCareers, sourceUrls: oewsSources } = await updateCareers();

  const currentCities = loadJson(CITIES_PATH, []);
  const currentCareers = loadJson(CAREERS_PATH, []);
  const nextCitiesJson = JSON.stringify(updatedCities, null, 2);
  const currentCitiesJson = JSON.stringify(currentCities, null, 2);
  const nextCareersJson = JSON.stringify(updatedCareers, null, 2);
  const currentCareersJson = JSON.stringify(currentCareers, null, 2);

  let wrote = false;

  if (nextCitiesJson !== currentCitiesJson) {
    log('City data changes detected. Writing updates...');
    writeJsonAtomic(CITIES_PATH, updatedCities);
    const metaUpdate = updateMeta(
      nowIso,
      acsSources,
      'censusAcs',
      `ACS ${ACS_YEAR} 5-year`,
      `Tables: ${ACS_VARS.join(', ')}. Sources: ${acsSources.join(' | ')}`
    );
    writeJsonAtomic(META_PATH, metaUpdate);
    wrote = true;
  } else {
    log('No city data changes detected.');
  }

  if (nextCareersJson !== currentCareersJson) {
    log('Career data changes detected. Writing updates...');
    writeJsonAtomic(CAREERS_PATH, updatedCareers);
    const metaUpdate = updateMeta(
      nowIso,
      oewsSources,
      'blsOews',
      `OEWS ${OEWS_RELEASE}`,
      `Metro area averages from ${OEWS_URL}. Areas from data/mappings/metros.json`
    );
    writeJsonAtomic(META_PATH, metaUpdate);
    wrote = true;
  } else {
    log('No career data changes detected.');
  }

  if (!wrote) {
    log('No data changes detected.');
  }

  log('Data refresh complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
