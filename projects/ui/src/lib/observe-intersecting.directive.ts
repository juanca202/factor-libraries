import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[ftObserveIntersecting]',
  standalone: true
})
export class ObserveIntersectingDirective implements OnInit {
  @Input('ftObserveIntersectingOptions') options!: { root?: any, rootMargin?: any, threshold?: any };
  @Output('ftObserveIntersecting') event: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private element: ElementRef,
    @Inject(PLATFORM_ID) private readonly platformId: object = {}
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if ("IntersectionObserver" in window) {
        const elementObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            this.event.emit(entry.isIntersecting);
          });
        }, this.options);
        elementObserver.observe(this.element.nativeElement);
      } else {
        console.error('ftObserveIntersecting not available in this browser.');
      }
    }
  }
}
