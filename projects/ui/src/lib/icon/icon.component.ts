import { Component, computed, HostBinding, inject, input } from '@angular/core';

import { UiService } from '../ui.service';

@Component({
    selector: 'ft-icon',
    standalone: true,
    imports: [],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss'
})
export class IconComponent {
  private options = inject(UiService);
  public collection = input<string>();
  public mode = input<string>();
  public name = input.required<string>();
  public path = input<string>();
  public src = input<string>();
  public url = computed(() => {
    let collection = this.collection();
    let mode = this.mode();
    let path = this.path();
    const options = this.options.get().iconSettings;
    // Set the default collection if the mode is external
    if (!this.collection()) {
      if (options && options.collection) {
        collection = options.collection;
      } else if (this.mode() === 'external') {
        collection = 'icons';
      }
    }
    if (!this.mode()) {
      if (this.options.get().iconSettings && options.mode) {
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
          path = 'assets';
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
  public class = input<string>();
  @HostBinding('class') get hostClasses(): string {
    return ['ft-icon', this.class()].join(' ');
  }
}
