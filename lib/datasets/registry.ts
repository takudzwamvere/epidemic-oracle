/**
 * Dataset registry: a typed map of DatasetConfig entries and Country metadata.
 *
 * Keys follow the convention "{ISO3}/{source}" which also maps to the file path
 * /public/datasets/{ISO3}/{source}.csv
 */

import type { DatasetConfig } from "./types";

export interface CountryMeta {
  iso3: string;
  iso2: string;
  name: string;
  region: string;
  primaryDiseases: string[];
}

export const SUPPORTED_COUNTRIES: CountryMeta[] = [
  { iso3: "COD", iso2: "CD", name: "Democratic Republic of the Congo", region: "Central Africa", primaryDiseases: ["Ebola", "Cholera", "Mpox", "Measles"] },
  { iso3: "ZWE", iso2: "ZW", name: "Zimbabwe", region: "Southern Africa", primaryDiseases: ["Cholera", "Malaria", "COVID-19", "Typhoid"] },
  { iso3: "NGA", iso2: "NG", name: "Nigeria", region: "West Africa", primaryDiseases: ["Lassa Fever", "Cholera", "Mpox", "Yellow Fever"] },
  { iso3: "ETH", iso2: "ET", name: "Ethiopia", region: "East Africa", primaryDiseases: ["Cholera", "Malaria", "Measles"] },
  { iso3: "ZAF", iso2: "ZA", name: "South Africa", region: "Southern Africa", primaryDiseases: ["COVID-19", "Cholera", "Measles"] },
  { iso3: "UGA", iso2: "UG", name: "Uganda", region: "East Africa", primaryDiseases: ["Ebola", "Malaria", "Cholera"] },
  { iso3: "KEN", iso2: "KE", name: "Kenya", region: "East Africa", primaryDiseases: ["Cholera", "Malaria", "Rift Valley Fever"] },
  { iso3: "MOZ", iso2: "MZ", name: "Mozambique", region: "Southern Africa", primaryDiseases: ["Cholera", "Malaria", "Cyclone Epidemics"] },
  { iso3: "SDN", iso2: "SD", name: "Sudan", region: "North/East Africa", primaryDiseases: ["Cholera", "Dengue", "Malaria"] },
  { iso3: "SOM", iso2: "SO", name: "Somalia", region: "East Africa", primaryDiseases: ["Cholera", "Measles", "Malnutrition Syndromes"] },
  { iso3: "ZMB", iso2: "ZM", name: "Zambia", region: "Southern Africa", primaryDiseases: ["Cholera", "Anthrax", "Malaria"] },
  { iso3: "MWI", iso2: "MW", name: "Malawi", region: "Southern Africa", primaryDiseases: ["Cholera", "Polio", "Malaria"] },
  { iso3: "TZA", iso2: "TZ", name: "Tanzania", region: "East Africa", primaryDiseases: ["Cholera", "Marburg", "Malaria"] },
  { iso3: "RWA", iso2: "RW", name: "Rwanda", region: "East Africa", primaryDiseases: ["Marburg", "Malaria"] },
  { iso3: "SSD", iso2: "SS", name: "South Sudan", region: "East Africa", primaryDiseases: ["Hepatitis E", "Cholera", "Measles"] },
  { iso3: "TCD", iso2: "TD", name: "Chad", region: "Central Africa", primaryDiseases: ["Measles", "Cholera", "Meningitis"] },
  { iso3: "NER", iso2: "NE", name: "Niger", region: "West Africa", primaryDiseases: ["Meningitis", "Cholera", "Diphtheria"] },
  { iso3: "MLI", iso2: "ML", name: "Mali", region: "West Africa", primaryDiseases: ["Dengue", "Measles", "Yellow Fever"] },
  { iso3: "SEN", iso2: "SN", name: "Senegal", region: "West Africa", primaryDiseases: ["Crimean-Congo", "Dengue"] },
  { iso3: "SLE", iso2: "SL", name: "Sierra Leone", region: "West Africa", primaryDiseases: ["Lassa Fever", "Ebola", "Cholera"] },
  { iso3: "LBR", iso2: "LR", name: "Liberia", region: "West Africa", primaryDiseases: ["Lassa Fever", "Mpox", "Measles"] },
  { iso3: "CAF", iso2: "CF", name: "Central African Republic", region: "Central Africa", primaryDiseases: ["Mpox", "Meningitis"] },
  { iso3: "NAM", iso2: "NA", name: "Namibia", region: "Southern Africa", primaryDiseases: ["Hepatitis E", "Malaria"] },
  { iso3: "LSO", iso2: "LS", name: "Lesotho", region: "Southern Africa", primaryDiseases: ["Tuberculosis", "COVID-19"] },
  { iso3: "LBY", iso2: "LY", name: "Libya", region: "North Africa", primaryDiseases: ["Leishmaniasis", "Flood Epidemics"] },
  { iso3: "MRT", iso2: "MR", name: "Mauritania", region: "West Africa", primaryDiseases: ["Rift Valley Fever", "Crimean-Congo"] },
  { iso3: "TGO", iso2: "TG", name: "Togo", region: "West Africa", primaryDiseases: ["Lassa Fever", "Cholera"] }
];

