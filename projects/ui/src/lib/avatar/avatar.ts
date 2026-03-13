import { Component, computed, effect, HostBinding, inject, input, signal } from '@angular/core';
import { ColorUtil } from '@factor_ec/utils';

@Component({
  selector: 'ft-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  private colorService = inject(ColorUtil);

  color = input<string>();
  initials = computed(() => {
    return this.getInitials(this.label());
  });
  label = input.required<string>();
  loaded = signal<boolean>(false);
  src = input<string>();
  @HostBinding('style.--ft-avatar-bg-color') get backgroundColor(): string {
    return this.color() || this.colorService.hex(this.label());
  }
  @HostBinding('style.--ft-avatar-bg-image') get backgroundImage(): string {
    return this.src() ? `url(${this.src()})` : '';
  }
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

  getInitials(value: string): string {
    const allInitials: string[] = value.match(/\b\w/g) || [];
    const initials: string = ((allInitials.shift() || '') + (allInitials.pop() || '')).toUpperCase();
    return initials;
  }
}
