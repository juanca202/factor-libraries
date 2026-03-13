import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { StorageType } from './constants/storage-type';

/**
 * Service for managing browser storage (localStorage, sessionStorage, and memory storage).
 *
 * @remarks
 * Provides a unified interface for storing and retrieving data from different storage types.
 * Automatically handles JSON serialization/deserialization and platform detection.
 *
 * @example
 * ```typescript
 * const storage = inject(Storage);
 * storage.set('key', { data: 'value' }, 'local');
 * const value = storage.get('key', 'local');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class Storage {
  // TODO: Replace with Map object it is more efficient
  private memoryStorage: any = {};
  private readonly platformId = inject(PLATFORM_ID);

  private getValue(key: string, storage?: StorageType): any {
    let value: any;
    if (!storage || typeof storage == 'string') {
      switch (storage) {
        case 'local':
          value = localStorage[key];
          break;
        case 'memory':
          value = this.memoryStorage[key];
          break;
        default:
          value = sessionStorage[key];
          break;
      }
    } else if (typeof storage == 'object') {
      value = storage[key];
    }
    return value;
  }
  /**
   * Deletes a value from the specified storage.
   *
   * @param key - The key of the value to delete
   * @param storage - The storage type ('local', 'session', or 'memory'). Defaults to 'session'
   */
  public delete(key: string, storage?: StorageType): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!storage || typeof storage == 'string') {
        switch (storage) {
          case 'local':
            delete localStorage[key];
            break;
          case 'memory':
            delete this.memoryStorage[key];
            break;
          default:
            delete sessionStorage[key];
            break;
        }
      } else if (typeof storage == 'object') {
        delete storage[key];
      }
    }
  }
  /**
   * Retrieves a value from the specified storage.
   *
   * @param key - The key of the value to retrieve
   * @param storage - The storage type ('local', 'session', or 'memory'). Defaults to 'session'
   * @returns The parsed value (if JSON) or the raw value, or undefined if not found
   *
   * @remarks
   * Automatically attempts to parse JSON values. If parsing fails, returns the raw string.
   */
  public get(key: string, storage?: StorageType): any {
    let parsedValue: any;
    if (isPlatformBrowser(this.platformId)) {
      try {
        parsedValue = JSON.parse(this.getValue(key, storage));
      } catch (err) {
        parsedValue = this.getValue(key, storage);
      }
    }
    return parsedValue;
  }
  /**
   * Stores a value in the specified storage.
   *
   * @param key - The key to store the value under
   * @param value - The value to store (will be JSON stringified)
   * @param storage - The storage type ('local', 'session', or 'memory'). Defaults to 'session'
   *
   * @remarks
   * Values are automatically JSON stringified before storage.
   */
  public set(
    key: string,
    value: any,
    storage?: StorageType
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      const valueString = JSON.stringify(value);
      if (!storage || typeof storage == 'string') {
        switch (storage) {
          case 'local':
            localStorage[key] = valueString;
            break;
          case 'memory':
            this.memoryStorage[key] = valueString;
            break;
          default:
            sessionStorage[key] = valueString;
            break;
        }
      }
    }
  }
}
