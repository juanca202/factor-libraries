import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListComponent } from './samples/list/list.component';
import { UiModule } from 'ui';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UiModule.forRoot({ icon: { path: 'assets', collection: 'factoricons-slim' } })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
