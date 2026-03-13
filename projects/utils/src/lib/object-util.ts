import { Injectable } from '@angular/core';

/**
 * Utility service for object operations.
 *
 * @remarks
 * Provides helper methods for object manipulation and transformation.
 */
@Injectable({
  providedIn: 'root',
})
export class ObjectUtil {
  /**
   * Filters out null, undefined, and 'undefined' string properties from an object.
   *
   * @param obj - The object to filter
   * @returns A new object with null/undefined properties removed
   *
   * @example
   * ```typescript
   * const filtered = objectUtil.filterNullProperties({ a: 1, b: null, c: undefined });
   * // Returns: { a: 1 }
   * ```
   */
  public filterNullProperties(obj: any): any {
    const mappedObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== 'undefined') {
        mappedObj[key] = obj[key];
      }
    });
    return mappedObj;
  }
  /**
   * Performs a deep merge of two objects, combining nested properties.
   *
   * @param target - The target object to merge into
   * @param source - The source object to merge from
   * @returns A new object with deeply merged properties
   *
   * @remarks
   * Uses structuredClone to avoid mutating the original objects.
   *
   * @example
   * ```typescript
   * const merged = objectUtil.deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
   * // Returns: { a: { b: 1, c: 2 } }
   * ```
   */
  public deepMerge(target: any, source: any): any {
    source = structuredClone(source);
    target = structuredClone(target);
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], this.deepMerge(target[key], source[key]));
      }
    }
    return { ...target, ...source };
  }
}
