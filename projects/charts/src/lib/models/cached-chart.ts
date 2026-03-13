import { Chart, ChartOptions } from "./chart";

export interface CachedChart {
  items: Chart[];
  options?: ChartOptions;
  yDomain?: [number, number];
}
