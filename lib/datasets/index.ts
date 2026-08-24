/**
 * Barrel export for the dataset normalization layer.
 */

export { loadPublicDataset, loadPublicDatasets } from "./loader";
export { normalizeCsvToTimeSeries } from "./normalize";
export { 
  DATASET_REGISTRY, 
  SUPPORTED_COUNTRIES, 
  registryKeyToPath,
  getCountryByIso3,
  getDatasetsByCountry,
  type CountryMeta
} from "./registry";
export type { DatasetConfig, TimeSeriesPoint } from "./types";
