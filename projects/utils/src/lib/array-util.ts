import { Injectable } from '@angular/core';

/**
 * Utility service for array operations.
 *
 * @remarks
 * Provides helper methods for common array manipulation tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class ArrayUtil {
  /**
   * Merges multiple arrays into a single array, combining objects with the same property value.
   *
   * @param arrays - Array of arrays to merge
   * @param prop - Property name to use as the key for merging objects
   * @returns Merged array with combined objects
   *
   * @example
   * ```typescript
   * const arr1 = [{ id: 1, name: 'John' }];
   * const arr2 = [{ id: 1, age: 30 }];
   * const result = arrayUtil.merge([arr1, arr2], 'id');
   * // Returns: [{ id: 1, name: 'John', age: 30 }]
   * ```
   */
  public merge(arrays: any[], prop: string): any[] {
    const merged: any = {};
    arrays.forEach(arr => {
      arr.forEach((item: any) => {
        merged[item[prop]] = Object.assign({}, merged[item[prop]], item);
      });
    });
    return Object.values(merged);
  }
}
