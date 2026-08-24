/**
 * Core normalization function for the dataset layer.
 *
 * Takes a raw CSV string and a DatasetConfig that describes the CSV's shape,
 * and produces a uniform { date, value }[] time series sorted chronologically.
 *
 * This is the only place where CSV parsing and column mapping happens —
 * all disease/country loaders call this function, so adding a new dataset
 * only requires a new DatasetConfig entry, not new parsing code.
 */

import type { DatasetConfig, TimeSeriesPoint } from "./types";

/**
 * Parse a CSV string into an array of row objects.
 *
 * Handles:
 * - Quoted fields (fields containing commas enclosed in double quotes)
 * - CRLF and LF line endings
 * - Blank trailing lines
 * - Inconsistent whitespace around headers and values
 */
function parseCsvRows(csvText: string): Record<string, string>[] {
  const lines = csvText.replace(/\r\n/g, "\n").split("\n");
  if (lines.length < 2) return [];

  // Parse headers — handle quoted headers
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = splitCsvLine(line);
    if (values.length === 0) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] ?? "").trim();
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Split a single CSV line into fields, respecting double-quoted fields
 * that may contain commas.
 */
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote ""
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Attempt to normalise a date string to ISO 8601 (YYYY-MM-DD).
 *
 * Supports:
 * - YYYY-MM-DD (passthrough)
 * - DD/MM/YYYY
 * - MM/DD/YYYY  (heuristic: if day > 12 it must be MM/DD)
 * - YYYY (year-only → YYYY-01-01)
 * - YYYY-MM (month-only → YYYY-MM-01)
 */
function toIsoDate(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;

  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Year-only
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;

  // YYYY-MM
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;

  // DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const a = parseInt(slashMatch[1]);
    const b = parseInt(slashMatch[2]);
    const year = slashMatch[3];
    if (a > 12) {
      // Must be DD/MM/YYYY
      return `${year}-${String(b).padStart(2, "0")}-${String(a).padStart(2, "0")}`;
    }
    // Default: MM/DD/YYYY (US convention)
    return `${year}-${String(a).padStart(2, "0")}-${String(b).padStart(2, "0")}`;
  }

  // Try native Date parse as fallback
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }

  return null;
}

/**
 * Normalize a raw CSV string into a uniform { date, value }[] time series.
 *
 * Steps:
 * 1. Parse CSV into row objects
 * 2. Optionally filter rows by locationFilter
 * 3. Map dateColumn → ISO date, valueColumn → number
 * 4. Optionally aggregate (sum) rows sharing the same date
 * 5. Sort chronologically
 * 6. Return TimeSeriesPoint[]
 *
 * @param rawCsv - Full text content of the CSV file
 * @param config - DatasetConfig describing the CSV's schema
 * @returns Normalized, sorted time series ready for ARIMA input
 */
export function normalizeCsvToTimeSeries(
  rawCsv: string,
  config: DatasetConfig
): TimeSeriesPoint[] {
  const rows = parseCsvRows(rawCsv);

  // Step 1: Filter by location if required
  const filtered = config.locationFilter && config.locationColumn
    ? rows.filter((row) => {
        const cell = (row[config.locationColumn!] ?? "").trim();
        return cell === config.locationFilter;
      })
    : rows;

  // Step 2: Map to (date, value) pairs, skip unparseable rows
  const mapped: TimeSeriesPoint[] = [];
  for (const row of filtered) {
    const rawDate = row[config.dateColumn] ?? "";
    const isoDate = toIsoDate(rawDate);
    if (!isoDate) continue;

    const rawValue = row[config.valueColumn] ?? "";
    const value = parseFloat(rawValue.replace(/,/g, ""));
    if (isNaN(value)) continue;

    mapped.push({ date: isoDate, value });
  }

  if (!config.aggregateByDate) {
    // No aggregation — just sort and return
    return mapped.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Step 3: Aggregate by date (sum values for same date)
  const byDate = new Map<string, number>();
  for (const point of mapped) {
    byDate.set(point.date, (byDate.get(point.date) ?? 0) + point.value);
  }

  return Array.from(byDate.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
