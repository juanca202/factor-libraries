import { OperationType } from "../constants/operation-type";

/**
 * Represents a CRUD operation on an entity.
 */
export interface Operation {
    /** The type of operation (create, update, delete) */
    method: OperationType;
    /** The entity data for the operation */
    entity: any;
}