import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AvatarComponent } from './avatar/avatar.component';
import { IconComponent } from './icon/icon.component';
import { ImageComponent } from './image/image.component';
import { ProgressComponent } from './progress/progress.component';
import { ObserveIntersectingDirective } from './observe-intersecting.directive';
import { MessageComponent } from './message/message.component';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [
    AvatarComponent,
    IconComponent,
    ImageComponent,
    ProgressComponent,
    ObserveIntersectingDirective,
    MessageComponent,
    ContentComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  exports: [
    AvatarComponent,
    IconComponent,
    ImageComponent,
    ProgressComponent,
    ObserveIntersectingDirective
  ]
})
export class UiModule { 
  public static forRoot(configuration?: any): ModuleWithProviders<UiModule> {
    return {
      ngModule: UiModule,
      providers: [
        { provide: 'FactorUiConfiguration', useValue: configuration }
      ]
    };
  }
}
