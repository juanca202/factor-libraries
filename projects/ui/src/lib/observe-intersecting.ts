import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, inject, Injectable, input, output, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[ftObserveIntersecting]'
})
export class ObserveIntersecting {
  private element = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private elementObserver: IntersectionObserver | null = null;

  ftObserveIntersectingOptions = input<{
    root?: HTMLElement;
    rootMargin?: string;
    threshold?: number | number[];
  }>();
  public readonly ftObserveIntersecting = output<boolean>();

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
  ngOnDestroy(): void {
    if (this.elementObserver) {
      this.elementObserver.disconnect();
      this.elementObserver = null;
    }
  }
}
