import { Component, inject } from '@angular/core';
import { MessageService } from '@factor_ec/ui';
import { FilesService } from '@factor_ec/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'samples-modules';
  fileService = inject(FilesService);
  messageService = inject(MessageService);
  setTopOverlapped(event: any): void {
    console.log(event);
  }

  attach(): void {
    this.fileService.open((value: any) => {
      this.messageService.show('Esta es una prueba');
      console.log(value);
    });
  }
}
