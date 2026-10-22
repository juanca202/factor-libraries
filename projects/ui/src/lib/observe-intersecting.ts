import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, inject, Injectable, input, output, PLATFORM_ID } from '@angular/core';

/**
 * Directive that reports when its host element enters or leaves the viewport (or a custom root).
 *
 * @remarks
 * Selector: `[ftObserveIntersecting]`. Wraps `IntersectionObserver` and does nothing outside the browser.
 * The observer is disconnected when the directive is destroyed.
 *
 * @example
 * ```html
 * <div ftObserveIntersecting
 *      [ftObserveIntersectingOptions]="{ rootMargin: '100px' }"
 *      (ftObserveIntersecting)="visible = $event">
 * </div>
 * ```
 */
@Directive({
  selector: '[ftObserveIntersecting]'
})
export class ObserveIntersecting {
  private element = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private elementObserver: IntersectionObserver | null = null;

  /** Options passed to the `IntersectionObserver` (`root`, `rootMargin`, `threshold`). */
  ftObserveIntersectingOptions = input<{
    root?: HTMLElement;
    rootMargin?: string;
    threshold?: number | number[];
  }>();
  /** Emits `true` when the host intersects the root and `false` when it stops intersecting. */
  public readonly ftObserveIntersecting = output<boolean>();

  /** Creates the `IntersectionObserver` and starts observing the host element (browser only). */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {
        this.elementObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry: IntersectionObserverEntry) => {
            this.ftObserveIntersecting.emit(entry.isIntersecting);
          });
        }, this.ftObserveIntersectingOptions());
        this.elementObserver.observe(this.element.nativeElement);
      } else {
        console.error('ftObserveIntersecting not available in this browser.');
      }
    }
  }
  /** Disconnects the observer and releases it. */
  ngOnDestroy(): void {
    if (this.elementObserver) {
      this.elementObserver.disconnect();
      this.elementObserver = null;
    }
  }
}
