import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AvatarComponent } from './avatar/avatar.component';
import { IconComponent } from './icon/icon.component';
import { ImageComponent } from './image/image.component';
import { MessageComponent } from './message/message.component';
import { ProgressComponent } from './progress/progress.component';
import { RatingComponent } from './rating/rating.component';
import { ObserveIntersectingDirective } from './observe-intersecting.directive';
import { TimelineComponent } from './timeline/timeline.component';
import { MessageContentComponent } from './message-content/message-content.component';
import { ExpressionBuilderComponent } from './expression-builder/expression-builder.component';

@NgModule({
  declarations: [
    AvatarComponent,
    IconComponent,
    ImageComponent,
    MessageComponent,
    ProgressComponent,
    RatingComponent,
    ObserveIntersectingDirective,
    TimelineComponent,
    MessageContentComponent,
    ExpressionBuilderComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  exports: [
    AvatarComponent,
    IconComponent,
    ImageComponent,
    MessageComponent,
    ProgressComponent,
    RatingComponent,
    ObserveIntersectingDirective,
    TimelineComponent,
    MessageContentComponent,
    ExpressionBuilderComponent
  ]
})
export class IoModule { }
