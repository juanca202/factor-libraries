import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollapsibleComponent } from './collapsible/collapsible.component';
import { IoModule } from '../io/io.module';

@NgModule({
  declarations: [
    CollapsibleComponent
  ],
  exports: [
    CollapsibleComponent
  ],
  imports: [
    CommonModule,
    IoModule
  ]
})
export class LayoutModule { }
