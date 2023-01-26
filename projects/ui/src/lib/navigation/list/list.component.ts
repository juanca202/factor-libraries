import { Component, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';

import { Action } from '../../models/action';

@Component({
  selector: 'ft-list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  @Output() actionSelected = new EventEmitter<Action>();
  @Input() iconCollection!: string;
  @Input() iconNameField: string = 'iconName';
  @Input() iconPath!: string;
  @Input() labelField: string = 'label';
  @Input() items!: Action[];
  @Input() selectable: null | 'single' | 'multiple' = null;
  @Input() selection: Action[] = [];
  @Input() itemTemplate!: TemplateRef<any>;

  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-list',
      this.class
    ].join(' ');
  };

  constructor() {
    this.actionSelected.subscribe((action: Action) => {
      switch (this.selectable) {
        case 'single':
          this.selection = [action];
          break;
        case 'multiple':
          this.selection.push(action);
          break;
      }
    });
  }

  updateAction(action: Action): Action {
    action.metadata = action.metadata || {};
    if (!action.id) {
      action.id = Math.floor(Math.random() * 1000000).toString();
    }
    if (!action.url) {
      action.metadata.componentType = 'button';
    } else {
      action.metadata.componentType = 'link';
      const urlParts = action.url.split('?');
      if (urlParts.length > 1) {
        const queryString = urlParts.at(-1);
        const searchParams = new URLSearchParams(queryString);
        action.url = urlParts[0];
        action.metadata.queryParams = Object.fromEntries(searchParams.entries());
      }
    }
    return action;
  }
  handleClick(action: Action): void {
    this.actionSelected.emit(action);
    if (action.url && action.url.match(/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)) {
      window.location.href = action.url;
    } else if (typeof action.click === 'function') {
      action.click();
    }
  }
  toggleCollapsible(action: Action): void {
    action.metadata = action.metadata || {};
    action.metadata.show = !action.metadata?.show;
    this.actionSelected.emit(action);
  }
  trackById(index: number, action: Action): any {
    return action.id || index;
  }
}
