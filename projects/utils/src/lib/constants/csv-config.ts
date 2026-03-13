/**
 * Default configuration constants for CSV export operations.
 */
export const CSV_CONFIG = {
    /** End of line character for CSV */
    EOL: '\r\n',
    /** Byte Order Mark for UTF-8 encoding */
    BOM: '\ufeff',
    /** Default field separator character */
    DEFAULT_FIELD_SEPARATOR: ',',
    /** Default decimal separator */
    DEFAULT_DECIMAL_SEPARATOR: '.',
    /** Default quote character for strings */
    DEFAULT_QUOTE: '"',
    /** Default value for showing title */
    DEFAULT_SHOW_TITLE: false,
    /** Default title text */
    DEFAULT_TITLE: 'My Generated Report',
    /** Default filename (without extension) */
    DEFAULT_FILENAME: 'generated',
    /** Default value for showing column labels */
    DEFAULT_SHOW_LABELS: false,
    /** Default value for using text file format */
    DEFAULT_USE_TEXT_FILE: false,
    /** Default value for including BOM */
    DEFAULT_USE_BOM: true,
    /** Default header array (empty) */
    DEFAULT_HEADER: [],
    /** Default value for using object keys as headers */
    DEFAULT_KEYS_AS_HEADERS: false
} as const;

/**
 * Type representing valid CSV configuration values.
 */
export type CsvConfig = (typeof CSV_CONFIG)[keyof typeof CSV_CONFIG];
