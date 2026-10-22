import { Component, computed, effect, HostBinding, inject, input, signal } from '@angular/core';
import { ColorUtil } from '@factor_ec/utils';

/**
 * Circular avatar that shows a user image or, while the image is missing or not yet loaded, the initials of a label.
 *
 * @remarks
 * Selector: `ft-avatar`. The background color is derived from the label via `ColorUtil.hex` unless `color` is provided.
 * The image is preloaded and decoded; the initials are hidden once it has loaded.
 *
 * @example
 * ```html
 * <ft-avatar label="John Doe" src="https://example.com/john.png" />
 * ```
 */
@Component({
  selector: 'ft-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  private colorService = inject(ColorUtil);

  /** Background color of the avatar. Defaults to a color generated from `label`. */
  color = input<string>();
  /** Initials computed from `label` (first and last word initials, uppercase). */
  initials = computed(() => {
    return this.getInitials(this.label());
  });
  /** Text used to compute the initials and the default background color. Required. */
  label = input.required<string>();
  /** Whether the image in `src` has been loaded and decoded. */
  loaded = signal<boolean>(false);
  /** URL of the avatar image. */
  src = input<string>();
  /** Value bound to the `--ft-avatar-bg-color` CSS variable of the host. */
  @HostBinding('style.--ft-avatar-bg-color') get backgroundColor(): string {
    return this.color() || this.colorService.hex(this.label());
  }
  /** Value bound to the `--ft-avatar-bg-image` CSS variable of the host (empty when there is no `src`). */
  @HostBinding('style.--ft-avatar-bg-image') get backgroundImage(): string {
    return this.src() ? `url(${this.src()})` : '';
  }
  /** Additional CSS classes applied to the host element. */
  class = input<string>();
  @HostBinding('class') get hostClasses(): string {
    return ['ft-avatar', this.class()].join(' ');
  }

  constructor() {
    // Usa `effect` para reaccionar a los cambios en el valor de `src`
    effect(() => {
      const value = this.src();
      if (value && value.trim() !== '') {
        const image = new Image();
        image.src = value;
        image.onload = () => {
          if ('decode' in image) {
            image.decode().then(() => {
              this.loaded.set(true);
            });
          } else {
            console.error('Image.decode not available.');
          }
        };
      }
    });
  }

  /**
   * Extracts the initials from a text.
   *
   * @param value - Text to extract the initials from
   * @returns Uppercase first letter of the first word plus first letter of the last word
   */
  getInitials(value: string): string {
    const allInitials: string[] = value.match(/\b\w/g) || [];
    const initials: string = ((allInitials.shift() || '') + (allInitials.pop() || '')).toUpperCase();
    return initials;
  }
}
