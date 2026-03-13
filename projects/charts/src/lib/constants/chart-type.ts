export const CHART_TYPE = {
    COLUMN: 'column',
    LINE: 'line',
    CIRCLE: 'circle',
    EVENT: 'event'
};

export type ChartType = (typeof CHART_TYPE)[keyof typeof CHART_TYPE];
