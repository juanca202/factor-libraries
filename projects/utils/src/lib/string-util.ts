import { Injectable } from '@angular/core';

/**
 * Utility service for string operations.
 *
 * @remarks
 * Provides helper methods for common string manipulation and formatting tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class StringUtil {
  /**
   * Decodes HTML entities in a string.
   *
   * @param text - The string containing HTML entities to decode
   * @returns The decoded string
   *
   * @example
   * ```typescript
   * const encoded = '&lt;div&gt;Hello&lt;/div&gt;';
   * const decoded = stringUtil.decodeHTML(encoded);
   * // Returns: '<div>Hello</div>'
   * ```
   */
  public decodeHTML(text: string): string {
    const span = document.createElement('span');
    return text.replace(/&[#A-Za-z0-9]+;/gi, (entity) => {
      span.innerHTML = entity;
      return span.innerText;
    });
  }
  /**
   * Normalizes a text by converting to lowercase and removing accents.
   *
   * @param text - The text to normalize
   * @returns The normalized text without accents and in lowercase
   *
   * @example
   * ```typescript
   * const normalized = stringUtil.normalize('Café');
   * // Returns: 'cafe'
   * ```
   */
  public normalize(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  /**
   * Normalizes a name by trimming whitespace and capitalizing the first letter.
   *
   * @param text - The name text to normalize
   * @returns The normalized name with first letter capitalized
   *
   * @example
   * ```typescript
   * const normalized = stringUtil.normalizeName('  john doe  ');
   * // Returns: 'John doe'
   * ```
   */
  public normalizeName(text: string): string {
    text = text.trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return text;
  }
  /**
   * Calculates the estimated reading time in milliseconds for a given text.
   *
   * @param text - The text to calculate reading time for
   * @returns The estimated reading time in milliseconds
   *
   * @remarks
   * Uses a reading speed of 1200 characters per minute.
   *
   * @example
   * ```typescript
   * const readingTime = stringUtil.calculateReadingTime('Long text here...');
   * // Returns: estimated milliseconds
   * ```
   */
  public calculateReadingTime(text: string): number {
    // Characters per minute
    const cpm = 1200;

    // Calculate the number of characters in the text
    const numCharacters: number = text.length;

    // Calculate reading time in minutes
    const readingTimeMinutes: number = numCharacters / cpm;

    // Convert reading time from minutes to milliseconds
    const readingTimeMilliseconds: number = readingTimeMinutes * 60 * 1000;

    return readingTimeMilliseconds;
  }
}
