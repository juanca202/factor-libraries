import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Avatar, Icon, LazyImage, Rating, Progress } from '@factor_ec/ui';

@Component({
  selector: 'app-root',
  imports: [Avatar, Icon, LazyImage, Rating, Progress],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('factor-libraries');
}
