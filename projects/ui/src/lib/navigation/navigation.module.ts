import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { IoModule } from '../io/io.module';

@NgModule({
  declarations: [
    ListComponent,
    NavbarComponent,
    ToolbarComponent,
    SearchboxComponent
  ],
  exports: [
    ListComponent,
    NavbarComponent,
    ToolbarComponent,
    SearchboxComponent
  ],
  imports: [
    CommonModule,
    IoModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class NavigationModule { }
