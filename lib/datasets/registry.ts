/**
 * Dataset registry: a typed map of DatasetConfig entries.
 *
 * Keys follow the convention "{ISO3}/{source}" which also maps to the file path
 * /public/datasets/{ISO3}/{source}.csv
 *
 * To add a new country/disease:
 * 1. Drop the CSV in /public/datasets/{ISO3}/{source}.csv
 * 2. Add one entry here — no new parsing code needed.
 */

import type { DatasetConfig } from "./types";

export const DATASET_REGISTRY: Readonly<Record<string, DatasetConfig>> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Zimbabwe — COVID-19 (wide/global format: filter by Country_code = "ZW")
  // Source: WHO COVID-19 global daily data
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Democratic Republic of Congo — Ebola (location-level format)
  // One row per health zone per day → aggregate to country-level series
  // Source: INRB-UMIE consolidated Ebola dataset
  // Columns: location_country, location_level, location_name, reference_date,
  //          measure, case_classification, time_period, value
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Global — Cholera (wide/global format: filter by iso_3_code = "COD")
  // Source: WHO cholera adm0 public data (annual summaries, year-only dates)
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Country-specific GLIDE disaster event files
  // Columns: glidenumber,number,docid,event,event_name,geocode,location,
  //          latitude,longitude,...,year,month,day,status,killed,injured,...
  // These are already country-scoped so locationFilter = null.
  // We construct a date from year+month+day columns — but since there's no
  // single date column we treat "year" as the date for annual aggregation.
  // ─────────────────────────────────────────────────────────────────────────
  "ZWE/glide": {
    iso3: "ZWE",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "COD/glide": {
    iso3: "COD",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "ZMB/glide": {
    iso3: "ZMB",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "ETH/glide": {
    iso3: "ETH",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "NGA/glide": {
    iso3: "NGA",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "UGA/glide": {
    iso3: "UGA",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "SOM/glide": {
    iso3: "SOM",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  "SDN/glide": {
    iso3: "SDN",
    disease: "disaster",
    dateColumn: "year",
    locationColumn: null,
    locationFilter: null,
    valueColumn: "killed",
    aggregateByDate: true,
    dateFormat: "YYYY",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Global GLIDE events (filter by geocode to get a specific country)
  // Used as fallback when a country-specific GLIDE file doesn't exist.
  // Example: "RWA/glide-global" for Rwanda using the global file.
  // ─────────────────────────────────────────────────────────────────────────
  // Note: The global file is very large (~26 MB). Prefer country-specific
  // files where available. Keys for global-filtered variants would be:
  // "RWA/glide-global": { ..., locationColumn: "geocode", locationFilter: "RWA" }
};

/**
 * Derive the public-facing file path from a registry key.
 * e.g. "ZWE/who-covid" → "/datasets/ZWE/who-covid.csv"
 */
export function registryKeyToPath(key: string): string {
  return `/datasets/${key}.csv`;
}
