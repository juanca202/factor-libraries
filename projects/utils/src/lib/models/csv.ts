/**
 * Parsed CSV data structure.
 */
export interface CsvParsed {
    /** Array of header column names */
    header: string[];
    /** Two-dimensional array of content rows */
    content: string[][];
}

/**
 * Configuration options for CSV export.
 */
export interface CsvOptions {
    /** Name of the exported file (without extension) */
    filename: string;
    /** Character used to separate fields (default: ',') */
    fieldSeparator: string;
    /** Character used to quote strings (default: '"') */
    quoteStrings: string;
    /** Decimal separator for numbers (default: '.' or 'locale') */
    decimalSeparator: string;
    /** Whether to show column headers */
    showLabels: boolean;
    /** Whether to show a title row */
    showTitle: boolean;
    /** Title text to display if showTitle is true */
    title: string;
    /** Whether to export as .txt instead of .csv */
    useTextFile: boolean;
    /** Whether to include BOM (Byte Order Mark) for UTF-8 */
    useBom: boolean;
    /** Custom header names (if not using keys as headers) */
    headers: string[];
    /** Whether to use object keys as header names */
    useKeysAsHeaders: boolean;
  }