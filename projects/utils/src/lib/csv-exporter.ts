import { Injectable } from '@angular/core';
import { CsvOptions, CsvParsed } from './models/csv';
import { CSV_CONFIG } from './constants/csv-config';

/**
 * Service for exporting data to CSV format and parsing CSV content.
 *
 * @remarks
 * Provides functionality to generate CSV files from JSON data with customizable options,
 * and to parse CSV content back into structured data.
 *
 * @example
 * ```typescript
 * const csvExporter = inject(CsvExporter);
 * csvExporter.options = { filename: 'export', showLabels: true };
 * csvExporter.generate([{ name: 'John', age: 30 }]);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CsvExporter {
  private _data: any[] = [];
  private _options!: CsvOptions;
  private _csv = '';
  private readonly configDefaults: CsvOptions = {
    filename: CSV_CONFIG.DEFAULT_FILENAME,
    fieldSeparator: CSV_CONFIG.DEFAULT_FIELD_SEPARATOR,
    quoteStrings: CSV_CONFIG.DEFAULT_QUOTE,
    decimalSeparator: CSV_CONFIG.DEFAULT_DECIMAL_SEPARATOR,
    showLabels: CSV_CONFIG.DEFAULT_SHOW_LABELS,
    showTitle: CSV_CONFIG.DEFAULT_SHOW_TITLE,
    title: CSV_CONFIG.DEFAULT_TITLE,
    useTextFile: CSV_CONFIG.DEFAULT_USE_TEXT_FILE,
    useBom: CSV_CONFIG.DEFAULT_USE_BOM,
    headers: [...CSV_CONFIG.DEFAULT_HEADER],
    useKeysAsHeaders: CSV_CONFIG.DEFAULT_KEYS_AS_HEADERS
  };

  get options(): CsvOptions {
    return this._options;
  }

  set options(options: Partial<CsvOptions>) {
    this._options = this.objectAssign({}, this.configDefaults, options);
  }

  constructor() {
    this._options = this.objectAssign({}, this.configDefaults) as CsvOptions;
  }
  /**
   * Generates a CSV file from JSON data and optionally downloads it.
   *
   * @param jsonData - The data to export (array of objects or JSON string)
   * @param shouldReturnCsv - If true, returns the CSV string instead of downloading
   * @returns The CSV string if shouldReturnCsv is true, otherwise void
   *
   * @example
   * ```typescript
   * // Download CSV
   * csvExporter.generate([{ name: 'John', age: 30 }]);
   *
   * // Get CSV string
   * const csvString = csvExporter.generate([{ name: 'John' }], true);
   * ```
   */
  public generate(jsonData: any, shouldReturnCsv = false): void | any {
    // Make sure to reset csv data on each run
    this._csv = '';

    this._parseData(jsonData);

    if (this._options.useBom) {
      this._csv += CSV_CONFIG.BOM;
    }

    if (this._options.showTitle) {
      this._csv += this._options.title + '\r\n\n';
    }

    this._getHeaders();
    this._getBody();

    if (this._csv == '') {
      console.log('Invalid data');
      return;
    }

    // When the consumer asks for the data, exit the function
    // by returning the CSV data built at this point
    if (shouldReturnCsv) {
      return this._csv;
    }

    // Create CSV blob to download if requesting in the browser and the
    // consumer doesn't set the shouldReturnCsv param
    const FileType = this._options.useTextFile ? 'plain' : 'csv';
    const fileExtension = this._options.useTextFile ? '.txt' : '.csv';
    const blob = new Blob([this._csv], {
      type: 'text/' + FileType + ';charset=utf8;'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.setAttribute('visibility', 'hidden');
    link.download = this._options.filename.replace(/ /g, '_') + fileExtension;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Creates CSV headers row based on configuration.
   *
   * @private
   */
  private _getHeaders(): void {
    if (!this._options.showLabels && !this._options.useKeysAsHeaders) {
      return;
    }
    const useKeysAsHeaders = this._options.useKeysAsHeaders;
    const headers: string[] = useKeysAsHeaders
      ? Object.keys(this._data[0])
      : this._options.headers;

    if (headers.length > 0) {
      let row = '';
      for (let keyPos = 0; keyPos < headers.length; keyPos++) {
        row += headers[keyPos] + this._options.fieldSeparator;
      }

      row = row.slice(0, -1);
      this._csv += row + CSV_CONFIG.EOL;
    }
  }
  /**
   * Creates CSV body rows from the data.
   *
   * @private
   */
  private _getBody(): void {
    const keys = Object.keys(this._data[0]);
    for (var i = 0; i < this._data.length; i++) {
      let row = '';
      for (let keyPos = 0; keyPos < keys.length; keyPos++) {
        const key = keys[keyPos];
        row +=
          this._formatData(this._data[i][key]) + this._options.fieldSeparator;
      }

      row = row.slice(0, -1);
      this._csv += row + CSV_CONFIG.EOL;
    }
  }
  /**
   * Formats data for CSV output according to configuration.
   *
   * @param data - The data value to format
   * @returns The formatted data as a string
   * @private
   */
  private _formatData(data: any): any {
    if (this._options.decimalSeparator === 'locale' && this._isFloat(data)) {
      return data.toLocaleString();
    }

    if (this._options.decimalSeparator !== '.' && this._isFloat(data)) {
      return data.toString().replace('.', this._options.decimalSeparator);
    }

    if (typeof data === 'string') {
      data = data.replace(/"/g, '""');
      if (
        this._options.quoteStrings ||
        data.indexOf(',') > -1 ||
        data.indexOf('\n') > -1 ||
        data.indexOf('\r') > -1
      ) {
        data = this._options.quoteStrings + data + this._options.quoteStrings;
      }
      return data;
    }

    if (typeof data === 'boolean') {
      return data ? 'TRUE' : 'FALSE';
    }
    return data;
  }
  /**
   * Checks if a value is a floating point number.
   *
   * @param input - The value to check
   * @returns True if the value is a float, false otherwise
   * @private
   */
  private _isFloat(input: any): boolean {
    return +input === input && (!isFinite(input) || Boolean(input % 1));
  }
  /**
   * Parses JSON data into an array format.
   *
   * @param jsonData - The JSON data to parse (object, array, or JSON string)
   * @returns Parsed array of data
   * @private
   */
  private _parseData(jsonData: any): any[] {
    this._data = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

    return this._data;
  }
  /**
   * Converts a value to an object, throwing an error for null or undefined.
   *
   * @param val - The value to convert
   * @returns The value as an object
   * @throws {TypeError} If val is null or undefined
   */
  public toObject(val: any): any {
    if (val === null || val === undefined) {
      throw new TypeError(
        'Object.assign cannot be called with null or undefined'
      );
    }
    return Object(val);
  }
  /**
   * Assigns properties from source objects to a target object (similar to Object.assign).
   *
   * @param target - The target object to assign properties to
   * @param source - One or more source objects to copy properties from
   * @returns The target object with assigned properties
   */
  public objectAssign(target: any, ...source: any[]): any {
    let from: any;
    const to = this.toObject(target);
    let symbols: any;
    let hasOwnProperty = Object.prototype.hasOwnProperty;
    let propIsEnumerable = Object.prototype.propertyIsEnumerable;

    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if ((<any>Object).getOwnPropertySymbols) {
        symbols = (<any>Object).getOwnPropertySymbols(from);
        for (let i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to;
  }
  /**
   * Parses CSV content into a structured format with headers and content rows.
   *
   * @param csvContent - The CSV string to parse
   * @returns An object containing the header array and content rows array
   *
   * @example
   * ```typescript
   * const parsed = csvExporter.read('name,age\nJohn,30\nJane,25');
   * // Returns: { header: ['name', 'age'], content: [['John', '30'], ['Jane', '25']] }
   * ```
   */
  public read(csvContent: string): CsvParsed {
    const lines = csvContent.split('\n');
    let header: string[];
    let content: string[][];
    if (lines.length > 0) {
      const csv = lines.map((line) => {
        return this.parseLine(line.trim());
      }) as any;
      header = csv[0];

      // If a blank line is found, stop reading subsequent lines
      let breakIndex!: number;
      csv.some((row: string[], index: number) => {
        const isBlankLine = row.every((column: string) => column.trim() === '');
        if (isBlankLine) {
          breakIndex = index;
          return true;
        }
        return false;
      });
      content = csv.slice(1, breakIndex);
    } else {
      header = [];
      content = [];
    }
    return {
      header,
      content
    };
  }
  /**
   * Parses a single CSV line into an array of values.
   *
   * @param csvLine - A single line of CSV content
   * @returns Array of parsed values from the line
   *
   * @remarks
   * Handles quoted values and different quote styles (single and double quotes).
   */
  public parseLine(csvLine: string): string[] {
    const values = [];
    const regex = /(?:"([^"]*)"|'([^']*)'|([^,]+))(?:,|\r?$)/g;
    let match;
    while ((match = regex.exec(csvLine)) !== null) {
      values.push(match[1] || match[2] || match[3]); // Extract the correct value
    }
    return values;
  }
}
