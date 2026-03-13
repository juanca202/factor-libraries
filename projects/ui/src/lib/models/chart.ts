import { ChartType } from "../constants/chart-type";

export interface ChartOptions {
    xAxis?: {
        visible: boolean
    }
}

export interface Chart {
    data: any[];
    type: ChartType;
    field: string;
    categoryField: string;
    label?: string;
    color?: string;
    domain?: any;
    padding?: number;
    strokeWidth?: number;
    circleRadius?: number;
    click?: (event: MouseEvent, d: any) => void;
}