/**
 * Barrel export for the dataset normalization layer and actual dataset catalog.
 */

export { loadPublicDataset, loadPublicDatasets } from "./loader";
export { normalizeCsvToTimeSeries } from "./normalize";
export { 
  DATASET_REGISTRY, 
  SUPPORTED_COUNTRIES, 
  registryKeyToPath,
  getCountryByIso3,
  getCountryByName,
  getDatasetsByCountry,
  getDatasetsByDisease,
  isValidRegistryKey,
  type CountryMeta
} from "./registry";
export {
  ACTUAL_DATASETS,
  getActualDatasets,
  getActualDatasetByName,
  getActualDatasetById,
  getActualDatasetsByCategory,
  type ActualDataset
} from "./actual-datasets";
export type { DatasetConfig, TimeSeriesPoint, DatasetSummary, DatasetCategory, DatasetFilterOptions } from "./types";
