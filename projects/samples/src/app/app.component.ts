import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiModule } from '@factor_ec/ui';
import { FilesService } from '@factor_ec/utils';

@Component({
  imports: [RouterOutlet, UiModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'samples';
  fileService = inject(FilesService);

  ngOnInit(): void {
    console.log('Test');
  }
  attach(): void {
    this.fileService.open((value: any) => {
      console.log(value);
    });
  }
}
