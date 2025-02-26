import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  input,
  OnInit,
  PLATFORM_ID,
  inject,
  OutputEmitterRef,
  output,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[ftObserveIntersecting]',
  standalone: true
})
export class ObserveIntersectingDirective implements OnInit, OnDestroy {
  private element = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private elementObserver: IntersectionObserver | null = null;

  ftObserveIntersectingOptions = input<{
    root?: HTMLElement;
    rootMargin?: string;
    threshold?: number | number[];
  }>();
  public readonly event: OutputEmitterRef<boolean> = output({ alias: 'ftObserveIntersecting' });
  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {
        this.elementObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry: IntersectionObserverEntry) => {
            this.event.emit(entry.isIntersecting);
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
