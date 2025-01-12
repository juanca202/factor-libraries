import { Component, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ft-progress',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './progress.component.html',
    styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  mode = input<'determinate' | 'indeterminate'>('indeterminate');
  overlay = input<boolean>(false);
  value = input<number>(0);

  class = input<string>('');
  @HostBinding('class')
  get hostClasses(): string {
    return [
      'ft-progress',
      this.overlay() ? 'ft-progress--overlay' : '',
      this.class()
    ].join(' ');
  }
}
