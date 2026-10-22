import { Component, HostBinding, input } from '@angular/core';

/**
 * Circular progress indicator.
 *
 * @remarks
 * Selector: `ft-progress`. Supports `determinate` mode (driven by `value`) and `indeterminate` mode.
 * With `overlay` the host gets the `ft-progress--overlay` class.
 *
 * @example
 * ```html
 * <ft-progress mode="determinate" [value]="60" />
 * ```
 */
@Component({
  selector: 'ft-progress',
  imports: [],
  templateUrl: './progress.html',
  styleUrl: './progress.css',
})
export class Progress {
  /**
   * Progress mode.
   *
   * @defaultValue `'indeterminate'`
   */
  mode = input<'determinate' | 'indeterminate'>('indeterminate');
  /**
   * Whether the indicator is displayed as an overlay (adds the `ft-progress--overlay` class).
   *
   * @defaultValue `false`
   */
  overlay = input<boolean>(false);
  /**
   * Progress percentage (0-100), used in `determinate` mode.
   *
   * @defaultValue `0`
   */
  value = input<number>(0);

  /**
   * Additional CSS classes applied to the host element.
   *
   * @defaultValue `''`
   */
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
