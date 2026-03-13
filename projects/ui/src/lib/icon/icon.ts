import { Component, computed, HostBinding, inject, input, signal } from '@angular/core';
import { UI_OPTIONS, UiOptions } from '../models/ui-options';

@Component({
  selector: 'ft-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  host: {
    class: 'ft-icon'
  }
})
export class Icon {
  private readonly UIOptions = inject(UI_OPTIONS, { optional: true });
  private options = signal<UiOptions | null>(this.UIOptions || null);
  public collection = input<string>();
  public mode = input<string>();
  public name = input.required<string>();
  public path = input<string>();
  public src = input<string>();
  public url = computed(() => {
    let collection = this.collection() ?? 'icons';
    let mode = this.mode();
    let path = this.path();
    const options = this.options()?.iconSettings;
    // Set the default collection if the mode is external
    if (!this.collection()) {
      if (options && options.collection) {
        collection = options.collection;
      } else if (this.mode() === 'external') {
        collection = 'icons';
      }
    }
    if (!this.mode()) {
      if (this.options()?.iconSettings && options?.mode) {
        mode = options.mode;
      } else {
        mode = 'external';
      }
    }
    if (mode === 'external') {
      // If the icon mode is external
      if (!this.path()) {
        if (options && 'path' in options) {
          path = options.path;
        } else {
          path = '';
        }
      }
      return `${path}/${collection}.svg#${this.name()}`;
    } else {
      // If the icon mode is inline
      const name =
        this.collection() && this.collection() !== 'unset'
          ? `${this.collection()}--${this.name()}`
          : this.name();
      return `#${name}`;
    }
  });
}
