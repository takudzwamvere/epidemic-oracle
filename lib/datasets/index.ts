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
  getDatasetsByCountry,
  type CountryMeta
} from "./registry";
export {
  ACTUAL_DATASETS,
  getActualDatasets,
  getActualDatasetByName,
  type ActualDataset
} from "./actual-datasets";
export type { DatasetConfig, TimeSeriesPoint } from "./types";
