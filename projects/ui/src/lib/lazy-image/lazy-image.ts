import { Component, ElementRef, HostBinding, inject, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Image that is loaded lazily when it approaches the viewport.
 *
 * @remarks
 * Selector: `ft-lazy-image`. Uses `IntersectionObserver` (with a 200px bottom margin) to start preloading `src`.
 * The host gets the `ft-image--loading` class if loading takes longer than 100ms and `ft-image--error` if it fails.
 * Without `IntersectionObserver` support the image is shown immediately.
 *
 * @example
 * ```html
 * <ft-lazy-image src="https://example.com/photo.jpg" alt="Photo" />
 * ```
 */
@Component({
  selector: 'ft-lazy-image',
  imports: [Icon],
  templateUrl: './lazy-image.html',
  styleUrl: './lazy-image.css',
})
export class LazyImage {
  private element = inject(ElementRef);

  /** Additional CSS classes applied to the host element. */
  readonly class = input<string>('');
  /** Whether the image failed to load. Bound to the `ft-image--error` host class. */
  @HostBinding('class.ft-image--error') error!: boolean;
  /** Whether the image is currently loading. Bound to the `ft-image--loading` host class. */
  @HostBinding('class.ft-image--loading') loading: boolean = false;
  /** URL of the image to load. Required. */
  readonly src = input.required<string>();
  /** Alternative text for the image. */
  readonly alt = input<string>('');
  /** Whether the image has been loaded and can be displayed. */
  shown: boolean = false;

  /** Starts observing the host element and loads the image once it becomes visible. */
  ngOnInit() {
    if ('IntersectionObserver' in window) {
      let elementObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              let image = new Image();
              image.src = this.src();
              setTimeout(() => {
                if (!this.shown && !this.error) {
                  this.loading = true;
                }
              }, 100);
              image.onerror = () => {
                this.error = true;
                this.loading = false;
              };
              image.onload = () => {
                if ('decode' in image) {
                  image.decode().then(() => {
                    this.loading = false;
                    this.shown = true;
                  });
                } else {
                  this.loading = false;
                  this.shown = true;
                }
              };
              elementObserver.unobserve(this.element.nativeElement);
            }
          });
        },
        {
          rootMargin: '0px 0px 200px 0px',
        }
      );
      elementObserver.observe(this.element.nativeElement);
    } else {
      console.error('IntersectionObserver not available.');
      this.loading = false;
      this.shown = true;
    }
  }
  @HostBinding('class') get hostClasses(): string {
    return ['ft-image', this.class()].join(' ');
  }
}
