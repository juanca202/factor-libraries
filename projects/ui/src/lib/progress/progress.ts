import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'ft-progress',
  imports: [],
  templateUrl: './progress.html',
  styleUrl: './progress.css',
})
export class Progress {
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
