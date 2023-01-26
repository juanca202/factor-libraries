import { Component, HostBinding, Input } from '@angular/core';

import { ColorService } from '@factor_ec/utils';

@Component({
  selector: 'ft-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {
  _label!: string;
  _src!: string;
  @Input() color!: string;
  initials!: string;
  loaded!: boolean;
  @Input() set src(value: string | undefined) {
    if (value && value.trim() != '') {
      this._src = value;
      let image = new Image();
      image.src = value;
      image.onload = () => {
        if ("decode" in image) {
          image.decode().then(() => {
            this.loaded = true;
          });
        } else {
          console.error('Image.decode not available.');
        }
      };
    }
  }
  @Input() set label(value: string) {
    this._label = value;
    this.initials = this.getInitials(value);
  }
  @HostBinding('style.background-color') get backgroundColor(): string {
    return this.color || this.colorService.hex(this._label);
  }
  @HostBinding('style.background-image') get backgroundImage(): string {
    return this._src ? `url(${this._src})` : '';
  }
  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-avatar',
      this.class
    ].join(' ');
  }

  constructor(
    private colorService: ColorService
  ) { }

  ngOnInit() {

  }
  getInitials(value: string): string {
    let allInitials: string[] = value.match(/\b\w/g) || [];
    let initials: string = ((allInitials.shift() || '') + (allInitials.pop() || '')).toUpperCase();
    return initials;
  }
}
