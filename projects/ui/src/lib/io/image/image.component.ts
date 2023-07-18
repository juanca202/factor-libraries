import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ft-image',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent
  ],
  templateUrl: './image.component.html'
})
export class ImageComponent {
  @Input() class: string = '';
  @HostBinding('class.ft-image--error') error!: boolean;
  @HostBinding('class.ft-image--loading') loading: boolean = false;
  @Input() src!: string;
  shown: boolean = false;

  constructor(
    private element: ElementRef
  ) { }

  ngOnInit() {
    if ("IntersectionObserver" in window) {
      let elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let image = new Image();
            image.src = this.src;
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
              if ("decode" in image) {
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
      }, {
        rootMargin: "0px 0px 200px 0px"
      });
      elementObserver.observe(this.element.nativeElement);
    } else {
      console.error('IntersectionObserver not available.');
      this.loading = false;
      this.shown = true;
    }
  }
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-image',
      this.class
    ].join(' ');
  }
}
