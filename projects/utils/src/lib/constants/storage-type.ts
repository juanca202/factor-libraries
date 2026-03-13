/**
 * Constants for storage type options.
 */
export const STORAGE_TYPE = {
    /** Browser localStorage */
    LOCAL: 'local',
    /** Browser sessionStorage */
    SESSION: 'session',
    /** In-memory storage (not persisted) */
    MEMORY: 'memory'
} as const;

/**
 * Type representing valid storage types.
 */
export type StorageType = (typeof STORAGE_TYPE)[keyof typeof STORAGE_TYPE];
