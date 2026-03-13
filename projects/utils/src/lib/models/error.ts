/**
 * Error object structure for application error handling.
 */
export interface Error {
  /** Optional error code */
  code?: number;
  /** Optional icon identifier for error display */
  icon?: string;
  /** Optional error title */
  title?: string;
  /** Error message (required) */
  message: string;
}
