export interface Task {
    id: string;
    label: string;
    type: 'task' | 'milestone';
    startAt?: Date | string;
    endAt?: Date | string;
    class?: string;
    color?: string;
    children?: Task[];
}