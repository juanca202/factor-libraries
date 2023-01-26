import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ft-collapsible',
  templateUrl: './collapsible.component.html'
})
export class CollapsibleComponent {
  @Input() class: string = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      'ft-collapsible',
      this.expanded ? 'ft-collapsible--show' : '',
      this.class
    ].join(' ');
  };

  @Input() expanded: boolean = true;
  @Input() header: string = '';

  toggleCollapsible(): void {
    this.expanded = !this.expanded;
  }

}
