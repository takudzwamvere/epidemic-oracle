/**
 * Shared types for the dataset normalization layer.
 *
 * The normalization layer converts any raw CSV (regardless of shape) into a
 * uniform { date, value }[] time series ready to feed into the ARIMA model.
 */

/**
 * Describes the schema of a particular CSV dataset so the normalizer knows
 * how to extract a (date, value) time series from it.
 */
export interface DatasetConfig {
  /** ISO 3166-1 alpha-3 country code, e.g. "ZWE", "COD", "ZMB" */
  iso3: string;
  /** Disease or event category, e.g. "covid", "ebola", "cholera", "disaster" */
  disease: string;
  /** Column header that contains the date value */
  dateColumn: string;
  /**
   * Column header for the country/location identifier.
   * Set to null for single-country files that have no location column.
   */
  locationColumn: string | null;
  /**
   * The exact string to match in locationColumn when filtering rows.
   * Set to null to skip filtering (include all rows).
   */
  locationFilter: string | null;
  /** Column header for the numeric case count / value to extract */
  valueColumn: string;
  /**
   * When true, rows sharing the same date are aggregated (summed) so
   * sub-national location-level data becomes a single country-level series.
   * Set to false for files already at country level (one row per date).
   */
  aggregateByDate: boolean;
  /**
   * Optional hint for date parsing, e.g. "YYYY-MM-DD", "DD/MM/YYYY".
   * The normalizer attempts ISO 8601 parsing by default.
   */
  dateFormat?: string;
}

/**
 * A single point in a normalized time series.
 * The `date` field is always an ISO 8601 date string (YYYY-MM-DD).
 */
export interface TimeSeriesPoint {
  /** ISO 8601 date string, e.g. "2021-03-15" */
  date: string;
  /** Numeric case count or value at this date */
  value: number;
}
