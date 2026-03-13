import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import { Selection, ScaleBand, ScaleLinear } from 'd3';

import { ChartType } from './constants/chart-type';
import { CachedChart } from './models/cached-chart';
import { Chart, ChartOptions } from './models/chart';

@Injectable({
  providedIn: 'root'
})
export class ChartRenderer {
  private charts = new Map<SVGElement, CachedChart>();
  private observers = new Map<SVGElement, MutationObserver>();
  private readonly paddingTop = 4;
  private readonly paddingBottom = 4;
  private readonly defaultColor = '#ff9800';
  private readonly defaultStrokeWidth = 2;
  private readonly defaultCircleRadius = 3;
  private resizeTimeout!: ReturnType<typeof setTimeout>;
  private readonly transitionDuration = 300;

  constructor() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  // Métodos privados...
  private calcYDomain(items: Chart[]): [number, number] {
    let yMin = Infinity;
    let yMax = -Infinity;

    items.forEach((item) => {
      if (item.field) {
        item.data.forEach((d) => {
          const value = +d[item.field!];
          if (!isNaN(value)) {
            yMin = Math.min(yMin, value);
            yMax = Math.max(yMax, value);
          }
        });
      }
    });

    if (yMin === Infinity || yMax === -Infinity) return [0, 0];
    return [yMin, yMax];
  }
  public clear(element: SVGElement) {
    d3.select(element).selectAll('*').remove();
  }
  private drawCircleChart(
    svg: Selection<SVGElement, unknown, null, undefined>,
    chart: Chart,
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>
  ) {
    // Si no tiene registros no debe hacer nada
    if (!chart.data?.length) {
      return;
    }

    const xAccessor = (d: any) =>
      (xScale(d[chart.categoryField]) ?? 0) + xScale.bandwidth() / 2;
    const yAccessor = (d: any) => yScale(d[chart.field || '']);
    const defaultRadius = chart.circleRadius ?? this.defaultCircleRadius;
    const defaultFill = chart.color ?? this.defaultColor;
  
    const group = svg
      .selectAll(`.ft-chart__circle.ft-y-axis__${chart.field}.ft-x-axis__${chart.categoryField}`)
      .data([null])
      .join('g')
      .attr('class', `ft-chart__circle ft-y-axis__${chart.field} ft-x-axis__${chart.categoryField}`);
  
    // 1. Unir datos
    const circles = group.selectAll('circle').data(chart.data, (d: any) =>
      d ? d[chart.categoryField] : undefined
    );
  
    // 2. Transición de salida (exit)
    circles.exit()
      .interrupt()
      .transition()
      .duration(this.transitionDuration / 2)
      .attr('r', 0) // Encoger a radio 0
      .remove();
  
    // 3. Transición de entrada (enter)
    const circlesEnter = circles.enter()
      .append('circle')
      .attr('cx', xAccessor)
      .attr('cy', yAccessor)
      .attr('r', 0) // Empezar con radio 0
      .attr('fill', defaultFill);
  
    // 4. Transición de actualización (update) y entrada (merge)
    circlesEnter.merge(circles as any)
      .interrupt()
      .transition()
      .duration(this.transitionDuration)
      .attr('cx', xAccessor)
      .attr('cy', yAccessor)
      .attr('r', defaultRadius) // Animar al radio final
      .attr('fill', defaultFill);
  }
  private drawColumnChart(
    svg: Selection<SVGElement, unknown, null, undefined>,
    chart: Chart,
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>
  ) {
    // Si no tiene registros no debe hacer nada
    if (!chart.data?.length) {
      return;
    }

    const xAccessor = (d: any) => xScale(d[chart.categoryField]) ?? 0;

    const columnGroup = svg
      .selectAll(`.ft-chart__column.ft-y-axis__${chart.field}.ft-x-axis__${chart.categoryField}`)
      .data([null])
      .join('g')
      .attr('class', `ft-chart__column ft-y-axis__${chart.field} ft-x-axis__${chart.categoryField}`);

    const rects = columnGroup.selectAll('rect').data(chart.data, (d: any) =>
      d ? d[chart.categoryField] : undefined
    );

    rects.exit()
      .interrupt()
      .transition()
      .duration(this.transitionDuration / 2)
      .attr('height', 0)
      .attr('y', yScale(0))
      .remove();

    const rectsEnter = rects.enter()
      .append('rect')
      .attr('x', xAccessor)
      .attr('width', xScale.bandwidth())
      .attr('y', yScale(0))
      .attr('height', 0)
      .attr('fill', chart.color ?? this.defaultColor);

    rectsEnter
      .interrupt()
      .transition()
      .duration(this.transitionDuration)
      .attr('y', (d: any) => Math.min(yScale(d[chart.field || ''] || 0), yScale(0)))
      .attr('height', (d: any) =>
        Math.abs(yScale(d[chart.field || ''] || 0) - yScale(0))
      );

    rects
      .interrupt()
      .transition()
      .duration(this.transitionDuration)
      .attr('x', xAccessor)
      .attr('width', xScale.bandwidth())
      .attr('y', (d: any) => Math.min(yScale(d[chart.field || ''] || 0), yScale(0)))
      .attr('height', (d: any) =>
        Math.abs(yScale(d[chart.field || ''] || 0) - yScale(0))
      )
      .attr('fill', chart.color ?? this.defaultColor);
  }
  private drawEventsPlaceholder(
    svg: Selection<SVGElement, unknown, null, undefined>,
    chart: Chart,
    yMin: number,
    yMax: number,
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>
  ): void {
    // Si no tiene registros no debe hacer nada
    if (!chart.data?.length) {
      return;
    }

    const bandWidth = xScale.bandwidth();
    const bandStep = xScale.step();
    const padding = bandStep - bandWidth;

    const layer = svg
      .selectAll(`.ft-chart__placeholder`)
      .data([null])
      .join('g')
      .attr('class', `ft-chart__placeholder`);

    layer
      .selectAll('rect')
      .data(chart.data)
      .join('rect')
      .attr(
        'x',
        (d: any) => (xScale(d[chart.categoryField]) ?? 0) - padding / 2
      )
      .attr('y', yScale(yMax))
      .attr('width', Math.max(1, bandStep))
      .attr('height', Math.abs(yScale(yMin) - yScale(yMax)))
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('shape-rendering', 'crispEdges')
      .attr('tabindex', 0)
      .on('click', (event: MouseEvent, d: unknown) => {
        if (chart.click) {
          chart.click(event, d);
        }
      });
  }
  private drawLineChart(
    svg: Selection<SVGElement, unknown, null, undefined>,
    chart: Chart,
    xScale: ScaleBand<string>,
    yScale: ScaleLinear<number, number>
  ) {
    // Si no tiene registros no debe hacer nada
    if (!chart.data?.length) {
      return;
    }
    
    const xAccessor = (d: any) =>
      (xScale(d[chart.categoryField]) ?? 0) + xScale.bandwidth() / 2;
    const yAccessor = (d: any) => yScale(d[chart.field || '']);
  
    const lineGenerator = d3.line<any>().x(xAccessor).y(yAccessor);
    const pathData = lineGenerator(chart.data) ?? '';
  
    const group = svg
      .selectAll(`.ft-chart__line.ft-y-axis__${chart.field}.ft-x-axis__${chart.categoryField}`)
      .data([null])
      .join('g')
      .attr('class', `ft-chart__line ft-y-axis__${chart.field} ft-x-axis__${chart.categoryField}`);
  
    //  Explicitly type the selection to SVGPathElement
    const path = group.selectAll<SVGPathElement, any[]>('path').data([chart.data]);
  
    // Handle the 'enter' case
    const pathEnter = path.enter()
      .append('path')
      .attr('d', (d: any[]) => {
        // Create a flat line at the first point for the initial animation
        const initialPath = d3.line<any>()
          .x(xAccessor)
          .y(yScale(d[0][chart.field || '']))(d);
        return initialPath ?? '';
      });
  
    // Merge new and existing paths
    const mergedPath = pathEnter.merge(path);
  
    mergedPath
      .attr('fill', 'none')
      .attr('stroke', chart.color ?? this.defaultColor)
      .attr('stroke-width', chart.strokeWidth ?? this.defaultStrokeWidth)
      .attr('stroke-linecap', 'round')
      .transition()
      .duration(this.transitionDuration)
      .attr('d', pathData);
  
    // Handle the 'exit' case
    path.exit()
      .transition()
      .duration(this.transitionDuration / 2)
      .attr('d', 'M0,0') 
      .remove();
  }
  private drawXAxis(
    svg: Selection<SVGElement, unknown, null, undefined>,
    yScale: ScaleLinear<number, number>,
    width: number
  ): void {
    const line = svg
      .selectAll('.ft-chart__x-axis')
      .data([null])
      .join('line')
      .attr('class', 'ft-chart__x-axis')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('stroke', 'var(--ft-border-color)')
      .attr('stroke-width', this.defaultStrokeWidth);

    line
      .interrupt()
      .transition()
      .duration(this.transitionDuration)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0));
  }
  private handleResize(): void {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      // Ahora podemos iterar con seguridad sobre las claves del Map
      for (const element of this.charts.keys()) {
        const cached = this.charts.get(element);
        if (cached) {
          this.render(element, cached.items, cached.options);
        }
      }
    }, 300);
  }
  private remove(element: SVGElement): void {
    const observer = this.observers.get(element);
    if (observer) {
      observer.disconnect();
      this.observers.delete(element);
    }
    this.charts.delete(element);
  }
  private rendererMap: Record<
    ChartType,
    (
      svg: Selection<SVGElement, unknown, null, undefined>,
      chart: Chart,
      xScale: ScaleBand<string>,
      yScale: ScaleLinear<number, number>,
      yDomain: [number, number],
      width: number
    ) => void
  > = {
    column: (svg, chart, xScale, yScale) =>
      this.drawColumnChart(svg, chart, xScale, yScale),
    line: (svg, chart, xScale, yScale) =>
      this.drawLineChart(svg, chart, xScale, yScale),
    circle: (svg, chart, xScale, yScale) =>
      this.drawCircleChart(svg, chart, xScale, yScale),
    event: (svg, chart, xScale, yScale, yDomain) =>
      this.drawEventsPlaceholder(svg, chart, yDomain[0], yDomain[1], xScale, yScale),
  };

  public render(element: SVGElement, items: Chart[], options?: ChartOptions) {
    const svg = d3.select(element);

    // Asegúrate de que el observador no esté ya presente para este elemento
    if (!this.charts.has(element)) {
        // Configura un MutationObserver para limpiar el Map automáticamente
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach((node) => {
                        // Verifica si el nodo removido es el elemento del gráfico o su contenedor
                        if (node === element || node.contains(element)) {
                            this.remove(element);
                        }
                    });
                }
            });
        });

        // Observa la remoción del elemento del padre
        if (element.parentNode) {
            observer.observe(element.parentNode, { childList: true });
            this.observers.set(element, observer);
        }
    }

    const cached = this.charts.get(element);
    let yDomain: [number, number];
    if (cached && cached.items === items) {
      yDomain = cached.yDomain!;
    } else {
      yDomain = this.calcYDomain(items);
      this.charts.set(element, { items, options, yDomain });
    }

    const domRect = svg.node()?.getBoundingClientRect();
    if (!domRect || domRect.width <= 0 || domRect.height <= 0) return;

    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([domRect.height - this.paddingBottom, this.paddingTop]);

    if (options?.xAxis?.visible) {
      this.drawXAxis(svg, yScale, domRect.width);
    }

    // Calcular xScales solo una vez por categoryField
    const xScales = new Map<string, ScaleBand<string>>();
    items.forEach((item) => {
      if (!xScales.has(item.categoryField)) {
        xScales.set(
          item.categoryField,
          d3
            .scaleBand()
            .domain(item.data.map((d) => d[item.categoryField]))
            .range([0, domRect.width])
            .padding(item.padding ?? 0.5)
        );
      }
    });

    // Renderizar usando el mapa
    items.forEach((item) => {
      const xScale = xScales.get(item.categoryField)!;
      this.rendererMap[item.type]?.(
        svg,
        item,
        xScale,
        yScale,
        yDomain,
        domRect.width
      );
    });
  }
}