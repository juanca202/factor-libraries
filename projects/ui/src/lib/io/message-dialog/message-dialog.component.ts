import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ft-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    IconComponent
  ],
  templateUrl: './message-dialog.component.html'
})
export class MessageDialogComponent {
  @Output() beforeSelect: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  select(value: string) {
    this.beforeSelect.emit(value);
  }
}
