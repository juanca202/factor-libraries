import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, input, OnInit, Output, PLATFORM_ID, inject } from '@angular/core';

@Directive({
  selector: '[ftObserveIntersecting]',
  standalone: true
})
export class ObserveIntersectingDirective implements OnInit {
  private element = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  ftObserveIntersectingOptions = input<{ root?: HTMLElement, rootMargin?: string, threshold?: number | number[] }>();
  @Output('ftObserveIntersecting') event: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if ("IntersectionObserver" in window) {
        const elementObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            this.event.emit(entry.isIntersecting);
          });
        }, this.ftObserveIntersectingOptions());
        elementObserver.observe(this.element.nativeElement);
      } else {
        console.error('ftObserveIntersecting not available in this browser.');
      }
    }
  }
}
