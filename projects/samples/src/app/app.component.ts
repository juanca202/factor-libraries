import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  UiModule } from '@factor_ec/ui';

@Component({
  imports: [RouterOutlet, UiModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'samples';
}
