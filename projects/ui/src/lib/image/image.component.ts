import {
  Component,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ft-image',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {
  private element = inject(ElementRef);

  readonly class = input<string>('');
  @HostBinding('class.ft-image--error') error!: boolean;
  @HostBinding('class.ft-image--loading') loading: boolean = false;
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  shown: boolean = false;

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
