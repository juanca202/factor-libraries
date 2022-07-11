import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '../../models/action';

@Component({
  selector: 'ft-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Output()
  change = new EventEmitter<Action>();
  @Input()
  iconCollection!: string;
  @Input()
  iconNameField: string = 'iconName';
  @Input()
  iconPath!: string;
  @Input()
  labelField: string = 'label';
  @Input()
  items!: Action[];

  constructor(
    private router: Router
  ) { }

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
    this.change.emit(action);
  }

}
