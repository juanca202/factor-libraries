export interface Chart {
    data: any[];
    type: string;
    field: string;
    categoryField: string;
    label?: string;
    color?: string;
    domain?: any;
    padding?: number;
    strokeWidth?: number;
    click?: (event: MouseEvent, d: any) => void;
}