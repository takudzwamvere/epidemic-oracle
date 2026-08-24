/**
 * Barrel export for the dataset normalization layer.
 *
 * Public API surface:
 *   - loadPublicDataset(key)   — fetch + normalize one public dataset
 *   - loadPublicDatasets(keys) — parallel fetch + normalize, best-effort
 *   - normalizeCsvToTimeSeries(rawCsv, config) — normalize raw CSV text
 *   - DATASET_REGISTRY         — typed map of all known dataset configs
 *   - registryKeyToPath(key)   — derive file path from registry key
 *   - Types: DatasetConfig, TimeSeriesPoint
 */

export { loadPublicDataset, loadPublicDatasets } from "./loader";
export { normalizeCsvToTimeSeries } from "./normalize";
export { DATASET_REGISTRY, registryKeyToPath } from "./registry";
export type { DatasetConfig, TimeSeriesPoint } from "./types";
