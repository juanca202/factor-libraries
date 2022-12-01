import { Component, HostBinding, Input } from '@angular/core';

import { Action } from '../../models/action';

@Component({
  selector: 'ft-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() iconCollection!: string;
  @Input() iconNameField: string = 'iconName';
  @Input() labelField: string = 'label';
  @Input() labelPlacement: 'top' | 'right' | 'bottom' | 'left' | 'auto' | 'none' = 'auto';
  @Input() items!: Action[];
  @Input() position: 'top' | 'right' | 'bottom' | 'left' | 'auto' = 'auto';

  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-navbar',
      this.class,
      this.position
    ].join(' ');
  };

  constructor() { }

  getComponentType(item: Action): string {
    let type: string = 'text';
    if (!item.url || item.url.match(/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)) {
      type = 'button';
    } else {
      type = 'link';
    }
    return type;
  }
  setItem(item: Action): void {
    if (item.url) {
      if (item.url.match(/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)) {
        window.location.href = item.url;
      }
    } else if (item.click) {
      item.click();
    }
  }
  toggleCollapsible(action: Action): void {
    action.metadata.show = !action.metadata.show;
  }
  trackByItem(index: number, item: Action): string {
    return `${item.label} ${item.url}`;
  }
}
