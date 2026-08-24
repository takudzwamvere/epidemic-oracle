/**
 * Client-side loader for public datasets.
 *
 * Fetches /public/datasets/{ISO3}/{source}.csv and normalizes it into
 * a uniform { date, value }[] time series using the registry config.
 *
 * Usage:
 *   import { loadPublicDataset } from "@/lib/datasets";
 *   const series = await loadPublicDataset("COD/drc-ebola");
 *   // → [{ date: "2021-01-01", value: 3 }, ...]
 *
 * Adding a new country:
 * 1. Drop CSV in /public/datasets/{ISO3}/{source}.csv
 * 2. Add a DatasetConfig entry to DATASET_REGISTRY in registry.ts
 * 3. Call loadPublicDataset("{ISO3}/{source}") — no new parsing code.
 */

import { normalizeCsvToTimeSeries } from "./normalize";
import { DATASET_REGISTRY, registryKeyToPath } from "./registry";
import type { TimeSeriesPoint } from "./types";

/**
 * Fetch and normalize a public dataset by registry key.
 *
 * @param key - Registry key in the form "{ISO3}/{source}", e.g. "ZWE/who-covid"
 * @returns Normalized, sorted time series of { date, value } points
 * @throws Error if the registry key is unknown or the CSV fetch fails
 */
export async function loadPublicDataset(key: string): Promise<TimeSeriesPoint[]> {
  const config = DATASET_REGISTRY[key];
  if (!config) {
    throw new Error(
      `Unknown dataset registry key: "${key}". ` +
        `Available keys: ${Object.keys(DATASET_REGISTRY).join(", ")}`
    );
  }

  const path = registryKeyToPath(key);
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dataset "${key}" from ${path}: ` +
        `HTTP ${response.status} ${response.statusText}`
    );
  }

  const csvText = await response.text();
  return normalizeCsvToTimeSeries(csvText, config);
}

/**
 * Fetch and normalize multiple public datasets, returning a map of
 * registry key → TimeSeriesPoint[].
 *
 * Failed fetches are silently omitted and logged to console.error.
 * Use this when you want best-effort loading of several datasets at once.
 *
 * @param keys - Array of registry keys to load
 * @returns Map of successfully loaded datasets
 */
export async function loadPublicDatasets(
  keys: string[]
): Promise<Record<string, TimeSeriesPoint[]>> {
  const results = await Promise.allSettled(
    keys.map(async (key) => ({ key, data: await loadPublicDataset(key) }))
  );

  const out: Record<string, TimeSeriesPoint[]> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      out[result.value.key] = result.value.data;
    } else {
      console.error("[loadPublicDatasets] Failed to load dataset:", result.reason);
    }
  }
  return out;
}
