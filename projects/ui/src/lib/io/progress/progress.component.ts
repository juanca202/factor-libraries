import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ft-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html'
})
export class ProgressComponent {
  @Input() class: string = '';
  @Input() color!: string;
  @Input() mode: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() overlay: boolean = false;
  @Input() size!: number;
  @Input() value!: number;

  constructor() { }

  ngOnInit() {
    this.value = 0;
  }
  @HostBinding('class')
  get hostClasses(): string {
    return [
      'ft-progress',
      this.overlay ? 'ft-progress--overlay' : '',
      this.class
    ].join(' ');
  }
}
