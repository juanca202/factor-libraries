import { Component, HostBinding, Input } from '@angular/core';
import { Task } from '../../models/task';

@Component({
  selector: 'ft-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  startDate: Date | string = new Date();
  @Input() data: Task[] = [];
  @HostBinding('style.--current-date')
  currentDate!: number;
  dataParsed: any = {
    months: [],
    days: [],
    weekends: []
  };

  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-timeline',
      this.class
    ].join(' ');
  };

  constructor() { }

  ngOnInit(): void {
    this.addMonth(this.calcStartDate());
  }
  addMonth(date: Date): void {
    const month = this.getMonth(date.getMonth(), date.getFullYear());
    const currentDays = this.dataParsed.days.length;
    this.dataParsed.months = [...this.dataParsed.months, { date: month.days[0], daysInMonth: month.days.length }];
    this.dataParsed.days = [...this.dataParsed.days, ...month.days];
    this.dataParsed.weekends = [...this.dataParsed.weekends, ...month.weekends];
    if (!this.currentDate && month.currentDate) {
      this.currentDate = currentDays + month.currentDate;
    }
    this.dataParsed.days.some((day: Date, index: number) => {
      if ([0, 6].includes(day.getDay())) {
        this.dataParsed.weekendStart = index;
        return true;
      }
      return false;
    });
    this.parseTasks();
  }
  calcStartDate(): Date {
    return new Date();
  }
  getMonth(month: number, year: number): any {
    const days = [];
    const weekends = [];
    let currentDate: number | null = null;
    let today = new Date();
    const date = new Date(year, month + 1, 0);
    for (let i = 1; i <= date.getDate(); i++) {
      const idate = new Date(year, month, i);
      if ([0, 6].includes(idate.getDay())) {
        if (idate.getDay() === 6) {
          weekends.push([idate]);
        } else {
          weekends[weekends.length - 1].push(idate);
        }
      }
      if (idate.getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
        currentDate = i - 1;
      }
      days.push(idate);
    }
    const data: any = { days, weekends };
    if (currentDate) {
      data.currentDate = currentDate;
    }
    return data;
  }
  parseTasks(): void {
    let tasks = this.data.filter(task => task.endAt)/*.sort((a, b) => a.)*/;
    this.dataParsed.tasks = tasks.map((task) => {
      return {
        label: task.label,
        start: 10,
        type: task.type,
        size: 1
      };
    });
  }
}