export const DATASET_REGISTRY: Readonly<Record<string, DatasetConfig>> = {
  // ── WHO Global Feeds ──────────────────────────────────────────────────────────
  "ZWE/who-covid": {
    iso3: "ZWE",
    disease: "covid",
    dateColumn: "Date_reported",
    locationColumn: "Country_code",
    locationFilter: "ZW",
    valueColumn: "New_cases",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },
  "COD/who-covid": {
    iso3: "COD",
    disease: "covid",
    dateColumn: "Date_reported",
    locationColumn: "Country_code",
    locationFilter: "CD",
    valueColumn: "New_cases",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },
  "NGA/who-covid": {
    iso3: "NGA",
    disease: "covid",
    dateColumn: "Date_reported",
    locationColumn: "Country_code",
    locationFilter: "NG",
    valueColumn: "New_cases",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },
  "ZAF/who-covid": {
    iso3: "ZAF",
    disease: "covid",
    dateColumn: "Date_reported",
    locationColumn: "Country_code",
    locationFilter: "ZA",
    valueColumn: "New_cases",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },

  // ── WHO Cholera Surveillance ────────────────────────────────────────────────
  "COD/cholera": {
    iso3: "COD",
    disease: "cholera",
    dateColumn: "first_epiwk",
    locationColumn: "iso_3_code",
    locationFilter: "COD",
    valueColumn: "case_total",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },
  "ZWE/cholera": {
    iso3: "ZWE",
    disease: "cholera",
    dateColumn: "first_epiwk",
    locationColumn: "iso_3_code",
    locationFilter: "ZWE",
    valueColumn: "case_total",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },
  "ETH/cholera": {
    iso3: "ETH",
    disease: "cholera",
    dateColumn: "first_epiwk",
    locationColumn: "iso_3_code",
    locationFilter: "ETH",
    valueColumn: "case_total",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },
  "NGA/cholera": {
    iso3: "NGA",
    disease: "cholera",
    dateColumn: "first_epiwk",
    locationColumn: "iso_3_code",
    locationFilter: "NGA",
    valueColumn: "case_total",
    aggregateByDate: false,
    dateFormat: "YYYY-MM-DD",
  },

  // ── INRB-UMIE Ebola Consolidated ────────────────────────────────────────────
  "COD/drc-ebola": {
    iso3: "COD",
    disease: "ebola",
    dateColumn: "reference_date",
    locationColumn: "location_country",
    locationFilter: "COD",
    valueColumn: "value",
    aggregateByDate: true,
    dateFormat: "YYYY-MM-DD",
  },

  // ── Country GLIDE Event Feeds (Disaster & Epidemic Reports) ───────────────────
  "ZWE/glide": { iso3: "ZWE", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "COD/glide": { iso3: "COD", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "ZMB/glide": { iso3: "ZMB", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "ETH/glide": { iso3: "ETH", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "NGA/glide": { iso3: "NGA", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "UGA/glide": { iso3: "UGA", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "SOM/glide": { iso3: "SOM", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "SDN/glide": { iso3: "SDN", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "CAF/glide": { iso3: "CAF", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "LBR/glide": { iso3: "LBR", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "LBY/glide": { iso3: "LBY", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "LSO/glide": { iso3: "LSO", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "MLI/glide": { iso3: "MLI", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "MOZ/glide": { iso3: "MOZ", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "MRT/glide": { iso3: "MRT", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "MWI/glide": { iso3: "MWI", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "NAM/glide": { iso3: "NAM", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "NER/glide": { iso3: "NER", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "RWA/glide": { iso3: "RWA", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "SEN/glide": { iso3: "SEN", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "SLE/glide": { iso3: "SLE", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "SSD/glide": { iso3: "SSD", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "TCD/glide": { iso3: "TCD", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "TGO/glide": { iso3: "TGO", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "TZA/glide": { iso3: "TZA", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
  "ZAF/glide": { iso3: "ZAF", disease: "disaster", dateColumn: "year", locationColumn: null, locationFilter: null, valueColumn: "killed", aggregateByDate: true, dateFormat: "YYYY" },
};

export function registryKeyToPath(key: string): string {
  return `/datasets/${key}.csv`;
}

export function getCountryByIso3(iso3: string): CountryMeta | undefined {
  return SUPPORTED_COUNTRIES.find((c) => c.iso3 === iso3);
}

export function getDatasetsByCountry(iso3: string): { key: string; config: DatasetConfig }[] {
  return Object.entries(DATASET_REGISTRY)
    .filter(([_, config]) => config.iso3 === iso3)
    .map(([key, config]) => ({ key, config }));
}
