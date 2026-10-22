import { Component, computed, HostBinding, inject, input, signal } from '@angular/core';
import { UI_OPTIONS, UiOptions } from '../models/ui-options';

/**
 * Renders an SVG icon referenced from an SVG sprite.
 *
 * @remarks
 * Selector: `ft-icon`. Default `collection`, `mode` and `path` can be provided through the `UI_OPTIONS` token
 * (`iconSettings`). In `external` mode (default) the icon is referenced as `{path}/{collection}.svg#{name}`;
 * in inline mode it is referenced as `#{collection}--{name}` (or `#{name}` when no collection is set).
 *
 * @example
 * ```html
 * <ft-icon name="home" collection="outlined" />
 * ```
 */
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
  /** Icon collection (sprite file name in external mode). Falls back to `UI_OPTIONS` and then to `icons`. */
  public collection = input<string>();
  /** Reference mode: `external` (sprite file) or inline. Falls back to `UI_OPTIONS` and then to `external`. */
  public mode = input<string>();
  /** Icon identifier within the sprite. Required. */
  public name = input.required<string>();
  /** Base path of the sprite file in external mode. Falls back to `UI_OPTIONS` and then to an empty string. */
  public path = input<string>();
  /** Declared input; it is not used by the component logic. */
  public src = input<string>();
  /** Resolved SVG reference (`href`) for the icon according to `collection`, `mode`, `path` and `name`. */
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
