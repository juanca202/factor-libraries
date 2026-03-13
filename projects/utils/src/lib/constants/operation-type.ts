/**
 * Constants for CRUD operation types.
 */
export const OPERATION_TYPE = {
  /** Create operation */
  CREATE: 'create',
  /** Update operation */
  UPDATE: 'update',
  /** Delete operation */
  DELETE: 'delete'
} as const;

/**
 * Type representing valid operation types.
 */
export type OperationType = (typeof OPERATION_TYPE)[keyof typeof OPERATION_TYPE];
