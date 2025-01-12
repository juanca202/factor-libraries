import { Injectable } from '@angular/core';

import * as d3 from 'd3';

import { Chart } from './models/chart';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private resizeTimeout!: ReturnType<typeof setTimeout>;
  private charts: Map<SVGElement, any> = new Map();

  constructor() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  remove(element: SVGElement): void {
    this.charts.delete(element);
  }
  render(element: SVGElement, items: Chart[]): void {
    // Clear svg
    const svg = d3.select(element).html('');
    
    // Resize event
    if (!this.charts.has(element)) {
      this.charts.set(element, items);
    }

    const values: number[] = [0];
    items.forEach((item) => {
      item.data.forEach((i) => {
        if (typeof i[item.field] === 'number') {
          values.push(i[item.field]);
        }
      });
    });
    if (values.length > 0) {
      const domain: any = d3.extent(values);

      // Dibujo los gráficos
      items.forEach((item) => {
        switch (item.type) {
          case 'limit':
            this.drawLimitChart(svg, { ...item, domain });
            break;
          case 'column':
            this.drawColumnChart(svg, { ...item, domain });
            break;
          case 'line':
            this.drawLineChart(svg, { ...item, domain });
            break;
          case 'circle':
            this.drawCircleChart(svg, { ...item, domain });
            break;
          case 'event':
            this.drawEventsPlaceholder(svg, { ...item, domain });
            break;
        }
      });
    }
  }
  private drawAxis(svg: any, values: any[], domain: any): void {
    const element = svg.node()?.getBoundingClientRect();
    const yScale = d3
      .scaleLinear()
      .domain(domain)
      .range([element?.height || 0 - 4, 4]);

    // Dibuja el eje en X
    svg.select('.x-axis').remove();
    svg
      .append('rect')
      .attr('class', 'x-axis')
      .attr('fill', 'rgba(0, 0, 0, 0.08)')
      .attr('x', 0)
      .attr('width', element?.width || 0)
      .attr('height', 1)
      .attr('shape-rendering', 'crispEdges')
      .attr('y', yScale(0));

    /*
    const yScale = d3.scaleLinear().domain([-5000, 8000]).range([this.height, 0]);
    const yAxisGenerator = d3.axisLeft(yScale).ticks(8);
    this.svg.append('g').call(yAxisGenerator).style('transform', 'translateX(50px)');
    */
  }
  private drawCircleChart(svg: any, options: Chart): void {
    const domRect: DOMRect = svg.node().getBoundingClientRect();
    const xAccessor = (d: any) => d[options.categoryField];
    const yAccessor = (d: any) => d[options.field] || 0;
    const xScale = d3
      .scaleBand()
      .domain(options.data.map(xAccessor))
      .range([0, domRect.width])
      .padding(typeof options.padding === 'number' ? options.padding : 0);
    const yScale = d3
      .scaleLinear()
      .domain(
        options.domain ?? [
          Math.min(d3.min(options.data, yAccessor), 0),
          d3.max(options.data, yAccessor),
        ]
      )
      .range([domRect.height - 10, 10]);

    const circles = svg
      .append('g')
      .attr('class', 'ft-chart__circle')
      .selectAll(`circle`)
      .data(options.data);
    circles
      .enter()
      .append('circle')
      .style('stroke', options.color ?? '#ff9800')
      .attr('stroke-width', options.strokeWidth ?? 1)
      .style('fill', 'var(--ft-body-bg)')
      .attr('r', 1.5)
      .merge(circles)
      .attr('cx', (d: any) =>
        Math.round((xScale(xAccessor(d)) || 0) + xScale.bandwidth() / 2)
      )
      .attr('cy', (d: any) =>
        Math.round(yScale(yAccessor(d)))
      );
    circles.exit().remove();
  }
  private drawColumnChart(svg: any, options: Chart): void {
    const element = svg.node().getBoundingClientRect();
    const xAccessor = (d: any) => d[options.categoryField];
    //const xAccessor = (d: any) => (new Date(d[options.categoryField]))?.getTime();
    const yAccessor = (d: any) => d[options.field] || 0;

    const xScale = d3
      .scaleBand()
      .domain(options.data.map(xAccessor))
      .range([0, element.width])
      .padding(options.padding ?? 0.5);
    const yScale = d3
      .scaleLinear()
      .domain(
        options.domain
          ? options.domain
          : [
              Math.min(d3.min(options.data, yAccessor), 0),
              d3.max(options.data, yAccessor),
            ]
      )
      .range([element.height - 4, 4]);

    const columns = svg
      .append('g')
      .attr('class', 'ft-chart__column')
      .selectAll('rect')
      .data(options.data);
    columns
      .enter()
      .append('rect')
      .attr('x', (d: any) => xScale(xAccessor(d)))
      .attr('y', (d: any) => yScale(yAccessor(d)))
      .attr('shape-rendering', 'crispEdges')
      .attr('fill', options.color ?? '#ff9800')
      .attr('title', (d: any) => d[options.field])
      .merge(columns)
      .attr('width', Math.max(1, xScale.bandwidth()))
      .attr('height', (d: any) => Math.abs(yScale(yAccessor(d)) - yScale(0)));
    columns.exit().remove();
  }
  private drawLineChart(svg: any, options: Chart): void {
    const domRect: DOMRect = svg.node().getBoundingClientRect();
    const xAccessor = (d: any) => d[options.categoryField];
    const yAccessor = (d: any) => d[options.field] || 0;
    const xScale = d3
      .scaleBand()
      .domain(options.data.map(xAccessor))
      .range([0, domRect.width])
      .padding(typeof options.padding === 'number' ? options.padding : 0);
    const yScale = d3
      .scaleLinear()
      .domain(
        options.domain ?? [
          Math.min(d3.min(options.data, yAccessor), 0),
          d3.max(options.data, yAccessor),
        ]
      )
      .range([domRect.height - 10, 10]);

    const lineGenerator = d3
      .line()
      .x((d: any) =>
        Math.round((xScale(xAccessor(d)) || 0) + xScale.bandwidth() / 2)
      )
      .y((d: any) => Math.round(yScale(yAccessor(d))));
    svg
      .append('path')
      .attr('class', 'ft-chart__line')
      .attr('fill', 'none')
      .attr('stroke', options.color ?? '#ff9800')
      .attr('stroke-width', options.strokeWidth ?? 2)
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator(options.data));
  }
  private drawLimitChart(svg: any, options: Chart): void {
    const element = svg.node().getBoundingClientRect();
    const yAccessor = (d: any) => d[options.field] || 0;
    const yScale = d3
      .scaleLinear()
      .domain(
        options.domain
          ? options.domain
          : [
              Math.min(d3.min(options.data, yAccessor), 0),
              d3.max(options.data, yAccessor),
            ]
      )
      .range([element.height - 4, 4]);
    const line = svg.append('g').selectAll('rect').data([options.data[0]]);
    line
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d: any) => yScale(yAccessor(d)) + 1)
      .attr('shape-rendering', 'crispEdges')
      .attr('fill', options.color ?? '#ff9800')
      .attr('title', 0)
      .attr('width', () => '100%')
      .attr('height', 1);
    line.exit().remove();

    line
      .enter()
      .append('text')
      .attr(
        'style',
        'font-weight: 600; font-size: var(--ft-text-font-size-sm);'
      )
      .attr('x', 0)
      .attr('y', (d: any) => yScale(yAccessor(d)) + 16)
      .attr('fill', 'var(--ft-danger-color)')
      .text(options.label);
  }
  private drawEventsPlaceholder(svg: any, options: Chart): void {
    const domRect: DOMRect = svg.node().getBoundingClientRect();
    const xAccessor = (d: any) => d[options.categoryField];
    const yAccessor = (d: any) => d[options.field] || 0;
    const xScale = d3
      .scaleBand()
      .domain(options.data.map(xAccessor))
      .range([0, domRect.width])
      .padding(typeof options.padding === 'number' ? options.padding : 0);
    const yScale = d3
      .scaleLinear()
      .domain(
        options.domain ?? [
          Math.min(d3.min(options.data, yAccessor), 0),
          d3.max(options.data, yAccessor),
        ]
      )
      .range([domRect.height, 0]);

    const columns = svg
      .append('g')
      .attr('class', 'ft-chart__placeholder')
      .selectAll('rect')
      .data(options.data);
    columns
      .enter()
      .append('rect')
      .attr('x', (d: any) => xScale(d[options.categoryField]))
      .attr('y', () => 0)
      .attr('shape-rendering', 'crispEdges')
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('tabindex', 0)
      .merge(columns)
      .attr('width', Math.max(1, xScale.bandwidth()))
      .attr('height', () => yScale(0))
      .on('click', (event: MouseEvent, d: any) => {
        if (options.click) {
          options.click(event, d);
        }
      });
    columns.exit().remove();
  }
  private handleResize(): void {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      for (const [element, items] of this.charts.entries()) {
        this.render(element, items);
      }
    }, 300);
  }
}
