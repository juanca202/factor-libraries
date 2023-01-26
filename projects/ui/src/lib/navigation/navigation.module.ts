import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { IoModule } from '../io/io.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [
    ListComponent,
    ToolbarComponent
  ],
  exports: [
    ListComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    IoModule,
    LayoutModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class NavigationModule { }
