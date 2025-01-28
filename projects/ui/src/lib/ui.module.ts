import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';
import { IconComponent } from './icon/icon.component';
import { ImageComponent } from './image/image.component';
import { ProgressComponent } from './progress/progress.component';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AvatarComponent,
    IconComponent,
    ImageComponent,
    ProgressComponent,
    RatingComponent
  ],
  exports: [
    AvatarComponent,
    IconComponent,
    ImageComponent,
    ProgressComponent,
    RatingComponent
  ]
})
export class UiModule { }
