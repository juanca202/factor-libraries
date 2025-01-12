import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  //TODO: Replace with Map object it is more efficient
  memoryStorage: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private getValue(key: string, storage?: 'local' | 'session' | 'memory'): any {
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
  public delete(key: string, storage?: 'local' | 'session' | 'memory') {
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
  public get(key: string, storage?: 'local' | 'session' | 'memory'): any {
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
  public set(
    key: string,
    value: any,
    storage?: 'local' | 'session' | 'memory'
  ) {
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
