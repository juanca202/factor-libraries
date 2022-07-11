import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { Action } from '../../models/action';

@Component({
  selector: 'ft-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() actionOptions!: Action[];
  @Input() currentTitleOption!: Action;
  @Input() title!: string;
  @Input() titleOptions!: Action[];
  overlapped!: boolean;
  rootMargin: any = { rootMargin: '0px 0px 0px 0px' };

  constructor() {
    const breakpointSm = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-sm'));
    if (window.innerWidth < breakpointSm) {
      this.rootMargin = { rootMargin: '0px 0px 0px 0px' };
    }
  }

  ngOnInit(): void {
    if (this.titleOptions && !this.currentTitleOption) {
      this.currentTitleOption = this.titleOptions[0];
    }
  }
  @Input()
  class: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return [
      this.class,
      this.overlapped ? 'overlapped' : ''
    ].join(' ');
  }
  setOverlapped(overlapped: boolean): void {
    this.overlapped = !overlapped;
  }

}
