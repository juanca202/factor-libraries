import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { ListComponent } from './list/list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { DisplayModule } from '../display/display.module';
import { RouterModule } from '@angular/router';

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
    DisplayModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class NavigationModule { }
