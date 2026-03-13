import { Injectable } from '@angular/core';

/**
 * Utility service for date operations.
 *
 * @remarks
 * Provides helper methods for date parsing and manipulation.
 */
@Injectable({
  providedIn: 'root',
})
export class DateUtil {
  /**
   * Parses a date string in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss) and returns a Date object.
   *
   * @param date - The date string to parse (ISO format)
   * @returns A Date object representing the parsed date
   *
   * @example
   * ```typescript
   * const date = dateUtil.getDate('2025-01-15');
   * // Returns: Date object for January 15, 2025
   * ```
   */
  public getDate(date: string): Date {
    const dateParts: string[] = date.split('T')[0].split('-');
    return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
  }
}
