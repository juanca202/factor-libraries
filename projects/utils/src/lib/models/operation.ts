export interface Operation {
    method: 'add' | 'update' | 'delete';
    entity: any;
}