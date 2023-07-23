import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'ft-message-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-content.component.html'
})
export class MessageContentComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }
}
