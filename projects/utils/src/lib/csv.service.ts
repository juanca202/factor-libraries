import { Injectable } from '@angular/core';

export interface CsvParsed {
  header: string[];
  content: string[][];
}

export interface Options {
  filename: string;
  fieldSeparator: string;
  quoteStrings: string;
  decimalSeparator: string;
  showLabels: boolean;
  showTitle: boolean;
  title: string;
  useTextFile: boolean;
  useBom: boolean;
  headers: string[];
  useKeysAsHeaders: boolean;
}

export class CsvConfigConsts {
  public static EOL = '\r\n';
  public static BOM = '\ufeff';

  public static DEFAULT_FIELD_SEPARATOR = ',';
  public static DEFAULT_DECIMAL_SEPARATOR = '.';
  public static DEFAULT_QUOTE = '"';
  public static DEFAULT_SHOW_TITLE = false;
  public static DEFAULT_TITLE = 'My Generated Report';
  public static DEFAULT_FILENAME = 'generated';
  public static DEFAULT_SHOW_LABELS = false;
  public static DEFAULT_USE_TEXT_FILE = false;
  public static DEFAULT_USE_BOM = true;
  public static DEFAULT_HEADER: string[] = [];
  public static DEFAULT_KEYS_AS_HEADERS = false;
}

export const ConfigDefaults: Options = {
  filename: CsvConfigConsts.DEFAULT_FILENAME,
  fieldSeparator: CsvConfigConsts.DEFAULT_FIELD_SEPARATOR,
  quoteStrings: CsvConfigConsts.DEFAULT_QUOTE,
  decimalSeparator: CsvConfigConsts.DEFAULT_DECIMAL_SEPARATOR,
  showLabels: CsvConfigConsts.DEFAULT_SHOW_LABELS,
  showTitle: CsvConfigConsts.DEFAULT_SHOW_TITLE,
  title: CsvConfigConsts.DEFAULT_TITLE,
  useTextFile: CsvConfigConsts.DEFAULT_USE_TEXT_FILE,
  useBom: CsvConfigConsts.DEFAULT_USE_BOM,
  headers: CsvConfigConsts.DEFAULT_HEADER,
  useKeysAsHeaders: CsvConfigConsts.DEFAULT_KEYS_AS_HEADERS
};

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private _data: any[] = [];
  private _options: Options;
  private _csv = '';

  get options(): Options {
    return this._options;
  }

  set options(options: Partial<Options>) {
    this._options = this.objectAssign({}, ConfigDefaults, options);
  }

  constructor() {
    this._options = this.objectAssign({}, ConfigDefaults);
  }
  /**
   * Generate and Download Csv
   */
  generate(jsonData: any, shouldReturnCsv = false): void | any {
    // Make sure to reset csv data on each run
    this._csv = '';

    this._parseData(jsonData);

    if (this._options.useBom) {
      this._csv += CsvConfigConsts.BOM;
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

    //const attachmentType = this._options.useTextFile ? 'text' : 'csv';
    // const uri = 'data:attachment/' + attachmentType + ';charset=utf-8,' + encodeURI(this._csv);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.setAttribute('visibility', 'hidden');
    link.download = this._options.filename.replace(/ /g, '_') + fileExtension;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Create Headers
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
      this._csv += row + CsvConfigConsts.EOL;
    }
  }
  /**
   * Create Body
   */
  private _getBody() {
    const keys = Object.keys(this._data[0]);
    for (var i = 0; i < this._data.length; i++) {
      let row = '';
      for (let keyPos = 0; keyPos < keys.length; keyPos++) {
        const key = keys[keyPos];
        row +=
          this._formatData(this._data[i][key]) + this._options.fieldSeparator;
      }

      row = row.slice(0, -1);
      this._csv += row + CsvConfigConsts.EOL;
    }
  }
  /**
   * Format Data
   * @param {any} data
   */
  private _formatData(data: any) {
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
   * Check if is Float
   * @param {any} input
   */
  private _isFloat(input: any) {
    return +input === input && (!isFinite(input) || Boolean(input % 1));
  }
  /**
   * Parse the collection given to it
   *
   * @private
   * @param {*} jsonData
   * @returns {any[]}
   * @memberof ExportToCsv
   */
  private _parseData(jsonData: any): any[] {
    this._data = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

    return this._data;
  }
  /**
   * Convet to Object
   * @param {any} val
   */
  toObject(val: any) {
    if (val === null || val === undefined) {
      throw new TypeError(
        'Object.assign cannot be called with null or undefined'
      );
    }
    return Object(val);
  }
  /**
   * Assign data  to new Object
   * @param {any}   target
   * @param {any[]} ...source
   */
  objectAssign(target: any, ...source: any[]) {
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
  read(csvContent: string): CsvParsed {
    const lines = csvContent.split('\n');
    let header: string[];
    let content: string[][];
    if (lines.length > 0) {
      const csv = lines.map((line) => {
        return this.parseLine(line.trim());
      }) as any;
      header = csv[0];

      // Si encuentra una linea en blanco ya no sigue leyendo las siguientes líneas
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
  parseLine(csvLine: string) {
    const values = [];
    const regex = /(?:"([^"]*)"|'([^']*)'|([^,]+))(?:,|\r?$)/g;
    let match;
    while ((match = regex.exec(csvLine)) !== null) {
      values.push(match[1] || match[2] || match[3]); // Extraer el valor correcto
    }
    return values;
  }
}
